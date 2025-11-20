const DEFAULT_DELAY = 200;

/**
 * debounce
 * @param {Function} fn Function to execute
 * @param {number} delay Delay time (ms)
 * @returns {Function} Debounced function
 */
export function debounce(fn, delay = DEFAULT_DELAY) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
