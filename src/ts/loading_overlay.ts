// loadingOverlay.ts
// ESM module (TypeScript)

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
 * 内部状態
 * @internal
 */
type InternalState = {
  selector: string;
  fadeDurationMs: number;
  failsafeMs: number;
  debug: boolean;
  timers: {
    /** フェールセーフ用の setTimeout ID */
    failsafe: number | null;
    /** CSS トランジションが無効な環境向けフォールバックの setTimeout ID */
    transitionFallback: number | null;
  };
  /** フェード中フラグ（二重実行防止） */
  isFading: boolean;
  /** 破棄済みフラグ */
  destroyed: boolean;
  /** 対象要素 */
  el: HTMLElement | null;
};

/**
 * デバッグログ（debug=true のときのみ出力）
 * @internal
 */
const debugLog = (state: InternalState, ...args: unknown[]): void => {
  if (state.debug) {
    // eslint-disable-next-line no-console
    console.log('[loading]', ...args);
  }
};

/**
 * 指定キーのタイマーをクリア
 * @internal
 */
const clearTimer = (
  state: InternalState,
  key: keyof InternalState['timers']
): void => {
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
const clearAllTimers = (state: InternalState): void => {
  clearTimer(state, 'failsafe');
  clearTimer(state, 'transitionFallback');
};

/**
 * CSS カスタムプロパティ `--fade-duration` にフェード時間を反映
 * @internal
 */
const applyFadeVar = (state: InternalState): void => {
  if (!state.el) return;
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
const hideWithTransition = (state: InternalState): void => {
  const el = state.el;
  if (!el) return;
  if (el.hasAttribute('hidden')) return;
  if (state.isFading) return;

  state.isFading = true;

  const onTransitionEnd = (ev: Event): void => {
    if (ev.target !== el) return;
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
const startFailsafe = (state: InternalState): void => {
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
const ensureAriaAttributes = (el: HTMLElement): void => {
  if (!el.hasAttribute('role')) el.setAttribute('role', 'status');
  if (!el.hasAttribute('aria-live')) el.setAttribute('aria-live', 'polite');
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
export function initLoadingOverlay(
  options: LoadingOverlayOptions = {}
): LoadingOverlayController {
  const state: InternalState = {
    selector: options.selector ?? '#loading',
    fadeDurationMs: Number.isFinite(options.fadeDurationMs ?? NaN)
      ? (options.fadeDurationMs as number)
      : 320,
    failsafeMs: Number.isFinite(options.failsafeMs ?? NaN)
      ? (options.failsafeMs as number)
      : 3000,
    debug: Boolean(options.debug),
    timers: { failsafe: null, transitionFallback: null },
    isFading: false,
    destroyed: false,
    el: null
  };

  state.el = document.querySelector<HTMLElement>(state.selector);
  if (!state.el) {
    console.warn(`[loading] element not found: ${state.selector}`);
    // NOOP コントローラ（呼び出し側での例外回避）
    return {
      hide: () => {},
      show: () => {},
      destroy: () => {},
      setOptions: () => {}
    };
    // 代わりに例外を投げたい場合は上記を throw に変更してください。
  }

  ensureAriaAttributes(state.el);
  applyFadeVar(state);
  startFailsafe(state);

  /**
   * フェードアウトを開始し、トランジション終端で `hidden` を適用します。
   */
  const hide = (): void => {
    if (state.destroyed) return;
    hideWithTransition(state);
  };

  /**
   * `hidden` を解除して即時表示します（タイマーはクリア）。
   */
  const show = (): void => {
    if (state.destroyed) return;
    clearAllTimers(state);
    state.el?.removeAttribute('hidden');
    state.el?.classList.remove('is-fading');
    debugLog(state, 'show');
  };

  /**
   * タイマーや内部状態を破棄します。
   * 破棄後のメソッド呼び出しは無視されます。
   */
  const destroy = (): void => {
    if (state.destroyed) return;
    clearAllTimers(state);
    state.destroyed = true;
    debugLog(state, 'destroyed');
  };

  /**
   * オプションを更新し、必要に応じて再適用（フェード時間/フェールセーフ/デバッグ）します。
   *
   * @param next - 更新するオプション（部分指定可）
   */
  const setOptions = (next: Partial<LoadingOverlayOptions>): void => {
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
