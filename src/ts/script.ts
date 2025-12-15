/*! createdAt: 2025-04-17T14:11:47+09:00 */
/*! updatedAt: 2025-11-24T22:09:24+09:00 */

import { debounce } from './debounce.js';

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
  /* 配列判定 */
  isArray: (val: unknown): val is unknown[] => Array.isArray(val),
  /* 真偽値判定 */
  isBoolean: (val: unknown): val is boolean => typeof val === 'boolean',
  /* 空の純粋オブジェクト判定  */
  isEmptyObject: (obj: object): boolean => Object.keys(obj).length === 0,
  /* 関数判定 */
  isFunction: (val: unknown): val is (...args: any[]) => unknown => typeof val === 'function',
  /* null判定 */
  isNull: (val: unknown): val is null => val === null,
  /* 数値判定 */
  isNumber: (val: unknown): val is number => typeof val === 'number',
  /* 純粋オブジェクト判定 */
  isObject: (val: unknown): val is object => typeof val === 'object' && val !== null && !Array.isArray(val),
  /* 文字列判定 */
  isString: (val: unknown): val is string => typeof val === 'string',
  /* シンボル判定 */
  isSymbol: (val: unknown): val is symbol => typeof val === 'symbol',
  /* undefined判定 */
  isUndefined: (val: unknown): val is undefined => typeof val === 'undefined',
};

/* ---- Debug ---- */
const debugConsole = {
  /**
   * debug console function
   * @param {any}
   */
  /* 標準ログ出力 */
  log: (message: unknown): void => {
    if (typeof console !== 'undefined' && console.log) {
      console.log(message);
    }
  },
  /* 呼び出し回数をカウント */
  count: (label?: string): void => {
    if (typeof console !== 'undefined' && console.count) {
      console.count(label);
    }
  },
  /* 処理時間計測開始 */
  time: (label: string = 'process(ms)'): void => {
    if (typeof console !== 'undefined' && console.time) {
      console.time(label);
    }
  },
  /* 処理時間計測終了 */
  timeEnd: (label: string = 'process(ms)'): void => {
    if (typeof console !== 'undefined' && console.timeEnd) {
      console.timeEnd(label);
    }
  },
  /* 警告出力 */
  warn: (message: unknown): void => {
    if (typeof console !== 'undefined' && console.warn) {
      console.warn(message);
    }
  },
  /* 条件が false の場合に警告 */
  assert: (condition: boolean, message?: string): void => {
    if (typeof console !== 'undefined' && console.assert) {
      console.assert(condition, message);
    }
  },
};
