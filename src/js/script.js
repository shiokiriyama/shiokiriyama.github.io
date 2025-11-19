/*! createdAt: 2025-04-17T14:11:47+09:00 */
/*! updatedAt: 2025-11-19T13:55:03+09:00 */

import { debounce } from './debounce.js';

/* ---- DOMContentLoaded listener ---- */
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

/* ---------------------------------- */
/* ---------------------------------- */

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
    } catch (e) {
      console.error(e);
    }
  },
  count: (message) => {
    try {
      console.count(message);
    } catch (e) {
      console.error(e);
    }
  },
  time: (message = 'process(ms)') => {
    try {
      console.time(message);
    } catch (e) {
      console.error(e);
    }
  },
  timeEnd: (message = 'process(ms)') => {
    try {
      console.timeEnd(message);
    } catch (e) {
      console.error(e);
    }
  },
  warn: (message) => {
    try {
      console.warn(message);
    } catch (e) {
      console.error(e);
    }
  },
  assert: (condition, message) => {
    try {
      console.assert(condition, message);
    } catch (e) {
      console.error(e);
    }
  },
};

/**
 * addEventListener type Event.type
 *
 * [MOUSE]
 * click: クリック時
 * dblclick: ダブルクリック時
 * mousedown: マウス押下時
 * mouseenter: カーソルが要素に入った時(子要素では発生しない)
 * mouseleave: カーソルが要素から外れた時(子要素では発生しない)
 * mousemove: カーソル移動時
 * mouseout: カーソルが要素から外れた時(子要素でも発生)
 * mouseover: カーソルが要素に入った時(子要素でも発生)
 * mouseup: ボタンを離した時
 * wheel:

 * [KEYBOARD]
 * keydown: キー押下時
 * keypress: キーを押して離した時
 * keyup: キーを離した時

 * [TOUCH]
 * touchcancel:
 * touchend:
 * touchmove:
 * touchstart:

 * [INPUT]
 * blur: コントロールがフォーカスを失った時
 * change: コントロールの値の変化時
 * focus コントロールがフォーカスを受け取った時
 * reset: 'reset'ボタン押下時発火
 * select: 属性値が'text'のinput要素・textarea要素の文字が選択された時
 * submit: 'submit'ボタン押下時

 * [BROWSER]
 * load: 全リソースの読み込みが完了時
 * resize: コントロールのサイズ変更時
 * scroll: スクロールバー位置変更時

 * [DOM]
 * DOMContentLoaded: サイトの読み込み完了時(画像などのリソースは含まない)
 * DOMActivate: ターゲットがアクティブ時
 * DOMFocusIn: ターゲットがフォーカスを受け取った時
 * DOMFocusOut: ターゲットがフォーカスを失った時

 * [ETC]
 * error: エラー発生時
 */
