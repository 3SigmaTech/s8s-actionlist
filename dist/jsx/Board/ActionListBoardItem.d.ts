import * as React from "react";
import type { DragLayerCollectedProps } from './DragDrop/DragLayer';
import type { ActionListCardProps, ActionListCollection, EnhancedActionListObject } from "../../js/ActionListContext";
type ActionListBoardItemProps = {
    item: EnhancedActionListObject;
    collection: ActionListCollection;
    setItemState: (id: number, key: string, value: any) => void;
    type: string;
};
export declare const ActionListBoardItem: (props: ActionListBoardItemProps) => JSX.Element;
type ClickableCardProps = ActionListCardProps & {
    cardRef: React.RefObject<HTMLDivElement>;
    setShow?: (show: boolean) => void;
    isDragging?: boolean;
};
export declare const ActionListClickableCard: (props: ClickableCardProps) => JSX.Element;
export declare function ItemDragPreview(props: DragLayerCollectedProps<EnhancedActionListObject>): JSX.Element;
export {};
//# sourceMappingURL=ActionListBoardItem.d.ts.map