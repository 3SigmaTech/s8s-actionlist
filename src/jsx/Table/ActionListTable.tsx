
import * as React from 'react';

import {
    ActionListClasses as classes, SettingsContext, ActionListProps,
    EnhancedActionListObject, ActionListObject
} from '../../js/ActionListContext';

import type { ActionListCellProps } from '../../js/ActionListContext';
import { ActionListCell } from './ActionListCell';

export const ActionListTable = (props: ActionListProps) => {

    const [tableData, setTableData] = React.useState(props.data.list);

    const handleSorting = (sortField: string, sortOrder: string) => {
        if (sortField) {
            const sorted = [...tableData].sort((a, b) => {
                return (
                    a[sortField].toString().localeCompare(b[sortField].toString(), "en", {
                        numeric: true,
                    }) * (sortOrder === "asc" ? 1 : -1)
                );
            });
            setTableData(sorted);
        }
    };

    return (
        <table className={classes.table}>
            <ActionListTableHeader
                {...props}
                handleSorting={handleSorting}
            />
            <ActionListTableBody {...props} list={tableData}/>
        </table>
    );
}

const ActionListTableHeader = (props: ActionListProps & { handleSorting: any }) => {
    const settings = React.useContext(SettingsContext);

    const [sortField, setSortField] = React.useState(settings.orderField);
    const [order, setOrder] = React.useState("asc");

    const headers: JSX.Element[] = [];

    const handleSortingChange = (accessor?:string) => {
        const sortOrder = ((accessor == sortField) && (order == "asc"))
            ? "desc" : "asc";
        setSortField(accessor ?? '');
        setOrder(sortOrder);
        props.handleSorting(accessor, sortOrder);
    };

    let numcols = (settings.columns?.length ?? 0);
    for (let c = 0; c < numcols; c++) {
        let mycol = settings.columns?.[c];
        if (!mycol) { continue; }
        const sorter = mycol?.sort_field ?? mycol?.accessor
        const cl = mycol?.sortable
            ? sortField == sorter && order == "asc"
                ? classes.sortAsc
                : sortField == sorter && order == "desc"
                    ? classes.sortDesc
                    : classes.sortable
            : "";

        headers.push(
            <th className={`${classes.th} ${cl}`}
                key={mycol.accessor}
                data-toggle={mycol.tooltip ? 'tooltip' : undefined}
                title={mycol.tooltip}
                onClick={mycol.sortable ? () => handleSortingChange(sorter) : undefined}
            >
                {mycol.label}
            </th>
        );
    }

    return (
        <thead className={classes.thead}>
            <tr>
                {headers}
            </tr>
        </thead>
    );
}

const ActionListTableBody = (props:ActionListProps & {list:ActionListObject[]}) => {
    const settings = React.useContext(SettingsContext);

    const rows: JSX.Element[] = [];

    let numrows = (props.list?.length || 0);
    for (let r = 0; r < numrows; r++) {
        let mydata = props.list?.[r];
        if (!mydata) {
            continue;
        }

        const [show, setShow] = React.useState(false);
        const onClose = () => { setShow(false); };
        const onOpen = () => { setShow(true); };

        let modal: JSX.Element | null = null;
        if (settings.components.modal) {
            modal = React.createElement(settings.components.modal, {
                item: mydata as EnhancedActionListObject,
                onClose: onClose,
                show: show
            });
        }

        rows.push(
            <React.Fragment
                key={mydata.id}
            >
            <tr
                className={classes.tr}
                onClick={modal ? onOpen : undefined}
            >
                {settings.columns?.map((column) => {return (
                    <ActionListTableCell
                        data={mydata as EnhancedActionListObject}
                        column={column}
                        settings={props.settings}
                        key={column.accessor + '=' + mydata?.id}
                    />
                );})}
            </tr>
            {modal}
            </React.Fragment>
        );
    }

    return (
        <tbody className={classes.tbody}>
            <ActionListTableActions />
            {rows}
        </tbody>
    );
}

const ActionListTableActions = () => {

    const settings = React.useContext(SettingsContext);

    if (!settings.tableActions) {
        return <></>;
    }

    let actions:JSX.Element[] = [];
    for (let i = 0; i < settings.tableActions.length; i++) {
        let key = -1 - i;
        let Action = settings.tableActions[i];
        if (!Action) { continue; }
        actions.push(
            <tr key={key}>
                <td colSpan={1000}>
                    <Action />
                </td>
            </tr>
        )
    }
    
    return ( <>{actions}</> );
    
}

const ActionListTableCell = (props: ActionListCellProps) => {

    const settings = React.useContext(SettingsContext);
    
    let { column } = props;

    let TheCellComponent = ActionListCell;
    if (settings.cellOverrides.includes(column.type)) {
        let CellComponent = settings.components.cellComponent;
        if (CellComponent) {
            TheCellComponent = CellComponent;
        }
    }

    return (
        <td
            className={`${classes.td} ${column.type}`}
            key={column.accessor}
        >
            <TheCellComponent {...props} />
        </td>
    );
}

