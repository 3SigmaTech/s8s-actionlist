import * as React from "react";
import type { DropTargetMonitor } from 'react-dnd';
import { DragWrapper } from "./DragDrop/DragWrapper";
import type { DragLayerCollectedProps } from './DragDrop/DragLayer';

import { SettingsContext, ActionListClasses as classes } from "../../js/ActionListContext";
import type { ActionListCardProps, ActionListCollection, EnhancedActionListObject } from "../../js/ActionListContext";
import { ActionListCard } from './ActionListCard';

type ActionListBoardItemProps = {
    item: EnhancedActionListObject;
    collection: ActionListCollection;
    setItemState: (id:number, key:string, value:any) => void;
    type: string;
}

export const ActionListBoardItem = (props: ActionListBoardItemProps) => {

    const settings = React.useContext(SettingsContext);

    const cardRef = React.useRef<HTMLDivElement>(null);

    const onHover = (hoveringItem:EnhancedActionListObject, monitor:DropTargetMonitor) => {
        if (!settings.enableManualOrder) { return; }
        if (!cardRef.current) { return; }
        
        if (hoveringItem.id === props.item.id) {
            return;
        }
        
        const hoveredRect = cardRef.current.getBoundingClientRect();
        // TODO: See if there is a way to improve this
        // It can cause "dancing" of the hovered card
        const hoverMiddleY = (hoveredRect.bottom - hoveredRect.top)/2;
        const mousePosition = monitor.getClientOffset();
        const hoverClientY = (mousePosition?.y ?? 0) - hoveredRect.top;

        if (hoverClientY < hoverMiddleY) {
            props.setItemState(props.item.id, 'offset', true);
            return;
        }
        if (hoverClientY > hoverMiddleY) {
            props.setItemState(props.item.id, 'offset', false);
            return;
        }
    }

    return (
        <DragWrapper<EnhancedActionListObject>
            meta={props.item}
            type={props.type}
            onHover={onHover}
            customDragPreview={true}
        >
            <ActionListClickableCard
                cardRef={cardRef}
                item={props.item}
                collection={props.collection}
                settings={settings}
            />
        </DragWrapper>
    );

}

type ClickableCardProps = ActionListCardProps & {
    cardRef: React.RefObject<HTMLDivElement>;
    setShow?: (show: boolean) => void;
    isDragging?: boolean;
};

export const ActionListClickableCard = (props:ClickableCardProps) => {
    const settings = React.useContext(SettingsContext);

    const [show, setShow] = React.useState(false);
    const onClose = () => { setShow ? setShow(false) : undefined; };
    const onOpen = () => { setShow ? setShow(true) : undefined; };

    let modal: JSX.Element | null = null;

    if (settings.components.modal) {
        modal = React.createElement(settings.components.modal, {
            item: props.item,
            onClose: onClose,
            show: show
        });
    }


    const TheCardComponent = settings.components.cardComponent || ActionListCard;

    return (
        <>
            <div
                ref={props.cardRef}
                className={`${classes.cardContainer} ${(props.isDragging ? classes.itemDragging : '')
                    } ${(props.item.offset ? classes.itemDropHover : '')
                    }`}
                onClick={onOpen}
            >
                <TheCardComponent
                    {...props}
                />
            </div>
            {modal}
        </>
    );
}

export function ItemDragPreview(props: DragLayerCollectedProps<EnhancedActionListObject>) {
    const settings = React.useContext(SettingsContext);

    const styles = {
        width: `${props.item.clientWidth || 243}px`,
        height: `${props.item.clientHeight || 243}px`,
    };

    if (settings.components.cardComponent) {
        return (
            <div className={classes.cardPreview} style={styles}>
                <settings.components.cardComponent {...props} settings={settings} />
            </div>
        );
    } else {
        return (
            <div className={classes.cardPreview} style={styles}>
                <ActionListCard {...props} settings={settings} />
            </div>
        );
    }
};
