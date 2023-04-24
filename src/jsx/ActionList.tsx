
import * as React from 'react';
import * as client from 'react-dom/client';

import {
    ActionListClasses as classes, SettingsContext,
    ActionListLayouts,
    ActionListSettings, ActionListProps, ActionListData
} from '../js/ActionListContext.js';

export * from '../js/ActionListContext.js';

import * as helpers from './ActionListHelpers';
export * as helpers from './ActionListHelpers';

import { ActionListTable } from './Table/ActionListTable.jsx';
import { ActionListBoard } from './Board/ActionListBoard.jsx';
import { ActionListGrid } from './Grid/ActionListGrid.jsx';
import { ActionListCalendar } from './Calendar/ActionListCalendar.jsx';

export function renderActionList(tgt: string, data: ActionListData, settings: ActionListSettings) {
    // Just in case
    tgt = tgt.replace('#', '');

    const root = client.createRoot(
        document.getElementById(tgt) as HTMLElement
    );
    root.render(<ActionList data={data} settings={settings} />);
}

export function ActionList(props: ActionListProps) {

    const [activeLayout, setActiveLayout] = React.useState(props.settings.defaultLayout);

    for (let i = 0; i < props.settings.effects.length; i++) {
        React.useEffect(props.settings.effects[i]);
    }

    let title:JSX.Element = <></>;
    if (props.settings.title) {
        title = (
            <h1 className={classes.title}>
                {props.settings.title}
            </h1>
        );
    }
    return (
        <SettingsContext.Provider value={props.settings}>
            {title}
            <ActionListLayoutControls
                activeLayout={activeLayout}
                setLayout={setActiveLayout}
            />
            <div style={{ clear: 'both' }}></div>
            <div className={classes.listContainer}>
                <ActionListMain {...props} activeLayout={activeLayout} />
            </div>
        </SettingsContext.Provider>
    );
}
export default ActionList;

type LayoutControlsProps = {
    activeLayout: ActionListLayouts|string;
    setLayout: React.Dispatch<React.SetStateAction<ActionListLayouts|string>>;
}
function ActionListLayoutControls(props: LayoutControlsProps) {
    const settings = React.useContext(SettingsContext);

    let cls = classes.viewButton;
    let aCls = classes.viewButton + ' ' + classes.activeViewButton;

    if (settings.layouts.length <= 1) {
        return <></>;
    }

    let layoutButtons:JSX.Element[] = []
    for (let i = 0; i < settings.layouts.length; i++) {
        const layout = settings.layouts[i];
        layoutButtons.push(
            <div
                key={layout}
                className={(props.activeLayout == layout ? aCls : cls)}
                onClick={() => props.setLayout(layout)}
            >
                {helpers.toTitleCase(layout)}
            </div>
        );
    }

    return (
        <div className={`action-list-layouts ${props.activeLayout}Active`}>
            {layoutButtons}
        </div>
    );
}

const ActionListMain = (
    fullprops: ActionListProps & {
    activeLayout: ActionListLayouts|string}
) => {

    const settings = React.useContext(SettingsContext);

    let {
        activeLayout, ...props
    } = fullprops;

    switch (activeLayout) {
        case ActionListLayouts.table:
            return (
                <ActionListTable {...props} />
            );
        case ActionListLayouts.board:
            return (
                <ActionListBoard {...props} />
            );
        case ActionListLayouts.grid:
            return (
                <ActionListGrid {...props} />
            );
        case ActionListLayouts.calendar:
            return (
                <ActionListCalendar {...props} />
            )
        default:
            if (!settings.layoutRenderers[activeLayout]) {
                return <></>;
            } else {
                let ListRenderer = settings.layoutRenderers[activeLayout];
                return (
                    <ListRenderer {...props} />
                );
            }
    }
}

