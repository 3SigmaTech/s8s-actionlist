import * as React from 'react';
export declare enum ActionListLayouts {
    'table' = "table",
    'board' = "board",
    'grid' = "grid",
    'calendar' = "calendar"
}
export declare enum ActionListTypes {
    'text' = "text",
    'link' = "link",
    'pill' = "pill",
    'ring' = "ring",
    'date' = "date",
    'time' = "time",
    'datetime' = "datetime",
    'percent' = "percent"
}
export type ActionListModalProps = {
    item: EnhancedActionListObject;
    onClose: () => void;
    show: boolean;
};
export type ActionListCellProps = {
    data: EnhancedActionListObject;
    column: ActionListColumn;
    settings: ActionListSettings;
};
export type ActionListCardProps = {
    item: EnhancedActionListObject;
    collection?: ActionListCollection;
    settings: ActionListSettings;
};
export type ActionListTileProps = {
    item: EnhancedActionListObject;
    settings: ActionListSettings;
};
export type ActionListEventProps = {
    item: EnhancedActionListObject;
    settings: ActionListSettings;
};
declare class ActionListHooks {
    boardDrop?: (item: EnhancedActionListObject, collection: ActionListCollection, settings: ActionListSettings) => boolean;
    eventDrop?: (item: EnhancedActionListObject, schedule: {
        start: Date;
        end: Date;
    }, settings: ActionListSettings) => boolean;
    eventCreate?: (start: Date, end: Date, allDay: boolean) => ActionListObject | null;
}
declare class ActionListComponents {
    modal?: (props: ActionListModalProps) => JSX.Element;
    cellComponent?: (props: ActionListCellProps) => JSX.Element;
    cardComponent?: (props: ActionListCardProps) => JSX.Element;
    tileComponent?: (props: ActionListTileProps) => JSX.Element;
    eventComponent?: (props: ActionListEventProps) => JSX.Element;
}
export declare class ActionListSettings {
    effects: React.EffectCallback[];
    cellOverrides: (ActionListTypes | string)[];
    tableActions?: (() => JSX.Element)[];
    layouts: (ActionListLayouts | string)[];
    layoutRenderers: {
        [key: string]: ((props: ActionListProps) => JSX.Element);
    };
    defaultLayout: (ActionListLayouts | string);
    dueSoonDays: number;
    enableManualOrder: boolean;
    enableBoardDragDrop: boolean;
    enableCalendarDragDrop: boolean;
    orderField: string;
    collectionField: string;
    scheduleStart: string;
    scheduleEnd?: string;
    calendarViews: string;
    defaultCalendarView: string;
    columns?: ActionListColumn[];
    collections?: ActionListCollection[];
    title?: string;
    hooks: ActionListHooks;
    components: ActionListComponents;
}
export declare const SettingsContext: React.Context<ActionListSettings>;
export type ActionListObject = {
    id: number;
    [key: string]: any;
};
export type ActionListObjectMetadata = {
    index: number;
    collectionIndex: number;
    offset: boolean;
};
export type EnhancedActionListObject = ActionListObject & ActionListObjectMetadata;
export type ActionListCollection = {
    index: number;
    label: string;
};
export type ActionListColumn = {
    label: string;
    type: ActionListTypes;
    accessor: string;
    sort_field?: string;
    ref?: string;
    className?: string;
    sortable?: boolean;
    tooltip?: string;
};
export type ActionListData = {
    list: ActionListObject[] | EnhancedActionListObject[];
};
export type ActionListProps = {
    data: ActionListData;
    settings: ActionListSettings;
};
export declare const ActionListClasses: {
    error: string;
    title: string;
    listContainer: string;
    viewButton: string;
    activeViewButton: string;
    duesoon: string;
    table: string;
    thead: string;
    th: string;
    sortAsc: string;
    sortDesc: string;
    sortable: string;
    tbody: string;
    tr: string;
    td: string;
    ring: string;
    bar: string;
    board: string;
    collection: string;
    collectionTitle: string;
    collectionItems: string;
    collectionDropHover: string;
    cardContainer: string;
    card: string;
    itemDropHover: string;
    itemDragging: string;
    cardPreview: string;
    cardTop: string;
    cardMiddle: string;
    cardBottom: string;
    cardSorter: string;
    cardTitle: string;
    cardRelated: string;
    grid: string;
    tileContainer: string;
    tile: string;
    tileTop: string;
    tileMiddle: string;
    tileBottom: string;
    tileSorter: string;
    tileTitle: string;
    tileRelated: string;
    eventContainer: string;
    event: string;
    eventContents: string;
    eventTitle: string;
    eventRelated: string;
};
export {};
//# sourceMappingURL=ActionListContext.d.ts.map