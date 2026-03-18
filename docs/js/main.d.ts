/*!
 * createdAt: 2025-04-17T14:11:47+09:00
 * updatedAt: 2026-03-17T14:56:51+09:00
 */
/**
 *  import { debugCheck } from './debug_check';
 *  import { debugConsole } from './debug_console';
 */
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
/**
 * [ ] delta は秒で扱い、速度は px/s にする（フレームレート非依存）
 * [ ] update → render の順序を守る
 * [ ] DPR を踏まえた座標・サイズ・クリア
 * [ ] イベント座標は getBoundingClientRect と DPR で正確化
 * [ ] 低 FPS 復帰時は delta をクランプ
 * [ ] 余計な ctx.save/restore を避ける（必要箇所に限定）
 */
/** ----------------------------------------------------------------------------
 * 00 Global scope
----------------------------------------------------------------------------- */
export interface StateTime {
    start: number;
    last: number;
    now: number;
    delta: number;
    elapsed: number;
}
export interface StateEntity {
    x: number;
    y: number;
    vx: number;
    vy: number;
    r: number;
}
export interface StateCanvas {
    canvas: HTMLCanvasElement | null;
    ctx: CanvasRenderingContext2D | null;
    width: number;
    height: number;
    dpr: number;
    time: StateTime;
    running: boolean;
    rafId: number | null;
    entity: StateEntity;
    input: {
        mouseX: number;
        mouseY: number;
        mouseDown: boolean;
        keys: Set<string>;
    };
    debug: {
        showBounds: boolean;
        showAxes: boolean;
    };
}
export declare const App: StateCanvas;
/** ----------------------------------------------------------------------------
  * 00 Init layer
----------------------------------------------------------------------------- */
/**
 * Initialize canvas
 * Canvas/Context 取得・サイズ設定・初期状態
 */
export declare function initCanvas(id: string): void;
/**
 * Initialize simulation state
 * time と entity の初期化
 */
export declare function initState(): void;
/**
 * Prepare external assets
 * 外部リソース準備・読込管理
 */
export declare function initAssets(): void;
/** ----------------------------------------------------------------------------
  * 00 Main loop control
----------------------------------------------------------------------------- */
/**
 * Start animation loop
 * アニメーション開始エントリーポイント
 */
export declare function startAnimation(): void;
/**
 * Stop animation loop and release RAF
 * アニメーション停止・破棄処理
 */
export declare function stopAnimation(): void;
/**
 * Main RAF callback: update -> render
 * requestAnimationFrame に渡すメインループ（更新 → 描画の順序を保証する）
 * @returns {void}
 */
export declare function loop(): void;
/** ----------------------------------------------------------------------------
  * 00 Update state
----------------------------------------------------------------------------- */
/**
 * Update one frame
 * 1フレーム分の状態更新を統括
 */
export declare function update(): void;
/**
 * Update position
 * 座標・移動量・補間処理を更新
 */
export declare function updatePosition(): void;
/**
 * Update velocity
 * 速度・加速度・減衰等の運動要素を更新
 */
export declare function updateVelocity(): void;
/**
 * Update logical flags
 * フラグ・モード・フェーズ遷移等の論理状態を更新
 */
export declare function updateState(): void;
/** ----------------------------------------------------------------------------
  * 00 Render layer
----------------------------------------------------------------------------- */
/**
 * Render one frame
 * 1フレーム分の描画処理を統括
 */
export declare function render(): void;
/**
 * Clear canvas
 * Canvas のクリア（前フレームの破棄）
 */
export declare function clear(): void;
/**
 * Draw background
 * 背景要素を描画
 */
export declare function drawBackground(): void;
/**
 * Draw main entity
 * キャラクター・オブジェクト等の主体描画
 */
export declare function drawEntity(): void;
/**
 * Draw foreground
 * 前景・UI・エフェクト等の描画
 */
export declare function drawForeground(): void;
/** ----------------------------------------------------------------------------
  * 00 Transform helpers
----------------------------------------------------------------------------- */
/**
 * Apply translate/rotate/scale
 * translate / rotate / scale をまとめて適用
 * Pivot 等を扱うなら引数を拡張
 */
export declare function applyTransform(): void;
/**
 * Reset transform
 * 描画状態を既定値に
 */
export declare function resetTransformState(): void;
/**
 * Convert world -> screen
 * 論理座標 -> 描画座標への変換
 */
export declare function worldToScreen(x: number, y: number): {
    x: number;
    y: number;
};
/** ----------------------------------------------------------------------------
  * 00 Time & Math
----------------------------------------------------------------------------- */
/**
 * Update time using performance.now()
 * 経過時間・デルタタイムの算出
 */
export declare function updateTime(): void;
/**
 * Linear interpolation
 * 線形補間（位置・透明度などで多用）
 */
export declare function lerp(a: number, b: number, t: number): number;
/**
 * Clamp helper
 */
export declare function clamp(v: number, min: number, max: number): number;
/**
 * イージング関数群のラッパー
 */
export declare const ease: {
    inOutSine: (t: number) => number;
    outCubic: (t: number) => number;
    inCubic: (t: number) => number;
};
/** ----------------------------------------------------------------------------
  * 00 Events
----------------------------------------------------------------------------- */
/**
 * マウス・タッチ・キー入力の登録
 */
export declare function bindEvents(): void;
/**
 * Handle inputs to state
 * 入力を状態変更に変換
 */
export declare function handleInput(): void;
/** ----------------------------------------------------------------------------
  * 00 Debug helpers
----------------------------------------------------------------------------- */
/**
 * Toggle pause
 * 一時停止の切り替え
 */
export declare function togglePause(): void;
/**
 * Debug draw
 * 当たり判定・座標・補助線の描画
 */
export declare function debugDraw(): void;
/**
 * Reset to initial state
 * 状態を初期値へ戻す
 */
export declare function reset(): void;
/**
 * Get current time
 * @param {Date} [d=new Date()]
 * @returns {{hour:number,min:number,sec:number,ms:number,timeStr:string}}
 */
export declare function getNowTime(d?: Date): {
    hour: number;
    min: number;
    sec: number;
    ms: number;
    timeStr: string;
};
