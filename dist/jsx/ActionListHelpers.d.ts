/// <reference types="react" />
import type { EnhancedActionListObject, ActionListColumn } from '../js/ActionListContext';
export declare const applyObjectToString: (str: string | undefined, obj: {
    [key: string]: any;
}, context?: string) => string;
export declare const textToClass: (mytext: string) => string;
export declare const textWithLf: (mytext: string | string[]) => string;
export declare const prettyDate: (date: string | Date) => string;
export declare const getFieldText: (data: EnhancedActionListObject, column: ActionListColumn) => any[];
export declare const duesoon: (date: string | Date, thresh?: number) => boolean;
export declare const toTitleCase: (str: string) => string;
export declare const ProgressRing: (props: {
    value: number;
}) => JSX.Element;
export declare const ProgressBar: ({ item, col, collClass }: {
    item: EnhancedActionListObject;
    col: ActionListColumn;
    collClass: string;
}) => JSX.Element | null;
export declare const RelatedFooter: ({ item, col, relatedClass }: {
    item: EnhancedActionListObject;
    col: ActionListColumn;
    relatedClass: string;
}) => JSX.Element;
//# sourceMappingURL=ActionListHelpers.d.ts.map