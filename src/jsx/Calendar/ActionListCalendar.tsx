
import * as React from 'react';

import type * as FullCalendarCore from '@fullcalendar/core';
import FullCalendar from '@fullcalendar/react';
import fcDayGridPlugin from '@fullcalendar/daygrid';
import fcTimeGridPlugin from '@fullcalendar/timegrid';
import fcInteractionPlugin from '@fullcalendar/interaction';
import fcMultimonthPlugin from '@fullcalendar/multimonth';

import { ActionListClasses as classes, SettingsContext, ActionListTypes, ActionListProps, ActionListSettings, EnhancedActionListObject } from '../../js/ActionListContext';
import type { ActionListEventProps } from '../../js/ActionListContext';
import { ActionListEvent } from './ActionListEvent';
import * as helpers from '../ActionListHelpers';

export function ActionListCalendar(props: ActionListProps) {
    const settings = React.useContext(SettingsContext);

    const events: FullCalendarCore.EventInput[] = [];

    let accessors: string[] = [];
    let labels: string[] = [];
    for (let i = 0; i < (settings.columns?.length ?? 0); i++) {
        let c = settings.columns?.[i];
        if (!c) { continue; }
        if (c.type == ActionListTypes.date || c.type == ActionListTypes.datetime) {
            accessors.push(c.accessor);
            labels.push(c.label.replace(' Date', ''));
        }
    }

    for (let d of props.data.list) {
        if (d[settings.scheduleStart]) {
            let start = d[settings.scheduleStart];
            let myclasses = [classes.event];
            if (helpers.duesoon(start)) {
                myclasses.push(classes.duesoon);
            }
            let event: FullCalendarCore.EventInput = {
                item: d,
                settings: settings,
                classNames: myclasses,
                start: start,
            }
            if (settings.scheduleEnd) {
                event.end = d[settings.scheduleEnd];
            }
            events.push(event);
        }
    }

    let calendarRef: React.RefObject<FullCalendar> = React.createRef();

    return (
        // TODO: Add side bar of event templates to drag into calendar
        // HERE: https://fullcalendar.io/demos
        // Will need to set droppable={true}
        <FullCalendar
            ref={calendarRef}
            headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: settings.calendarViews
            }}
            navLinks={true}
            weekNumbers={true}
            weekends={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            editable={settings.enableCalendarDragDrop}
            select={(arg) => { handleAdd(arg, calendarRef.current, settings); }}
            eventDrop={(arg) => { handleDrop(arg, calendarRef.current); }}

            plugins={[fcInteractionPlugin, fcDayGridPlugin, fcTimeGridPlugin, fcMultimonthPlugin]}
            initialView={settings.defaultCalendarView}
            events={events}
            eventContent={renderEventContent}
        />
    );
}

const handleDrop = (args: FullCalendarCore.EventDropArg, _cal: FullCalendar | null) => {

    const item = args.event.extendedProps['item'];
    const settings = args.event.extendedProps['settings'];

    if (!settings.hooks.eventDrop) { return; }

    const schedule = {
        start: args.event.start,
        end: args.event.end
    };

    // TODO: Allow handler to change time (e.g. to drop within an allowed window)

    let allowChange = true;
    if (settings.hooks.eventDrop) {
        allowChange = settings.hooks.eventDrop(item, schedule, settings);
    }
    allowChange = false;

    if (!allowChange) {
        args.revert();
    }

}

const handleAdd = (args: FullCalendarCore.DateSelectArg, cal: FullCalendar | null, settings: ActionListSettings) => {

    let calendarApi = cal?.getApi();
    if (!calendarApi) { return; }
    if (!settings.hooks.eventCreate) { return; }

    // TODO: Allow handler to change time (e.g. to create within an allowed window)

    let item = settings.hooks.eventCreate(
        args.start,
        args.end,
        args.allDay
    );
    if (item) {
        let myclasses = [classes.event];
        if (helpers.duesoon(args.start)) {
            myclasses.push(classes.duesoon);
        }
        calendarApi.addEvent({
            item: item,
            settings: settings,
            classNames: myclasses,
            start: args.start,
            end: args.end,
            allDay: args.allDay
        });
    }
    calendarApi.unselect();
}

const renderEventContent = (eventInfo: FullCalendarCore.EventContentArg) => {

    let item = eventInfo.event.extendedProps['item'] as EnhancedActionListObject;
    let settings = eventInfo.event.extendedProps['settings'] as ActionListSettings;

    return (
        <CalendarEvent item={item} settings={settings} />
    );
}

const CalendarEvent = ({item, settings}: ActionListEventProps) => {

    const [show, setShow] = React.useState(false);
    const onClose = () => { setShow(false); };
    const onOpen = () => { setShow(true); };

    let modal: JSX.Element | null = null;
    if (settings.components.modal) {
        modal = React.createElement(settings.components.modal, {
            item: item,
            onClose: onClose,
            show: show
        });
    }


    let TheEventComponent = settings.components.eventComponent || ActionListEvent;

    return (
        <>
            <div
                className={`${classes.eventContainer}`}
                onClick={onOpen}
            >
                <TheEventComponent
                    item={item}
                    settings={settings}
                />
            </div>
            {modal}
        </>
    );
}

