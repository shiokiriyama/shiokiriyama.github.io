/*!
 * createdAt: 2025-04-17T14:11:47+09:00
 * updatedAt: 2026-03-17T14:56:51+09:00
 */
import { debounce } from './debounce.js';
export const App = {
    canvas: null,
    ctx: null,
    width: 0,
    height: 0,
    dpr: Math.max(1, window.devicePixelRatio || 1),
    time: { start: 0, last: 0, now: 0, delta: 0, elapsed: 0 },
    running: false,
    rafId: null,
    entity: { x: 50, y: 50, vx: 120, vy: 90, r: 12 },
    input: { mouseX: 0, mouseY: 0, mouseDown: false, keys: new Set() },
    debug: { showBounds: false, showAxes: false },
};
/** ----------------------------------------------------------------------------
  * 00 Init layer
----------------------------------------------------------------------------- */
/**
 * Initialize canvas
 * Canvas/Context 取得・サイズ設定・初期状態
 */
export function initCanvas(id) {
    const el = document.getElementById(id);
    const canvas = el instanceof HTMLCanvasElement ? el : null;
    const ctx = canvas ? canvas.getContext('2d') : null;
    if (!canvas || !ctx) {
        throw new Error(`Canvas "${id}" の取得または 2D コンテキスト生成に失敗しました。`);
    }
    App.canvas = canvas;
    App.ctx = ctx;
}
/**
 * Initialize simulation state
 * time と entity の初期化
 */
export function initState() {
    App.time = { start: 0, last: 0, now: 0, delta: 0, elapsed: 0 };
    // 任意の初期座標にキャンバス中心を使う例
    const cx = App.width * 0.5;
    const cy = App.height * 0.5;
    App.entity = { x: cx, y: cy, vx: 120, vy: 90, r: 12 };
}
/**
 * Prepare external assets
 * 外部リソース準備・読込管理
 */
export function initAssets() {
    // 画像・フォント読み込みなど
}
/** ----------------------------------------------------------------------------
  * 00 Main loop control
----------------------------------------------------------------------------- */
/**
 * Start animation loop
 * アニメーション開始エントリーポイント
 */
export function startAnimation() {
    if (!App.canvas || !App.ctx) {
        throw new Error('Canvas が初期化されていません。先に initCanvas() を実行してください。');
    }
    if (App.running)
        return;
    App.running = true;
    App.time.start = performance.now();
    App.time.last = App.time.start;
    App.time.now = App.time.start;
    App.time.delta = 0;
    App.time.elapsed = 0;
    App.rafId = requestAnimationFrame(loop);
}
/**
 * Stop animation loop and release RAF
 * アニメーション停止・破棄処理
 */
export function stopAnimation() {
    App.running = false;
    if (App.rafId != null) {
        cancelAnimationFrame(App.rafId);
        App.rafId = null;
    }
}
/**
 * Main RAF callback: update -> render
 * requestAnimationFrame に渡すメインループ（更新 → 描画の順序を保証する）
 * @returns {void}
 */
export function loop() {
    if (!App.running)
        return;
    updateTime();
    update();
    render();
    App.rafId = requestAnimationFrame(loop);
}
/** ----------------------------------------------------------------------------
  * 00 Update state
----------------------------------------------------------------------------- */
/**
 * Update one frame
 * 1フレーム分の状態更新を統括
 */
export function update() {
    updateVelocity();
    updatePosition();
    updateState();
}
/**
 * Update position
 * 座標・移動量・補間処理を更新
 */
export function updatePosition() {
    const { entity, time, width, height } = App;
    const dt = time.delta; // 秒
    // 位置更新：v * dt
    entity.x += entity.vx * dt;
    entity.y += entity.vy * dt;
    // 端でバウンス（単純反射）
    if (entity.x - entity.r < 0) {
        entity.x = entity.r;
        entity.vx *= -1;
    }
    else if (entity.x + entity.r > width) {
        entity.x = width - entity.r;
        entity.vx *= -1;
    }
    if (entity.y - entity.r < 0) {
        entity.y = entity.r;
        entity.vy *= -1;
    }
    else if (entity.y + entity.r > height) {
        entity.y = height - entity.r;
        entity.vy *= -1;
    }
}
/**
 * Update velocity
 * 速度・加速度・減衰等の運動要素を更新
 */
export function updateVelocity() {
    const { entity, time, input } = App;
    const dt = time.delta;
    // 例：マウスが押されている間だけ、マウス方向へ緩やかに吸い寄せる
    if (input.mouseDown) {
        const dx = input.mouseX - entity.x;
        const dy = input.mouseY - entity.y;
        const steer = 4.0; // 吸引の強さ
        entity.vx += dx * steer * dt;
        entity.vy += dy * steer * dt;
    }
    // 減衰（摩擦）
    const damping = 0.995;
    entity.vx *= Math.pow(damping, dt * 60); // フレームレートに依存しないよう指数で近似
    entity.vy *= Math.pow(damping, dt * 60);
    // 簡易クランプ（暴走対策）
    const vmax = 1000;
    entity.vx = clamp(entity.vx, -vmax, vmax);
    entity.vy = clamp(entity.vy, -vmax, vmax);
}
/**
 * Update logical flags
 * フラグ・モード・フェーズ遷移等の論理状態を更新
 */
export function updateState() {
    // 例：スペースキーで一時停止トグル
    if (App.input.keys.has(' ')) {
        // 一押しで何度も反応しないよう、ここで消費（単発判定）
        App.input.keys.delete(' ');
        togglePause();
    }
}
/** ----------------------------------------------------------------------------
  * 00 Render layer
----------------------------------------------------------------------------- */
/**
 * Render one frame
 * 1フレーム分の描画処理を統括
 */
export function render() {
    clear();
    drawBackground();
    drawEntity();
    drawForeground();
    if (App.debug.showAxes || App.debug.showBounds) {
        debugDraw();
    }
}
/**
 * Clear canvas
 * Canvas のクリア（前フレームの破棄）
 */
export function clear() {
    const { ctx, width, height } = App;
    if (!ctx)
        return;
    ctx.clearRect(0, 0, width, height);
}
/**
 * Draw background
 * 背景要素を描画
 */
export function drawBackground() {
    const { ctx, width, height, time } = App;
    if (!ctx)
        return;
    // 時間で色が少し変わるグラデーション例
    const t = (Math.sin(time.elapsed) + 1) * 0.5; // 0-1
    const g = ctx.createLinearGradient(0, 0, width, height);
    g.addColorStop(0, `hsl(${lerp(210, 260, t)}, 60%, 12%)`);
    g.addColorStop(1, `hsl(${lerp(210, 260, t)}, 60%, 18%)`);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, width, height);
}
/**
 * Draw main entity
 * キャラクター・オブジェクト等の主体描画
 */
export function drawEntity() {
    const { ctx, entity } = App;
    if (!ctx)
        return;
    ctx.save();
    applyTransform(); // 必要なら entity 由来の transform を適用
    ctx.beginPath();
    ctx.fillStyle = '#F7D06E';
    ctx.strokeStyle = '#212121';
    ctx.lineWidth = 2;
    ctx.arc(entity.x, entity.y, entity.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
}
/**
 * Draw foreground
 * 前景・UI・エフェクト等の描画
 */
export function drawForeground() {
    const { ctx, time } = App;
    if (!ctx)
        return;
    ctx.save();
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.font = '12px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
    ctx.textBaseline = 'top';
    const fps = (1 / Math.max(1e-6, time.delta)).toFixed(1);
    ctx.fillText(`elapsed: ${time.elapsed.toFixed(2)}s`, 8, 8);
    ctx.fillText(`fps: ${fps}`, 8, 24);
    ctx.restore();
}
/** ----------------------------------------------------------------------------
  * 00 Transform helpers
----------------------------------------------------------------------------- */
/**
 * Apply translate/rotate/scale
 * translate / rotate / scale をまとめて適用
 * Pivot 等を扱うなら引数を拡張
 */
export function applyTransform() {
    const { ctx } = App;
    if (!ctx)
        return;
}
/**
 * Reset transform
 * 描画状態を既定値に
 */
export function resetTransformState() {
    const { ctx } = App;
    if (!ctx)
        return;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.imageSmoothingEnabled = true;
}
/**
 * Convert world -> screen
 * 論理座標 -> 描画座標への変換
 */
export function worldToScreen(x, y) {
    // 今は恒等変換。カメラが入ったらここでオフセット＆スケール。
    return { x, y };
}
/** ----------------------------------------------------------------------------
  * 00 Time & Math
----------------------------------------------------------------------------- */
/**
 * Update time using performance.now()
 * 経過時間・デルタタイムの算出
 */
export function updateTime() {
    const now = performance.now();
    const dtMs = now - App.time.last;
    App.time.now = now;
    App.time.delta = Math.min(dtMs / 1000, 0.1); // 低FPS時の暴走対策で上限（100ms）
    App.time.elapsed = (now - App.time.start) / 1000;
    App.time.last = now;
}
/**
 * Linear interpolation
 * 線形補間（位置・透明度などで多用）
 */
export function lerp(a, b, t) {
    return a + (b - a) * t;
}
/**
 * Clamp helper
 */
export function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
}
/**
 * イージング関数群のラッパー
 */
export const ease = {
    // https://easings.net/ を参考に自前実装すると良い（学習用）
    // 例：イーズイン・アウト（正弦）
    inOutSine: (t) => 0.5 * (1 - Math.cos(Math.PI * t)),
    outCubic: (t) => 1 - Math.pow(1 - t, 3),
    inCubic: (t) => t * t * t,
};
/** ----------------------------------------------------------------------------
  * 00 Events
----------------------------------------------------------------------------- */
/**
 * マウス・タッチ・キー入力の登録
 */
export function bindEvents() {
    const { canvas } = App;
    if (!canvas)
        return;
    const onMouseMove = (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) * (canvas.width / rect.width);
        const y = (e.clientY - rect.top) * (canvas.height / rect.height);
        App.input.mouseX = x / App.dpr;
        App.input.mouseY = y / App.dpr;
    };
    const onMouseDown = () => (App.input.mouseDown = true);
    const onMouseUp = () => (App.input.mouseDown = false);
    const onKeyDown = (e) => {
        // デフォルトのスクロール抑制は必要に応じて
        if (e.key === ' ')
            e.preventDefault();
        App.input.keys.add(e.key);
    };
    const onKeyUp = (e) => {
        App.input.keys.delete(e.key);
    };
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    // アンバインドが必要なら戻り値で関数を返す設計も可
}
/**
 * Handle inputs to state
 * 入力を状態変更に変換
 */
export function handleInput() {
    // 例：例：キーに応じてモード切替など
}
/** ----------------------------------------------------------------------------
  * 00 Debug helpers
----------------------------------------------------------------------------- */
/**
 * Toggle pause
 * 一時停止の切り替え
 */
export function togglePause() {
    if (App.running) {
        stopAnimation();
    }
    else {
        startAnimation();
    }
}
/**
 * Debug draw
 * 当たり判定・座標・補助線の描画
 */
export function debugDraw() {
    const { ctx, width, height, debug, entity } = App;
    if (!ctx)
        return;
    ctx.save();
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 1;
    if (debug.showAxes) {
        // 中心軸
        ctx.beginPath();
        ctx.moveTo(0, height / 2);
        ctx.lineTo(width, height / 2);
        ctx.moveTo(width / 2, 0);
        ctx.lineTo(width / 2, height);
        ctx.stroke();
    }
    if (debug.showBounds) {
        // エンティティのバウンディング
        ctx.beginPath();
        ctx.rect(entity.x - entity.r, entity.y - entity.r, entity.r * 2, entity.r * 2);
        ctx.stroke();
    }
    ctx.restore();
}
/**
 * Reset to initial state
 * 状態を初期値へ戻す
 */
export function reset() {
    initState();
}
/** ----------------------------------------------------------------------------
  * 00 Utilities
----------------------------------------------------------------------------- */
function resizeCanvas() {
    const { canvas, dpr } = App;
    if (!canvas)
        return;
    // CSS ピクセル基準の表示サイズ
    const { width: cssW, height: cssH } = canvas.getBoundingClientRect();
    // 物理解像度を DPR に合わせる（高解像度描画）
    const targetW = Math.max(1, Math.floor(cssW * dpr));
    const targetH = Math.max(1, Math.floor(cssH * dpr));
    if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;
        // 論理幅・高さ（描画 API 用に DPR 反映後を 1x として扱う）
        App.width = Math.floor(targetW / dpr);
        App.height = Math.floor(targetH / dpr);
        // 2D コンテキストを DPR に合わせてスケール
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.scale(dpr, dpr);
        }
    }
}
/**
 * Get current time
 * @param {Date} [d=new Date()]
 * @returns {{hour:number,min:number,sec:number,ms:number,timeStr:string}}
 */
export function getNowTime(d = new Date()) {
    const hour = d.getHours();
    const min = d.getMinutes();
    const sec = d.getSeconds();
    const ms = d.getMilliseconds();
    const timeStr = `${hour.toString().padStart(2, '0')}:` +
        `${min.toString().padStart(2, '0')}:` +
        `${sec.toString().padStart(2, '0')}`;
    return { hour, min, sec, ms, timeStr };
}
/**
 * Debounced resize handler
 */
const handleResize = debounce(() => {
    // レイアウト依存の再計算などがあれば書く
    // console.log('Resize handler');
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
document.addEventListener('DOMContentLoaded', () => {
    initCanvas('canvas');
    initState();
    bindEvents();
    startAnimation();
});
