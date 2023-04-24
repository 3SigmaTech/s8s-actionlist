import * as React from "react";
import type { DropTargetMonitor } from "react-dnd";
export type DropWrapperProps<DragContext, DropContext> = {
    onDrop: (item: DragContext, monitor: DropTargetMonitor, meta: DropContext) => void;
    children: React.ReactElement<{
        isOver: boolean;
    }, string | React.JSXElementConstructor<any>>;
    meta: DropContext;
    enable: boolean;
    accept: string;
};
export declare function DropWrapper<DragContext, DropContext>(props: DropWrapperProps<DragContext, DropContext>): JSX.Element;
//# sourceMappingURL=DropWrapper.d.ts.map