
import * as React from "react";

import { ActionListTile } from "./ActionListTile";

import { ActionListClasses as classes, SettingsContext } from "../../js/ActionListContext";
import type { ActionListProps } from "../../js/ActionListContext";

import type { ActionListTileProps, EnhancedActionListObject } from "../../js/ActionListContext";

export const ActionListGrid = (props: ActionListProps) => {

    // TODO: Review drag-drop use cases for grid
    // That is the reason this component is separate from the grid container
    return (
        <GridContainer
            {...props}
        />
    );
};

export default ActionListGrid;

const GridContainer = (props: ActionListProps) => {
    const settings = React.useContext(SettingsContext);

    return (
        <div className={classes.grid}>
            {Object.entries(props.data.list).map(function (item) {
                return (
                    <ActionListClickableTile
                        key={item[0]}
                        item={item[1] as EnhancedActionListObject}
                        settings={settings}
                    />
                )
            })}
        </div>
    );
};


const ActionListClickableTile = (props: ActionListTileProps) => {
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

    const TheTileComponent = settings.components.tileComponent || ActionListTile;

    return (
        <>
            <div className={classes.tileContainer} onClick={onOpen}>
                <TheTileComponent
                    {...props}
                />
            </div>
            {modal}
        </>
    );
}
