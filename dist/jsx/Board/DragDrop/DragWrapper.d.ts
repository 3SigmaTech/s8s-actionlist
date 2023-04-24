import * as React from "react";
import { DropTargetMonitor } from 'react-dnd';
type DragWrapperProps<DragContext> = {
    meta: DragContext;
    type: string;
    children: React.ReactElement<{
        isDragging: boolean;
    }, string | React.JSXElementConstructor<any>>;
    onHover: (item: DragContext, monitor: DropTargetMonitor) => void;
    customDragPreview: boolean;
};
export declare function DragWrapper<DragContext>(props: DragWrapperProps<DragContext>): JSX.Element;
export {};
//# sourceMappingURL=DragWrapper.d.ts.map