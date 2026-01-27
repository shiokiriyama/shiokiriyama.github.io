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
        if (timer !== null) {
            window.clearTimeout(timer);
        }
        timer = window.setTimeout(() => {
            fn.apply(this, args);
            timer = null;
        }, delay);
    };
    debounced.cancel = () => {
        if (timer !== null) {
            window.clearTimeout(timer);
            timer = null;
        }
    };
    return debounced;
}
