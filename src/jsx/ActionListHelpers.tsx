import { ActionListTypes, ActionListClasses as classes } from '../js/ActionListContext';
import type { EnhancedActionListObject, ActionListColumn } from '../js/ActionListContext';

export const applyObjectToString = (str: string|undefined, obj: { [key: string]: any }, context?: string):string => {
    if (!str) { return ''; }
    if (!context) {
        context = '';
    }

    for (let prop in obj) {
        if (typeof obj[prop] === 'object') {
            str = applyObjectToString(str, obj[prop], context + prop + '__');
        } else {
            str = str.replaceAll('{' + context + prop + '}', obj[prop]);
        }
    }
    return str;
}

export const textToClass = (mytext: string) => {
    return mytext.toLowerCase().replaceAll(' ', '');
}

export const textWithLf = (mytext: string | string[]) => {
    return Array.isArray(mytext)
        ? mytext.join('\n')
        : mytext;
}

export const prettyDate = (date: string | Date) => {

    let mydate: Date;
    if (typeof date == 'string') {
        mydate = new Date(date);
    } else {
        mydate = date;
    }

    var yy = mydate.getFullYear();
    var thisyear = (new Date()).getFullYear();

    if (yy != thisyear) {
        return mydate.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    } else {
        return mydate.toLocaleString('en-US', { month: 'short', day: 'numeric' })
    }
}

// TODO - document this function and introduce case statements
// or some other control flow that makes it more apparent
// what is returning.
export const getFieldText = (
    data: EnhancedActionListObject, column: ActionListColumn
) => {
    let accessor = column.accessor;

    let mytext = data?.[accessor];
    if (accessor.indexOf('__') > -1) {
        let accessors = accessor.split('__');
        let daisychain = data;
        for (let a of accessors) {
            daisychain = daisychain?.[a];
        }
        mytext = (daisychain ?? "");
    }
    if (mytext == undefined) {
        return [];
    }

    let value = mytext;

    if (Array.isArray(mytext)) {
        value = value.join('\n');
    }

    if ([ActionListTypes.percent, ActionListTypes.ring].includes(column.type)) {
        if (isNaN(parseFloat(mytext))) {
            mytext = '0%';
            value = 0;
        } else if (parseFloat(mytext) > 1) {
            mytext += '%';
        } else {
            mytext = (parseFloat(mytext) * 100) + '%';
        }
    }

    if (column.type == ActionListTypes.link && column.ref) {
        value = applyObjectToString(column.ref, data);
    }

    if ([ActionListTypes.date, ActionListTypes.time, ActionListTypes.datetime].includes(column.type)) {
        value = (new Date(mytext));
    }
    if (column.type == ActionListTypes.date) {
        mytext = (new Date(mytext)).toDateString();
    } else if (column.type == ActionListTypes.time) {
        mytext = (new Date(mytext)).toLocaleTimeString();
    } else if (column.type == ActionListTypes.datetime) {
        mytext = (new Date(mytext)).toLocaleDateString()
            + ' ' + (new Date(mytext)).toLocaleTimeString();
    }

    return [mytext, value];
}

export const duesoon = (date: string | Date, thresh?: number) => {
    let value:Date;
    if (typeof date == 'string') {
        value = new Date(date);
    } else {
        value = date;
    }
    let now = new Date();
    let diffTime: number = (value.getTime() - now.getTime());
    let diffDays = (diffTime / (1000 * 60 * 60 * 24));
    if (diffDays <= (thresh ?? 3)) {
        return true;
    }
    return false;
}

export const toTitleCase = (str: string): string => {
    return str.replace(
        /\w\S*/g,
        function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}

export const ProgressRing = (props: { value: number }) => {
    let value = props.value;
    if (value == undefined) {
        return <></>;
    }
    if (value < 1) {
        value = 100 * value;
    }
    value = (100 - value) / 100 * 114;

    return (
        <svg 
            className={classes.ring}
            width="46"
            height="46"
        >
            <circle r="18" cx="23" cy="23" fill="transparent" > </circle>
            <circle className="indicator" transform="rotate(90, 23, 23)"
                r="18" cx="23" cy="23"
                fill="transparent" strokeDasharray="114"
                style={{ strokeDashoffset: value }}
            >
                <animate
                    attributeName="stroke-dashoffset"
                    values={`114;${value}`}
                    dur="1s"
                    calcMode="linear"
                />
            </circle>
        </svg>
    );
}

export const ProgressBar = ({item, col, collClass}: {item: EnhancedActionListObject, col: ActionListColumn, collClass: string}) => {
    // Shows rings as a loading bars, when the proper CSS is defined

    let [mytext, value] = getFieldText(item, col);

    if (mytext == undefined) {
        return null;
    }

    const ringBarStyle = {
        '--progress': `${value}%`
    } as React.CSSProperties;

    const tooltip = `${col.label}: ${mytext}`;

    return (
        <div
            key={`${item.id}-${col.accessor}`}
            className={`${classes.bar} ${collClass} ${col.accessor}`}
            style={ringBarStyle}
            data-toggle='tooltip'
            title={tooltip}
        ></div>
    );
}

export const RelatedFooter = ({item, col, relatedClass}: {item: EnhancedActionListObject, col: ActionListColumn, relatedClass: string}) => {
    let [_mytext, value] = getFieldText(item, col);
    let newclass = applyObjectToString(col.className, item);

    return (
        <p
            key={`${item.id}-${col.accessor}`}
            className={`${relatedClass} ${newclass}`}
        >
            {value}
        </p>
    )
}