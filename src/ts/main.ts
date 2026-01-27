/*!
 * createdAt: 2025-04-17T14:11:47+09:00
 * updatedAt: 2026-01-27T14:54:36+09:00
 */

import { debounce } from './debounce';
// import { debugCheck } from './debug_check.js';
// import { debugConsole } from './debug_console.js';

/**
 * Event Types
 *
 * [Mouse]:
 * click / dblclick / wheel
 * mousedown / mouseup / mousemove / mouseenter / mouseleave / mouseover / mouseout
 * [Keyboard]:
 * keydown / keyup / keypress
 * [Touch]:
 * touchstart / touchmove / touchend / touchcancel
 * [Pointer]:
 * pointerdown / pointerup / pointermove / pointerenter / pointerleave / pointercancel:
 * [Form / Input]:
 * input / change / blur / focus / reset / submit / select
 * [Window / Browser]:
 * load / resize / scroll / unload / beforeunload / hashchange / popstate
 * [Lifecycle]:
 * DOMContentLoaded / DOMFocusIn(*rare) / DOMFocusOut(*rare)
 * [Other]:
 * error / abort / contextmenu / drag / drop
 */
document.addEventListener('DOMContentLoaded', () => {
  /**
   * Debounced resize handler
   */
  const handleResize = debounce((): void => {
    console.log('Resize handler');
  }, 250);

  // Initial call
  handleResize();

  window.addEventListener('resize', handleResize);

  /*
  例: 明示的に最後の呼び出しを実行したい場合;
  handleResize.flush();
  例: タイマーをキャンセルしたい場合;
  handleResize.cancel();
 */
});
