import * as React from 'react';

import * as helpers from '../ActionListHelpers';

import { ActionListTypes, ActionListClasses as classes } from '../../js/ActionListContext';
import type { EnhancedActionListObject, ActionListEventProps, ActionListColumn } from '../../js/ActionListContext';


export const ActionListEvent = ({ item, settings }: ActionListEventProps) => {

    // Use the same class scheme as is used in ActionListBoard
    const collClass = helpers.textToClass(
        item[settings.collectionField]
    );

    let ringbars: (JSX.Element | null)[] = [];
    let relateds: JSX.Element[] = [];
    let ringNum = 0;
    for (let i = 0; i < (settings.columns?.length ?? 0); i++) {
        let col = settings.columns?.[i];

        if (!col) { continue; }
        if (col.type == ActionListTypes.ring) {
            ringbars.push(makeRingBar(item, col, collClass, ringNum));
            ringNum++;
        } else if (col.accessor.indexOf('__') > -1) {
            relateds.push(makeRelated(item, col, classes.eventRelated))
        }
    }

    const itemTitle = (settings.columns
        ? item[settings.columns?.[0].accessor]
        : '');

    return (
        <div
            className={`${classes.eventContents} ${collClass}`}
            style={{ paddingRight: (ringNum * ringBarWidth) + 'px' }}
        >
            <p className={classes.eventTitle}>
                {itemTitle}
            </p>
            {relateds}
            {ringbars}
        </div>
    );
}

// TODO: make configurable?
const ringBarWidth = 5;

// TODO: generalize and move to helpers
const makeRingBar = (item: EnhancedActionListObject, col: ActionListColumn, collClass: string, index: number) => {
    // Shows rings as a side bars

    let [mytext, value] = helpers.getFieldText(item, col);

    if (mytext == undefined) {
        return null;
    }

    const ringBarStyle = {
        background: `linear-gradient(180deg, `
            + `var(--${collClass}) ${value}%, `
            + `var(--white) ${value}%)`,
        right: (index * ringBarWidth) + 'px',
        width: ringBarWidth + 'px'
    }

    const tooltip = `${col.label}: ${mytext}`;

    return (
        <div
            key={`${item.id}-${col.accessor}`}
            className={`action-list-event-ring ${collClass} ${col.accessor}`}
            style={ringBarStyle}
            data-toggle='tooltip'
            title={tooltip}
        ></div>
    );
}


const makeRelated = (item: EnhancedActionListObject, col: ActionListColumn, relatedClass: string) => {
    let [_mytext, value] = helpers.getFieldText(item, col);
    let newclass = helpers.applyObjectToString(col.className, item);

    return (
        <p
            key={`${item.id}-${col.accessor}`}
            className={`${relatedClass} ${newclass}`}
        >
            {value}
        </p>
    )
}