const DEFAULT_DELAY = 200;

// Generic functional type
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
export function debounce<T extends anyFn>(fn: T, delay: number = DEFAULT_DELAY): debouncedFunction<T> {
  let timer: number | null = null;

  const debounced = function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    if (timer !== null) {
      window.clearTimeout(timer);
    }
    timer = window.setTimeout(() => {
      fn.apply(this, args);
      timer = null;
    }, delay);
  } as debouncedFunction<T>;

  debounced.cancel = () => {
    if (timer !== null) {
      window.clearTimeout(timer);
      timer = null;
    }
  };

  return debounced;
}
