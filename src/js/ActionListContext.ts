
import * as React from 'react';

export enum ActionListLayouts {
    'table' = 'table',
    'board' = 'board',
    'grid' = 'grid',
    'calendar' = 'calendar'
};

export enum ActionListTypes {
    'text' = 'text',
    'link' = 'link',
    'pill' = 'pill',
    'ring' = 'ring',
    'date' = 'date',
    'time' = 'time',
    'datetime' = 'datetime',
    'percent' = 'percent'
};

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
    // This will not be included in props when rendering the drag preview
    collection?: ActionListCollection;
    settings: ActionListSettings;
};

export type ActionListTileProps = {
    item: EnhancedActionListObject;
    settings: ActionListSettings;
}

export type ActionListEventProps = {
    item: EnhancedActionListObject;
    settings: ActionListSettings;
};

class ActionListHooks {
    /**
     * Triggers when a card is dropped on the board. Passed parameters are:
     *  - item: The item rendered in the card.
     *  - collection: The collection the card was dropped in
     *  - settings: The settings passed to the ActionList
     * Return false to prevent the card from being dropped into this collection.
     * Note: use falsey return sparingly as this could be frustrating to the end-user
     * Note: this hook will _always_ be called, even if the card is dropped in
     * the same collection.
     */
    boardDrop?: (item: EnhancedActionListObject, collection: ActionListCollection, settings:ActionListSettings) => boolean;
    
    /**
     * Triggers when an event is dropped on the calendar. Passed parameters are:
     *  - item: The item rendered in the card.
     *  - schedule: {start: Date, end: Date}
     *      - The new start date/time [and end date/time if it exists, otherwise null]
     *  - settings: The settings passed to the ActionListThe item rendered in the event
     * Return false to prevent the event from being rescheduled.
     * Note: use falsey return sparingly as this could be frustrating to the end-user
     * Note: this hook will _always_ be called, even if the event is dropped in
     * the same date/time slot.
     * */
    eventDrop?: (item: EnhancedActionListObject, schedule:{start:Date, end:Date}, settings:ActionListSettings) => boolean;

    /**
     * Triggers when the user selects a date/time range on the calendar
     * or selects just a start date for an all-day event. Pass parameters are:
     *  - start: The start date/time selected.
     *  - end: The end date/time selected.
     *  - allDay: Boolean indicating the event is all day.
     * Return null to prevent the event from being rescheduled.
     * Note: use falsey return sparingly as this could be frustrating to the end-user
     */
    eventCreate?: (start:Date, end:Date, allDay:boolean) => ActionListObject|null;
};

class ActionListComponents {

    /**
     * Set what modal element to use when an item is clicked in the action list.
     * If this is not set, modal rendering will be disabled.
     */
    modal?: (props: ActionListModalProps) => JSX.Element;

    /**
     * This component will be called for all types listed in `cellOverrides`.
     * This allows for selectively customizing the ActionListTable component.
     */
    cellComponent?: (props: ActionListCellProps) => JSX.Element;

    /**
     * By default, the board will render the ActionListCard component. 
     * This allows you to override this default layout.
     */
    cardComponent?: (props: ActionListCardProps) => JSX.Element;

    /**
     * By default, the grid will render the ActionListTile component. 
     * This allows you to override this default layout.
     */
    tileComponent?: (props: ActionListTileProps) => JSX.Element;

    /**
     * By default, the calendar will render the ActionListEvent component. 
     * This allows you to override this default layout.
     */
    eventComponent?: (props: ActionListEventProps) => JSX.Element;

};
export class ActionListSettings {

    /**
     * An array of functions to add to the tables behavior (added with React.useEffect).
     * This allows for conditionally enabling tooltips
     * (and consequently removing the bootstrap dependency from this project)
     */
    effects: React.EffectCallback[] = [];

    /**
     * This defines the list of column (aka field) types override by `cellComponent`.
     * It is up to you to handle each overridden type as you require.
     */
    cellOverrides:(ActionListTypes|string)[] = [];

    /**
     * These render across the top of the Table view
     * TODO: Create similar settings for the Board and Calendar views as well.
     */
    tableActions?:(()=>JSX.Element)[] = [];

    /**
     * The list of available layouts. The ActionList component supports:
     * Available options are:
     * - `table`: This renders the action list as a table
     *      (See `ActionListColumn` for details on how each column is rendered)
     * - `grid`: Rendered as a grid of tiles.
     *      Data is rendered in the order it was received and is immutable.
     *      (See `ActionListTile` for deatils on how each tile is rendered)
     * - `board`: Rendered as a trello-like board
     *      Use `collections` property to define columns,
     *      `orderField` to define the ordering with the columns,
     *      and use the `collectionField` property to map objects to columns.
     * - `calendar`: Rendered as a calendar with Month, Week, and Day layouts
     *      Use `scheduleStart` and (optionally) `scheduleEnd` fields
     *      to define event start/end times. If `scheduleEnd` is omitted, events
     *      default to all-day events.
     */
    layouts:(ActionListLayouts|string)[] = [
        ActionListLayouts.table,
        ActionListLayouts.board,
        ActionListLayouts.grid,
        ActionListLayouts.calendar
    ];

    /**
     * For custom layouts (defined in `layouts`), define their associated
     * components with this object.
     * Note: you cannot use this property to override default renderers.
     */
    layoutRenderers: {
        [key: string]: ((props: ActionListProps)=>JSX.Element)
    } = {};

    /**
     * Initial layout used to display the list (defaults to `table`).
     * See `layouts` for available options.
     */
    defaultLayout: (ActionListLayouts | string) = ActionListLayouts.table;

    /**
     * What constitutes a task/action being considered "due soon".
     * This defaults to 3 days, meaning anything due within the next three days
     * is considered to be due "soon".
     */
    dueSoonDays: number = 3;

    /**
     * Allows the end-user to re-order items in a collection (cards in a list)
     * If set to false, ordering will be controlled by the orderField parameter.
     */
    enableManualOrder: boolean = false;

    /**
     * Allows for disabling drag and drop in the Board view.
     * If set to false, items will be rendered in their original collection
     * and cannot be moved unless they are edited.
     */
    enableBoardDragDrop: boolean = true;

    /**
     * Allows for disabling drag and drop in the Board view.
     * If set to false, items will be rendered in their original schedule
     * and cannot be moved unless they are edited.
     */
    enableCalendarDragDrop: boolean = true;
    
    /**
     * If manualOrder is set to false, this allows for defining the automatic
     * ordering of the items in a collection (cards in a list).
     * If this is empty|null|undefined, items drop on the bottom of the list
     */
    orderField: string = 'duedate';

    /**
     * This setting defines the field that maps objects into collections.
     * Collections define the columns of the `board` layout type.
     */
    collectionField: string = 'status';

    /**
     * Defines a start date/time field for events in the calendar.     
     */
    scheduleStart: string = 'duedate';

    /**
     * Optionally defines an end date/time field for events in the calendar.
     * If omitted, events will be shows as all-day events.
     */
    scheduleEnd?: string = '';

    /**
     * Available calendar view options. Note options under "Views" here:
     *  https://fullcalendar.io/docs#toc
     */
    calendarViews: string = 'multiMonthYear,dayGridMonth,dayGridWeek,dayGridDay';

    /**
     * The default calendar view option (be sure to include in the above setting).
     */
    defaultCalendarView: string = 'dayGridMonth';

    /**
     * Defines the data fields of the ActionListObject objects.
     * For default components (Card and Event) the first column is
     * used as the "title" for these components.
     */
    columns?: ActionListColumn[];

    /**
     * Defines the "lists" in the board view. ActionListObjects will be
     * displayed in the collection defined by their `collectionField`.
     */
    collections?: ActionListCollection[];

    /**
     * Optional title. If set, an `h1` tag will be displayed above the rest
     * of the component. 
     */
    title?:string = '';

    /**
     * Used to define action hooks for the ActionList.
     * See the `ActionListHooks` class documentation for details
     */
    hooks:ActionListHooks = new ActionListHooks();

    /**
     * Used to define custom renderers for the ActionList.
     * See the `ActionListComponents` class documentation for details
     */
    components:ActionListComponents = new ActionListComponents();
};
export const SettingsContext = React.createContext(new ActionListSettings());


// This defines the base objects rendered in the list
// Only the `id` property is required
// (Though it is recommended to have `collectionField` and `orderField` as well)
export type ActionListObject = {
    id: number;
    [key: string]: any;
};

// This type holds assorted metadata used in rendering the ActionList
export type ActionListObjectMetadata = {
    index: number;
    collectionIndex: number;
    offset: boolean;
};

export type EnhancedActionListObject = ActionListObject & ActionListObjectMetadata;

// This defines the columns/collections in the Board view
// It will be used for adding classes to events and tiles as well
export type ActionListCollection = {
    index: number;
    label: string;
};

// This defines the columns in the Table view
export type ActionListColumn = {
    
    // The text displayed to the user in the †able header
    label: string;

    // The data type stored in this column
    type: ActionListTypes;

    // The property in the `ActionListObject` referenced by this column
    accessor: string;

    // Allows for sorting by hidden fields.
    // For example a `status` column might have a related `status_index`
    // Setting `sort_field` to `status_index` will allow you to set
    // a sorting order that is not alphabetical (e.g. New = 1, Done = 2)
    sort_field?: string;

    // `ref` is a template string to define link urls
    // You can also pass a plain string to use as the href
    // See the Readme, Settings section, for more details on templating.
    ref?: string;
    
    // `className` is a template string to define a class
    // You can also pass a plain string to add a class to each td in a column.
    // This is very useful for selectively styling items based on type, etc.
    // See the Readme, Settings section, for more details on templating.
    className?: string;
    
    // Whether the column can be sorted or not
    sortable?: boolean;

    // In case you want to use tooltips (e.g. Bootstrap tooltips)
    // This parameter allows you to add a `title` value to column headers
    tooltip?: string;
};

export type ActionListData = {
    // This once included a lot of what are now settings
    // e.g. collections and columns.
    // This is why it is a separate type.
    // TODO: review the wisdom of this being a type at all.
    list: ActionListObject[] | EnhancedActionListObject[];
};


export type ActionListProps = {
    data: ActionListData;
    settings: ActionListSettings;
};

export const ActionListClasses = {
    error: 'action-list-error',
    title: 'action-list-title',
    listContainer: 'action-list-container',
    viewButton: 'action-list-layout-type',
    activeViewButton: 'action-list-active-layout',
    duesoon: 'action-list-due-soon',

    table: 'action-list-table',
    thead: 'action-list-head',
    th: 'action-list-column-head',
    sortAsc: 'up',
    sortDesc: 'down',
    sortable: 'unsorted',
    tbody: 'action-list-body',
    tr: 'action-list-row',
    td: 'action-list-cell',
    ring: 'action-list-ring',
    bar: 'action-list-bar',

    board: 'action-list-board',
    collection: 'action-list-collection',
    collectionTitle: 'action-list-collection-title',
    collectionItems: 'action-list-collection-items',
    collectionDropHover: 'action-list-drop-zone',

    cardContainer: 'action-list-card-container',
    card: 'action-list-card',
    itemDropHover: 'action-list-card-offset',
    itemDragging: 'action-list-card-dragging',
    cardPreview: 'action-list-card-preview',

    cardTop: 'action-list-card-top-line',
    cardMiddle: 'action-list-card-middle-line',
    cardBottom: 'action-list-card-bottom-line',
    cardSorter: 'action-list-card-sorter',
    cardTitle: 'action-list-card-title',
    cardRelated: 'action-list-card-related',

    grid: 'action-list-grid',
    tileContainer: 'action-list-tile-container',
    tile: 'action-list-tile',
    tileTop: 'action-list-tile-top-line',
    tileMiddle: 'action-list-tile-middle-line',
    tileBottom: 'action-list-tile-bottom-line',
    tileSorter: 'action-list-tile-sorter',
    tileTitle: 'action-list-tile-title',
    tileRelated: 'action-list-tile-related',

    eventContainer: 'action-list-event-container',
    event: 'action-list-event',
    eventContents: 'action-list-event-contents',
    eventTitle: 'action-list-event-title',
    eventRelated: 'action-list-event-related',
};
