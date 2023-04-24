import * as React from "react";

import { ActionListClasses as classes } from "../../js/ActionListContext";

import { ActionListTypes } from "../../js/ActionListContext";
import type { ActionListCardProps } from "../../js/ActionListContext";

import * as helpers from "../ActionListHelpers";

export const ActionListCard = (props: ActionListCardProps) => {

    const { item, collection } = props;

    const settings = props.settings;

    const collClass = helpers.textToClass(
        collection?.label ?? item[settings.collectionField]
    );

    let ringbars: (JSX.Element | null)[] = [];
    let relateds: JSX.Element[] = [];
    for (let i = 0; i < (settings.columns?.length ?? 0); i++) {
        let col = settings.columns?.[i];

        if (!col) { continue; }
        if (col.type == ActionListTypes.ring) {
            ringbars.push(
                <helpers.ProgressBar
                    key={col.accessor}
                    item={item}
                    col={col}
                    collClass={collClass}
                />
            );
        } else if (col.accessor.indexOf('__') > -1) {
            <helpers.RelatedFooter
                key={col.accessor}
                item={item}
                col={col}
                relatedClass={classes.cardRelated}
            />
        }
    }

    const itemTitle = (settings.columns
        ? item[settings.columns?.[0].accessor]
        : '');


    let sorterClass = `${classes.cardSorter}`;
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
            className={`${classes.card}`}
        >
            <div className={classes.cardTop}>
                {ringbars}
                <div className={sorterClass}>
                    {sorterContent}
                </div>
            </div>
            <div className={classes.cardMiddle}>
                <p className={classes.cardTitle}>
                    {itemTitle}
                </p>
            </div>
            <div className={classes.cardBottom}>
                {relateds}
            </div>
        </div>
    );
}

