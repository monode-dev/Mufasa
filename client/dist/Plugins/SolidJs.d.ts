export declare function solidPersister(): {
    readonly useRoot: <T>(func: () => T) => T;
    readonly useProp: <GetType, SetType = GetType>(initValue: GetType) => import("mosa-js").Prop<GetType, SetType>;
    readonly useFormula: <GetType_1, Setter extends ((value: any) => any) | undefined = ((value: GetType_1) => any) | undefined>(compute: () => GetType_1, set?: Setter | undefined) => import("mosa-js").ReadonlyProp<GetType_1> & (undefined extends Setter ? {} : Setter extends (...args: any[]) => any ? import("mosa-js").WriteonlyProp<Parameters<Setter>[0]> : {});
    readonly doNow: <T_1>(func: () => T_1) => T_1;
    readonly doWatch: (func: () => void, options?: Partial<{
        on: import("mosa-js").ReadonlyProp<any>[];
    }> | undefined) => void;
    readonly onDispose: (func: () => void) => void;
    readonly exists: <T_2>(x: T_2) => x is NonNullable<T_2>;
};
