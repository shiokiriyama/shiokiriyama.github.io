/*! createdAt: 2025-04-17T14:11:47+09:00 */
/*! updatedAt: 2025-05-20T11:12:11+09:00 */

'use strict';

class Canvas2dUtil {
  /**
   * @constructor
   * @param {HTMLCanvasElement} canvas - 対象となる canvas element
   */
  constructor(canvas, width, height) {
    this.canvasElement = canvas;
    this.context2d = canvas.getContext('2d');
    this.width = width;
    this.height = height;
    this.dpr = window.devicePixelRatio || 1;

    this._fps = 0;
    this._frame = 0;
    this._startTime = performance.now();

    this._initialize();
  }

  get canvas() {
    return this.canvasElement;
  }

  get context() {
    return this.context2d;
  }

  _initialize() {
    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
  }

  /**
   * FPSを調べる
   * @returns {number} fps
   */
  updateFps() {
    this._frame++;
    const currentTime = performance.now();
    if (currentTime - this._startTime >= 1000) {
      this._fps = this._frame;
      this._frame = 0;
      this._startTime = currentTime;
    }
    return this._fps;
  }

  /**
   * キャンバスの消去
   * @param {number} x1 - 始点の X 座標
   * @param {number} y1 - 始点の Y 座標
   * @param {number} x2 - 終点の X 座標
   * @param {number} y2 - 終点の Y 座標
   */
  clearCanvas(x1 = 0, y1 = 0, x2, y2) {
    this.context2d.clearRect(x1, y1, x2, y2);
  }

  /**
   * 線分を描画する
   * @param {number} x1 - 始点の X 座標
   * @param {number} y1 - 始点の Y 座標
   * @param {number} x2 - 終点の X 座標
   * @param {number} y2 - 終点の Y 座標
   * @param {string} [color] - 色
   * @param {number} [width = 1] - 線幅
   */
  drawLine(x1, y1, x2, y2, color, width = 1) {
    if (color != null) this.context2d.strokeStyle = color;
    this.context2d.lineWidth = width;
    this.context2d.beginPath();
    this.context2d.moveTo(x1, y1);
    this.context2d.lineTo(x2, y2);
    this.context2d.closePath();
    this.context2d.stroke();
  }

  /**
   * 矩形を描画する
   * @param {number} x - 左上の X 座標
   * @param {number} y - 左上の Y 座標
   * @param {number} width - 横幅
   * @param {number} height - 高さ
   * @param {string} [color] - 色
   */
  drawRect(x, y, width, height, color) {
    if (color != null) this.context2d.fillStyle = color;
    this.context2d.fillRect(x, y, width, height);
  }

  /**
   * 矩形の線を描画する
   * @param {number} x - 左上の X 座標
   * @param {number} y - 左上の Y 座標
   * @param {number} width - 横幅
   * @param {number} height - 高さ
   * @param {string} [color] - 色
   * @param {number} [thickness = 1] - 太さ
   */
  drawLineRect(x, y, width, height, color, thickness = 1) {
    if (color != null) this.context2d.strokeStyle = color;
    this.context2d.lineWidth = thickness;
    this.context2d.strokeRect(x, y, width, height);
  }

  /**
   * 円を描画する
   * @param {number} x - 中心の X 座標
   * @param {number} y - 中心の Y 座標
   * @param {number} radius - 半径
   * @param {string} [color] - 色
   */
  drawCircle(x, y, radius, color) {
    if (color != null) this.context2d.fillStyle = color;
    this.context2d.beginPath();
    this.context2d.arc(x, y, radius, 0.0, Math.PI * 2.0);
    this.context2d.closePath();
    this.context2d.fill();
  }

  /**
   * 円の線を描画する
   * @param {number} x - 中心の X 座標
   * @param {number} y - 中心の Y 座標
   * @param {number} radius - 半径
   * @param {string} [color] - 色
   * @param {number} [thickness = 1] - 色
   */
  drawLineCircle(x, y, radius, color, thickness = 1) {
    if (color != null) this.context2d.strokeStyle = color;
    this.context2d.lineWidth = thickness;
    this.context2d.beginPath();
    this.context2d.arc(x, y, radius, 0.0, Math.PI * 2.0);
    this.context2d.closePath();
    this.context2d.stroke();
  }

  /**
   * テキストを描画する
   * @param {string} text - 描画するテキスト
   * @param {number} x - 左上位置の X 座標
   * @param {number} y - 左上位置の Y 座標
   * @param {string} color
   * @param {number} width
   */
  drawText(text, x, y, color, width) {
    if (color != null) this.context2d.fillStyle = color;
    this.context2d.fillText(text, x, y, width);
  }
}

