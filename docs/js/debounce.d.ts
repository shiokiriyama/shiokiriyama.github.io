type anyFn = (...args: any[]) => unknown;
/**
 * debouncedFunction
 */
type debouncedFunction<T extends anyFn> = {
    (this: ThisParameterType<T>, ...args: Parameters<T>): void;
    cancel: () => void;
};
/**
 * debounce
 * @param fn Function to execute
 * @param delay Delay time (ms)
 * @returns Debounced function
 */
export declare function debounce<T extends anyFn>(fn: T, delay?: number): debouncedFunction<T>;
export {};
