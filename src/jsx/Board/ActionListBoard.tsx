
import * as React from "react";
import { DndProvider, DropTargetMonitor } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";

import { ActionListBoardItem, ItemDragPreview } from "./ActionListBoardItem";
import { DropWrapper } from "./DragDrop/DropWrapper";
import { DragLayer } from './DragDrop/DragLayer';

import { ActionListColumn, ActionListClasses as classes, SettingsContext } from "../../js/ActionListContext";
import type { ActionListProps } from "../../js/ActionListContext";

import type { ActionListCollection, EnhancedActionListObject, ActionListSettings, ActionListObject } from "../../js/ActionListContext";

export const ITEM_TYPE = 'ITEM';

export const ActionListBoard = (props: ActionListProps) => {

    const settings = React.useContext(SettingsContext);

    let boardItems = listToBoardList(
        props.data.list,
        settings.collections,
        settings.collectionField
    );

    let usetouch = false;
    // @ts-ignore
    if (('ontouchstart' in window) || window.DocumentTouch && document instanceof window.DocumentTouch) {
        usetouch = true;
    }

    return (
        <DndProvider backend={(usetouch ? TouchBackend : HTML5Backend)}>
            <BoardContainer
                data={boardItems}
            // {...props}
            />
        </DndProvider>
    );
};

export default ActionListBoard;

function listToBoardList(
    items: ActionListObject[],
    collections: ActionListCollection[] | undefined,
    collectionField: string
) {
    let newList: { [key: number]: EnhancedActionListObject } = {};
    if (!collections) { return newList; }
    let indexTracker: { [key: string]: number } = {};
    for (let i = 0; i < items.length; i++) {
        let newItem = items[i] as EnhancedActionListObject;
        let myCollection = collections.filter((c) => c.label == newItem[collectionField])[0];

        newItem.index = (indexTracker[(myCollection?.label ?? '')] ?? 0);
        indexTracker[(myCollection?.label ?? '')] = newItem.index + 1;

        newItem.offset = false;
        newItem.collectionIndex = (myCollection?.index ?? 0);
        newList[newItem.id] = newItem;
    }
    return newList;
}

export type ActionListBoardProps = {
    data: { [key: string | number]: EnhancedActionListObject };
};

function BoardContainer(props: ActionListBoardProps) {

    const settings = React.useContext(SettingsContext);

    const [items, setItems] = React.useState(props.data);

    const setItemState = (id: number, key: string, value: any) => {
        if (!items[id] || !items[id]?.hasOwnProperty(key)) {
            return;
        }

        setItems((prevState) => {
            let newItems = prevState;
            if (newItems[id] != undefined) {
                newItems[id][key] = value;
            }
            return { ...newItems };
        });
    }

    const setCollectionState = (ids: number[], key: string, value: any) => {
        if (ids.length == 0) { return; }
        if (!items[ids[0]] || !items[ids[0]]?.hasOwnProperty(key)) {
            return;
        }

        setItems((prevState) => {
            let newItems = prevState;
            for (const id of ids) {
                if (newItems[id] != undefined) {
                    newItems[id][key] = value;
                }
            }
            return { ...newItems };
        });
    }

    const boardDrop = (
        item: EnhancedActionListObject,
        _monitor: DropTargetMonitor,
        collection: ActionListCollection
    ) => {
        let allowDrop = true;
        if (settings.hooks.boardDrop) {
            allowDrop = settings.hooks.boardDrop(item, collection, settings);
        }
        if (allowDrop) {
            setItems((prevState) => {
                return rearrangeBoard(item, collection, prevState, settings);
            });
        }
    };

    return (
        <div className={classes.board}>
            <DragLayer preview={ItemDragPreview} />
            {settings.collections?.map((s) => {
                return (
                    <ActionListColumn
                        key={s.label}
                        collection={s}
                        items={items}
                        boardDrop={boardDrop}
                        setItemState={setItemState}
                        setCollectionState={setCollectionState}
                    />
                );
            })}
        </div>
    );
};

type ColumnProps = {
    collection: ActionListCollection;
    items: { [key: number]: EnhancedActionListObject };
    boardDrop: (...args: any[]) => void;
    setItemState: (id: number, key: string, value: any) => void;
    setCollectionState: (ids: number[], key: string, value: any) => void;
};
const ActionListColumn = (props: ColumnProps) => {

    const settings = React.useContext(SettingsContext);

    const onDrop = (item: EnhancedActionListObject, _monitor: DropTargetMonitor, collection: ActionListCollection) => {
        props.boardDrop(item, _monitor, collection);
    }

    return (
        <div className={classes.collection}>
            <h4 className={classes.collectionTitle}>
                {props.collection.label.toUpperCase()}
            </h4>
            <DropWrapper<EnhancedActionListObject, ActionListCollection>
                onDrop={onDrop}
                meta={props.collection}
                enable={settings.enableBoardDragDrop}
                accept={ITEM_TYPE}
            >
                <ActionListColumnItems
                    items={props.items}
                    collection={props.collection}
                    setItemState={props.setItemState}
                    setCollectionState={props.setCollectionState}
                />
            </DropWrapper>
        </div>
    );
}

type ColumnItemsProps = {
    isOver?: boolean;
    items: { [key: number]: EnhancedActionListObject };
    collection: ActionListCollection;
    setItemState: (id: number, key: string, value: any) => void;
    setCollectionState: (ids: number[], key: string, value: any) => void;
}
const ActionListColumnItems = (props: ColumnItemsProps) => {

    const { isOver, items, collection } = props;

    const wrapperRef = React.useRef<HTMLDivElement>(null);

    let children: JSX.Element[] = [];
    let childIds: number[] = [];
    let myItems = Object.values(items)
        .filter((i) => i.collectionIndex == collection.index)
        .sort((a, b) => {
            if (a.index < b.index) { return -1; }
            else if (a.index > b.index) { return 1; }
            return 0;
        });
    for (const item of myItems) {
        childIds.push(item.id);
        children.push(
            <ActionListBoardItem
                key={item.id}
                item={item}
                type={ITEM_TYPE}
                collection={collection}
                setItemState={props.setItemState}
            />
        );
    }

    const onDragLeave: React.DragEventHandler = (event: React.DragEvent) => {
        // If user drags into then out of column, reset the hover classes
        if (event.target == wrapperRef.current) {
            props.setCollectionState(childIds, 'offset', false);
        }
    }

    let myclass = classes.collectionItems
        + (isOver ? ' ' + classes.collectionDropHover : "");

    return (
        <div
            ref={wrapperRef}
            onDragLeave={onDragLeave}
            className={myclass}
        >
            {children}
        </div>
    );
};

const rearrangeBoard = (
    item: EnhancedActionListObject,
    collection: ActionListCollection,
    prevState: { [key: string | number]: EnhancedActionListObject },
    settings: ActionListSettings
) => {

    // Add item to bottom of column it was dropped in
    let newItems = prevState;
    if (!newItems[item.id]) { return prevState; }
    let myItem = newItems[item.id];
    myItem[settings.collectionField] = collection.label;
    myItem.collectionIndex = collection.index;

    let siblings = Object.values(newItems).filter((i) => {
        return i.collectionIndex == myItem.collectionIndex
            && i.id != myItem.id;
    });

    // Define the new items index
    // We add one here for good measure
    // Specifically: moving to bottom of same list
    let myIndex = siblings.length + 1;
    for (const sibling of siblings) {
        if (sibling.offset) {
            myIndex = Math.min(myIndex, sibling.index);
        }
    }
    myItem.index = myIndex;

    // Update sibling indexes based on our new location
    for (const id in newItems) {
        if (!newItems[id]) {
            continue;
        }
        if (newItems[id]?.collectionIndex == myItem.collectionIndex
            && (newItems[id]?.index ?? 0) >= myItem.index
            && newItems[id]?.id != myItem.id
        ) {
            newItems[id].index += 1;
        }
    }

    // Clean up indexing - gremlins (same-column drops) mess it up
    let lastIndex = -1, lastCollectionIndex = -1;
    Object.values(newItems).sort((a, b) => {
        if (a.collectionIndex < b.collectionIndex) { return -1; }
        else if (a.collectionIndex > b.collectionIndex) { return 1; }
        if (settings.enableManualOrder) {
            if (a.index < b.index) { return -1; }
            else if (a.index > b.index) { return 1; }
        } else if (settings.orderField) {
            const ord = settings.orderField;
            try {
                if (a[ord] < b[ord]) { return -1; }
                else if (a[ord] > b[ord]) { return 1; }
            } catch (_e) {
                //eat
            }
        }
        return 0;
    }).forEach((item: EnhancedActionListObject) => {
        if (item.collectionIndex != lastCollectionIndex) {
            lastCollectionIndex = item.collectionIndex;
            lastIndex = 0;
            item.index = lastIndex;
        } else {
            lastIndex++;
            item.index = lastIndex;
        }
    });

    return { ...newItems };
}