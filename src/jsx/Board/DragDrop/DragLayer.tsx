import * as React from "react";
import { useDragLayer } from 'react-dnd';
import type { XYCoord } from 'react-dnd';
import type * as CSS from 'csstype';

function getItemStyles<DragContext>(props: DragLayerCollectedProps<DragContext>) {
    const { initialOffset, currentOffset } = props;
    if (!initialOffset || !currentOffset) {
        return {
            display: 'none'
        };
    }
    let { x, y } = currentOffset;

    if (props.snapToGrid) {
        x = Math.round(x / 32) * 32;
        y = Math.round(y / 32) * 32;
    }

    return {
        position: 'fixed' as CSS.Property.Position,
        left: `${x || 0}px`,
        top: `${y || 0}px`,
    };
}

export type DragLayerProps<DragContext> = {
    preview: (props: DragLayerCollectedProps<DragContext>) => JSX.Element;
    snapToGrid?: boolean;
};
export type DragLayerCollectedProps<DragContext> = {
    item: DragContext & {
        type: string,
        clientLeft: number,
        clientTop: number,
        clientWidth: number,
        clientHeight: number,
    };
    type: string | undefined;
    initialOffset: XYCoord | null;
    currentOffset: XYCoord | null;
    isDragging: boolean;
    snapToGrid: boolean;
};
export function DragLayer<DragContext>(props: DragLayerProps<DragContext>) {

    const collectedProps: DragLayerCollectedProps<DragContext> = useDragLayer((monitor) => ({
        item: monitor.getItem(),
        type: monitor.getItemType()?.toString(),
        initialOffset: monitor.getInitialSourceClientOffset(),
        currentOffset: monitor.getSourceClientOffset(),
        isDragging: monitor.isDragging(),
        snapToGrid: props.snapToGrid ?? false
    }));

    if (!collectedProps.isDragging) {
        return null;
    }

    let newProps = {...collectedProps};
    newProps.isDragging = false; // because reasons


    // Need to be directly added to element.
    // Adding to class and scss did not produce the desired effect.
    const layerStyles = {
        position: 'fixed' as CSS.Property.Position,
        pointerEvents: 'none' as CSS.Property.PointerEvents,
        zIndex: 100000
    };

    return (
        <div style={layerStyles}>
            <div style={getItemStyles({...collectedProps})}>
                <props.preview
                    {...newProps}
                />
            </div>
        </div>
    );
}

