import * as React from "react";
import { DropTargetMonitor, useDrag, useDrop } from 'react-dnd';
import { getEmptyImage } from "react-dnd-html5-backend";

type DragWrapperProps<DragContext> = {
    meta: DragContext;
    type: string;
    children: React.ReactElement<{ isDragging: boolean; }, string | React.JSXElementConstructor<any>>;
    onHover: (item:DragContext, monitor:DropTargetMonitor) => void;
    customDragPreview:boolean;
}

export function DragWrapper<DragContext>(props: DragWrapperProps<DragContext>) {

    const { meta, children, type, onHover, customDragPreview } = props;

    const ref = React.useRef<HTMLDivElement>(null);

    const [, drop ] = useDrop({
        accept: type,
        hover: (item:DragContext, monitor:DropTargetMonitor) => {
            if (!ref.current) {
                return;
            }
            onHover(item, monitor);
        }
    })

    const [{ isDragging }, drag, dragPreview] = useDrag(() => ({
    //const [{ isDragging }, drag] = useDrag({
        type: type,
        item: () => {
            if (!ref.current) {
                return {type, ...meta};
            }
            const { clientWidth, clientHeight } = ref.current;
            return {
                type,
                clientWidth, clientHeight,
                ...meta
            }
        },

        collect: monitor => {
            return {
                isDragging: monitor.isDragging(),
            }
        }
    }));

    if (customDragPreview) {
        dragPreview(getEmptyImage(), { captureDraggingState: true });
    }

    drag(drop(ref));


    return (
        <div ref={ref}>
            {React.cloneElement(children, { isDragging })}
        </div>
    );

}