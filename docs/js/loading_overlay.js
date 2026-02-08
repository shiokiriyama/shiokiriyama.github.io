// loadingOverlay.ts
// ESM module (TypeScript)
/**
 * デバッグログ（debug=true のときのみ出力）
 * @internal
 */
const debugLog = (state, ...args) => {
    if (state.debug) {
        // eslint-disable-next-line no-console
        console.log('[loading]', ...args);
    }
};
/**
 * 指定キーのタイマーをクリア
 * @internal
 */
const clearTimer = (state, key) => {
    const id = state.timers[key];
    if (id != null) {
        clearTimeout(id);
        state.timers[key] = null;
    }
};
/**
 * すべての内部タイマーをクリア
 * @internal
 */
const clearAllTimers = (state) => {
    clearTimer(state, 'failsafe');
    clearTimer(state, 'transitionFallback');
};
/**
 * CSS カスタムプロパティ `--fade-duration` にフェード時間を反映
 * @internal
 */
const applyFadeVar = (state) => {
    if (!state.el)
        return;
    state.el.style.setProperty('--fade-duration', `${state.fadeDurationMs}ms`);
};
/**
 * トランジションを伴う非表示処理。
 * - `.is-fading` を付与してフェードアウト
 * - `transitionend` で `hidden` を適用
 * - トランジションが発火しない環境向けにフォールバックタイマーも起動
 *
 * @internal
 */
const hideWithTransition = (state) => {
    const el = state.el;
    if (!el)
        return;
    if (el.hasAttribute('hidden'))
        return;
    if (state.isFading)
        return;
    state.isFading = true;
    const onTransitionEnd = (ev) => {
        if (ev.target !== el)
            return;
        el.setAttribute('hidden', '');
        el.classList.remove('is-fading');
        state.isFading = false;
        el.removeEventListener('transitionend', onTransitionEnd);
        clearTimer(state, 'transitionFallback');
        debugLog(state, 'hidden applied (transition end)');
    };
    // 念のため既存ハンドラを除去してから再度付与
    el.removeEventListener('transitionend', onTransitionEnd);
    el.addEventListener('transitionend', onTransitionEnd);
    // トランジションが無効／発火しない環境向けフォールバック
    clearTimer(state, 'transitionFallback');
    state.timers.transitionFallback = window.setTimeout(() => {
        if (state.isFading) {
            el.setAttribute('hidden', '');
            el.classList.remove('is-fading');
            state.isFading = false;
            el.removeEventListener('transitionend', onTransitionEnd);
            debugLog(state, 'hidden (transition fallback)');
        }
    }, Math.max(16, state.fadeDurationMs + 80)); // 少し余裕を持たせる
    el.classList.add('is-fading');
    debugLog(state, 'start fade-out');
};
/**
 * フェールセーフタイマーを開始（再設定時は再スタート）
 * @internal
 */
const startFailsafe = (state) => {
    clearTimer(state, 'failsafe');
    if (state.failsafeMs > 0) {
        state.timers.failsafe = window.setTimeout(() => {
            debugLog(state, 'failsafe timeout');
            hideWithTransition(state);
        }, state.failsafeMs);
    }
};
/**
 * ロール・ARIA属性の補完
 * @internal
 */
const ensureAriaAttributes = (el) => {
    if (!el.hasAttribute('role'))
        el.setAttribute('role', 'status');
    if (!el.hasAttribute('aria-live'))
        el.setAttribute('aria-live', 'polite');
    el.setAttribute('aria-busy', 'true');
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
export function initLoadingOverlay(options = {}) {
    const state = {
        selector: options.selector ?? '#loading',
        fadeDurationMs: Number.isFinite(options.fadeDurationMs ?? NaN)
            ? options.fadeDurationMs
            : 320,
        failsafeMs: Number.isFinite(options.failsafeMs ?? NaN)
            ? options.failsafeMs
            : 3000,
        debug: Boolean(options.debug),
        timers: { failsafe: null, transitionFallback: null },
        isFading: false,
        destroyed: false,
        el: null
    };
    state.el = document.querySelector(state.selector);
    if (!state.el) {
        console.warn(`[loading] element not found: ${state.selector}`);
        // NOOP コントローラ（呼び出し側での例外回避）
        return {
            hide: () => { },
            show: () => { },
            destroy: () => { },
            setOptions: () => { }
        };
        // 代わりに例外を投げたい場合は上記を throw に変更してください。
    }
    ensureAriaAttributes(state.el);
    applyFadeVar(state);
    startFailsafe(state);
    /**
     * フェードアウトを開始し、トランジション終端で `hidden` を適用します。
     */
    const hide = () => {
        if (state.destroyed)
            return;
        hideWithTransition(state);
    };
    /**
     * `hidden` を解除して即時表示します（タイマーはクリア）。
     */
    const show = () => {
        if (state.destroyed)
            return;
        clearAllTimers(state);
        state.el?.removeAttribute('hidden');
        state.el?.classList.remove('is-fading');
        debugLog(state, 'show');
    };
    /**
     * タイマーや内部状態を破棄します。
     * 破棄後のメソッド呼び出しは無視されます。
     */
    const destroy = () => {
        if (state.destroyed)
            return;
        clearAllTimers(state);
        state.destroyed = true;
        debugLog(state, 'destroyed');
    };
    /**
     * オプションを更新し、必要に応じて再適用（フェード時間/フェールセーフ/デバッグ）します。
     *
     * @param next - 更新するオプション（部分指定可）
     */
    const setOptions = (next) => {
        if (typeof next.fadeDurationMs === 'number' && next.fadeDurationMs >= 0) {
            state.fadeDurationMs = next.fadeDurationMs;
            applyFadeVar(state);
        }
        if (typeof next.failsafeMs === 'number' && next.failsafeMs >= 0) {
            state.failsafeMs = next.failsafeMs;
            startFailsafe(state);
        }
        if (typeof next.debug === 'boolean') {
            state.debug = next.debug;
        }
        debugLog(state, 'options updated', {
            fadeDurationMs: state.fadeDurationMs,
            failsafeMs: state.failsafeMs,
            debug: state.debug
        });
    };
    return { hide, show, destroy, setOptions };
}
export default initLoadingOverlay;
