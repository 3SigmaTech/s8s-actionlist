import * as React from "react";
import { useDrop } from "react-dnd";
import type { DropTargetMonitor } from "react-dnd";

export type DropWrapperProps<DragContext, DropContext> = {
    onDrop: (
        item: DragContext,
        monitor: DropTargetMonitor,
        meta: DropContext) => void;
    children: React.ReactElement<{ isOver: boolean; }, string | React.JSXElementConstructor<any>>;
    meta: DropContext;
    enable: boolean;
    accept: string;
}

export function DropWrapper<DragContext, DropContext>(props: DropWrapperProps<DragContext, DropContext>) {

    const { onDrop, children, meta, enable, accept } = props;

    const [{ isOver }, drop] = useDrop({
        accept: accept,
        canDrop: (_item: DragContext, _monitor: DropTargetMonitor) => {
            if (enable) {
               return true;
            }
            return false;
        },
        drop: (item, monitor) => {
            onDrop(item, monitor, meta);
        },
        collect: (monitor) => {
            return { isOver: monitor.isOver() };
        },
    });

    return (
        <div
            ref={drop}
            className={"drop-wrapper"}
        >
            {React.cloneElement(children, { isOver })}
        </div>
    );
};
