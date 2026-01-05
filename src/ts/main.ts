/*!
 * createdAt: 2025-04-17T14:11:47+09:00
 * updatedAt: 2026-01-05T13:52:08+09:00
 */

import { debounce } from './debounce.js';
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
