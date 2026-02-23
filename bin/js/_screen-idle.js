/*! createdAt: 2025-04-17T14:11:47+09:00 */
/*! updatedAt: 2025-07-24T17:32:43+09:00 */

'use strict';

(() => {
  const LAYER_WIDTH = 720;
  const LAYER_HEIGHT = 1280;
  const TAU = Math.PI * 2;

  const layer = []; // Canvas格納

  /* -- addEventListener(DOMContentLoaded) -- */
  document.addEventListener(
    'DOMContentLoaded',
    () => {
      /* Navigation */

      /*
      const pages = [...document.querySelectorAll('main.l-main > article')];
      const navHeader = document.querySelector('nav.l-header-navi');

      navHeader.addEventListener('click', (e) => {
        if (e.target.matches('.c-link')) {
          e.preventDefault();
          for (const el of pages) {
            el.classList.remove('is-active');
          }
          const index = Number(e.target.dataset.indexNumber);
          if (pages[index]) {
            pages[index].classList.toggle('is-active');
          }
          // console.log(`index: ${index}`, pages[index]);
        }
      });
      */

      /* -- Canvas Initialize -- */
      /**
       * Canvasが複数の場合
       */
      for (let i = 0; i <= 1; i++) {
        const target = document.querySelector(`.js-homeBgLayer${i}`);
        if (!target) {
          console.warn(`.js-homeBgLayer${i} not found.`);
          continue;
        }
        const el = new Canvas2dUtil(target, LAYER_WIDTH, LAYER_HEIGHT);
        layer.push(el);
      }

      // 描画処理開始
      // drawLayer(); // !!!起動ポイント!!!
    },
    false
  );

  /* -- addEventListener(resize) -- */
  window.addEventListener(
    // TODO debounce使用（負荷軽減）
    'resize',
    () => {
      // updateCanvas();
    },
    false
  );

  /**
   *  drawLayer
   */
  let cnt = 0;
  let centerX = 0; // Xの中心座標 layer[n].canvas.width >> 1;
  let centerY = 0; // Yの中心座標 layer[n].canvas.height >> 1;
  let radius = [240, 60, 72];
  let speed = [];
  const drawLayer = () => {
    // TODO 30fps指定

    // 背景塗り
    layer[0].drawLineRect(centerX, centerY, 20, 20, '#b71c1c', 4);
    layer[0].drawLineCircle(centerX, centerY, 20, '#b71c1c', 4);

    // 線分の描画

    // 円の描画
    const circles = [
      { x: cnt * 0.5 - radius[0], y: cnt * 0.5 - radius[0], r: radius[0], color: '#f48fb1' },
      { x: cnt * 1.2 - radius[1], y: cnt * 1.2, r: radius[1] - 20, color: '#ffecb3' },
      { x: cnt * 1.5 + radius[2], y: cnt * 1.5 - 180, r: radius[2], color: '#fff59d' },
    ];

    // const circles = [
    //   { x: LAYER_WIDTH - cnt * 0.5 - 448, y: cnt * 0.5, r: radius[4], color: '#f48fb1' },
    //   { x: LAYER_WIDTH - cnt * 1.2 - 64, y: cnt * 1.2, r: radius[0], color: '#ffecb3' },
    //   { x: cnt * 1.5 + 304, y: LAYER_HEIGHT - cnt * 1.5, r: radius[1], color: '#fff59d' },
    //   { x: LAYER_WIDTH - cnt * 1.5 + 256, y: cnt * 1.5, r: radius[1], color: '#fff59d' },
    // ];

    for (const { x, y, r, color } of circles) {
      layer[0].context2d.fillStyle = color;
      layer[0].context2d.beginPath();
      layer[0].context2d.arc(x, y, r, 0, TAU);
      layer[0].context2d.closePath();
      layer[0].context2d.fill();
    }

    // for (const { x, y, r, color } of circles) {
    //   layer[0].context2d.lineWidth = r;
    //   layer[0].context2d.lineCap = 'round';
    //   layer[0].context2d.strokeStyle = color;
    //   layer[0].context2d.beginPath();
    //   layer[0].context2d.moveTo(x, y);
    //   layer[0].context2d.lineTo(x + 8, y + 8);
    //   layer[0].context2d.closePath();
    //   layer[0].context2d.stroke();
    // }

    cnt >= 2048 ? (cnt = 0) : cnt++;
    requestAnimationFrame(drawLayer); // アニメーションループ
  };

  /**
   *  updateCanvas
   */
  const updateCanvas = () => {
    // console.log('resize');
    // const canvas = layer[0].canvas;
    layer[0].canvas.width = layer[0].canvas.clientWidth;
    layer[0].canvas.height = layer[0].canvas.clientHeight;
    centerX = canvas.width >> 1; // Xの中心座標
    centerY = canvas.height >> 1; // Yの中心座標
  };

  /* -- Class -- */

  /* -- Check -- */
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

  /* -- Debug -- */
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
})();

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
 * DOMActivate: ターゲットがアクティブ時
 * DOMFocusIn: ターゲットがフォーカスを受け取った時
 * DOMFocusOut: ターゲットがフォーカスを失った時

 * [ETC]
 * error: エラー発生時
 */
