const DEFAULT_DELAY = 200;
/**
 * debounce
 * @param fn Function to execute
 * @param delay Delay time (ms)
 * @returns Debounced function
 */
export function debounce(fn, delay = DEFAULT_DELAY) {
    let timer = null;
    const debounced = function (...args) {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            fn.apply(this, args);
        }, delay);
    };
    debounced.cancel = () => {
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
    };
    return debounced;
}
