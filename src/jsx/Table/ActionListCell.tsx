
import * as React from 'react';

import { ActionListClasses as classes, ActionListTypes } from '../../js/ActionListContext';
import type { ActionListCellProps } from '../../js/ActionListContext';
import * as helpers from '../ActionListHelpers';

export const ActionListCell = (props: ActionListCellProps) => {

    let { data, column } = props;

    let [mytext, value] = helpers.getFieldText(data, column);

    let myclass: string = column.type;
    if (column.type == ActionListTypes.pill) {
        myclass += (' ' + column.accessor);
        myclass += (' ' + helpers.textToClass(mytext));
    } else if (column.type == ActionListTypes.date || column.type == ActionListTypes.datetime) {
        if (helpers.duesoon(value)) {
            myclass += ' ' + classes.duesoon;
        }
    }

    if (column.className) {
        let newclass = helpers.applyObjectToString(column.className, data);
        if (newclass) {
            myclass += (' ' + newclass);
        }
    }

    return (
        <>
            {column.type == ActionListTypes.ring ? <helpers.ProgressRing value={value} /> : ''}
            <p className={myclass}>
                {column.type == ActionListTypes.link && column.ref
                    ? <a
                        href={value}
                        target="_blank"
                    >
                        {helpers.textWithLf(mytext)}
                    </a>
                    : <span
                    >
                        {helpers.textWithLf(mytext)}
                    </span>
                }
            </p>
        </>
    );
}
