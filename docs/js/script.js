"use strict";
/*! createdAt: 2025-04-17T14:11:47+09:00 */
/*! updatedAt: 2025-11-24T22:09:24+09:00 */
// import { debounce } from './debounce.js';
/* Event Types
 * [Mouse]
 * click / dblclick / mousedown / mouseup / mousemove / mouseenter / mouseleave / mouseover / mouseout / wheel
 * [Keyboard]
 * keydown / keyup / keypress
 * [Touch]
 * touchstart / touchmove / touchend / touchcancel
 * [Pointer]
 * pointerdown / pointerup / pointermove / pointerenter / pointerleave / pointercancel
 * [Form / Input]
 * input / change / blur / focus / reset / submit / select
 * [Window / Browser]
 * load / resize / scroll / unload / beforeunload / hashchange / popstate
 * [Lifecycle]
 * DOMContentLoaded / DOMFocusIn(*rare) / DOMFocusOut(*rare)
 * [Other]
 * error / abort / contextmenu / drag / drop
 */
document.addEventListener('DOMContentLoaded', () => {
    // Actions to perform after DOM is fully loaded
    /**
     * Debounced resize handler
     */
    const handleResize = debounce(() => {
        // Actions to perform on window resize
        console.log('Resize handler');
    }, 250);
    // Initial call
    handleResize();
    // Attach 'resize' listener
    window.addEventListener('resize', handleResize);
    /*
    // Optional: remove listener example after 10 seconds
    setTimeout(() => {
      window.removeEventListener('resize', handleResize);
      console.log('Resize listener removed');
    }, 10000);
    */
});
/* ================================== */
/* ---- Check ---- */
const debugCheck = {
    /**
     * debug check function
     * @return {boolean}
     */
    isArray: (val) => Array.isArray(val),
    isBoolean: (val) => typeof val === 'boolean',
    isEmptyObject: (obj) => Object.keys(obj).length === 0,
    isFunction: (val) => typeof val === 'function',
    isNull: (val) => val === null,
    isNumber: (val) => typeof val === 'number',
    isObject: (val) => typeof val === 'object' && val !== null,
    isString: (val) => typeof val === 'string',
    isSymbol: (val) => typeof val === 'symbol',
    isUndefined: (val) => typeof val === 'undefined',
};
/* ---- Debug ---- */
const debugConsole = {
    /**
     * debug console function
     * @param {any}
     */
    log: (message) => {
        try {
            console.log(message);
        }
        catch (e) {
            console.error(e);
        }
    },
    count: (message) => {
        try {
            console.count(message);
        }
        catch (e) {
            console.error(e);
        }
    },
    time: (message = 'process(ms)') => {
        try {
            console.time(message);
        }
        catch (e) {
            console.error(e);
        }
    },
    timeEnd: (message = 'process(ms)') => {
        try {
            console.timeEnd(message);
        }
        catch (e) {
            console.error(e);
        }
    },
    warn: (message) => {
        try {
            console.warn(message);
        }
        catch (e) {
            console.error(e);
        }
    },
    assert: (condition, message) => {
        try {
            console.assert(condition, message);
        }
        catch (e) {
            console.error(e);
        }
    },
};
