/// <reference types="react" />
import type { XYCoord } from 'react-dnd';
export type DragLayerProps<DragContext> = {
    preview: (props: DragLayerCollectedProps<DragContext>) => JSX.Element;
    snapToGrid?: boolean;
};
export type DragLayerCollectedProps<DragContext> = {
    item: DragContext & {
        type: string;
        clientLeft: number;
        clientTop: number;
        clientWidth: number;
        clientHeight: number;
    };
    type: string | undefined;
    initialOffset: XYCoord | null;
    currentOffset: XYCoord | null;
    isDragging: boolean;
    snapToGrid: boolean;
};
export declare function DragLayer<DragContext>(props: DragLayerProps<DragContext>): JSX.Element | null;
//# sourceMappingURL=DragLayer.d.ts.map