/**
 * ローディング・オーバーレイを制御する軽量ユーティリティ。
 *
 * - CSS側で `#loading { transition: opacity var(--fade-duration) ease; }` と
 *   `.is-fading { opacity: 0 }` を定義しておく想定です。
 * - フェード時間は CSS カスタムプロパティ `--fade-duration` に反映されます。
 * - すべてのリソース読込完了後（`window.load`）に `hide()` を呼ぶのが一般的です。
 *
 * @example 基本的な使い方
 * ```ts
 * import initLoadingOverlay from './loadingOverlay.js';
 *
 * const overlay = initLoadingOverlay({
 *   fadeDurationMs: 360,
 *   failsafeMs: 3000,
 *   debug: false
 * });
 *
 * window.addEventListener('load', () => {
 *   overlay.hide(); // 全リソース読込完了でフェードアウト
 * });
 * ```
 *
 * @remarks
 * - `failsafeMs` 経過で自動的に `hide()` されます（0以下で無効）。
 * - 画面リーダー配慮のため、`role="status"`, `aria-live="polite"`, `aria-busy="true"` を補完します。
 * - `hidden` 属性の付与で最終的にDOMから非表示化します。
 *
 * @packageDocumentation
 */
/**
 * 初期化オプション
 */
export type LoadingOverlayOptions = {
    /**
     * フェード時間（ミリ秒）。
     * CSS 変数 `--fade-duration` に反映されます。
     *
     * @defaultValue 320
     */
    fadeDurationMs?: number;
    /**
     * フェールセーフのタイムアウト（ミリ秒）。
     * 指定時間が経過すると自動的に `hide()` が呼ばれます。
     * 0以下を指定するとフェールセーフは無効化されます。
     *
     * @defaultValue 3000
     */
    failsafeMs?: number;
    /**
     * デバッグログの有効化。
     *
     * @defaultValue false
     */
    debug?: boolean;
    /**
     * 対象オーバーレイ要素のセレクタ。
     * 既定は `#loading`。
     *
     * @defaultValue "#loading"
     */
    selector?: string;
};
/**
 * コントローラ API
 */
export type LoadingOverlayController = {
    /**
     * オーバーレイをフェードアウトし、トランジション終了後に `hidden` を付与します。
     * すでに非表示またはフェード中の場合は何もしません。
     */
    hide: () => void;
    /**
     * オーバーレイを即時表示（`hidden` を解除）します。
     * 既存タイマー（フェールセーフ／フォールバック）はクリアされます。
     */
    show: () => void;
    /**
     * 内部のタイマーやリスナーを解放します。
     * 解放後はメソッド呼び出しは無視されます。
     */
    destroy: () => void;
    /**
     * ランタイムでオプションを更新します。
     * - `fadeDurationMs`：CSS変数へ即時反映
     * - `failsafeMs`：指定し直した値でフェールセーフを再スタート
     * - `debug`：ログ有効/無効を切替
     */
    setOptions: (next: Partial<LoadingOverlayOptions>) => void;
};
/**
 * ローディング・オーバーレイを初期化し、制御用コントローラを返します。
 *
 * @param options - 初期化オプション
 * @returns ローディング・オーバーレイのコントローラ
 *
 * @example
 * ```ts
 * import { initLoadingOverlay } from './loadingOverlay.js';
 *
 * const ctrl = initLoadingOverlay({
 *   fadeDurationMs: 360,
 *   failsafeMs: 2500,
 *   debug: true
 * });
 *
 * window.addEventListener('load', () => ctrl.hide());
 * ```
 */
export declare function initLoadingOverlay(options?: LoadingOverlayOptions): LoadingOverlayController;
export default initLoadingOverlay;
