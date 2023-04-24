import * as React from "react";
import type * as CSS from 'csstype';

import { ActionListClasses as classes } from "../../js/ActionListContext";

import { ActionListTypes } from "../../js/ActionListContext";
import type { ActionListTileProps } from "../../js/ActionListContext";

import * as helpers from "../ActionListHelpers";


export const ActionListTile = ({ item, settings }: ActionListTileProps) => {

    // Only add a pointer if the modal is enabled
    let mstyle: CSS.Properties = {};
    if (settings.components.modal) {
        mstyle.cursor = 'pointer';
    }

    const collClass = helpers.textToClass(
        item[settings.collectionField]
    );

    let rings: (JSX.Element | null)[] = [];
    let relateds: JSX.Element[] = [];
    for (let i = 0; i < (settings.columns?.length ?? 0); i++) {
        let col = settings.columns?.[i];

        if (!col) { continue; }
        if (col.type == ActionListTypes.ring) {
            let [_mytext, value] = helpers.getFieldText(item, col);

            rings.push(
                <helpers.ProgressRing
                    key={col.accessor}
                    value={value}
                />
            );
        } else if (col.accessor.indexOf('__') > -1) {
            relateds.push(
                <helpers.RelatedFooter
                    key={col.accessor}
                    item={item}
                    col={col}
                    relatedClass={classes.tileRelated}
                />
            );
        }
    }

    const itemTitle = (settings.columns
        ? item[settings.columns?.[0].accessor]
        : '');

    let sorterClass = `${classes.tileSorter}`;
    let sorterContent = item[settings.orderField];

    let orderCol = settings.columns?.filter((c) => c.accessor == settings.orderField)?.[0];
    if (orderCol) {
        if (orderCol.type == ActionListTypes.date || orderCol.type == ActionListTypes.datetime) {
            sorterClass += (' ' + orderCol.type);
            sorterContent = helpers.prettyDate(item[settings.orderField]);
            if (helpers.duesoon(item['duedate'], settings.dueSoonDays)) {
                sorterClass += (' ' + classes.duesoon);
            }
        }
    }

    return (
        <div
            className={`${classes.tile} ${collClass}`}
            style={mstyle}
        >
            <div className={classes.tileTop}>
                {rings}
                <div className={sorterClass}>
                    {sorterContent}
                </div>
            </div>
            <div className={classes.tileMiddle}>
                <p className={classes.tileTitle}>
                    {itemTitle}
                </p>
            </div>
            <div className={classes.tileBottom}>
                {relateds}
            </div>
        </div>
    );
}
