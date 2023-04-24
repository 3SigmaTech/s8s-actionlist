/// <reference types="react" />
import type { ActionListProps } from "../../js/ActionListContext";
import type { EnhancedActionListObject } from "../../js/ActionListContext";
export declare const ITEM_TYPE = "ITEM";
export declare const ActionListBoard: (props: ActionListProps) => JSX.Element;
export default ActionListBoard;
export type ActionListBoardProps = {
    data: {
        [key: string | number]: EnhancedActionListObject;
    };
};
//# sourceMappingURL=ActionListBoard.d.ts.map