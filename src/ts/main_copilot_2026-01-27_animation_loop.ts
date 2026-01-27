/*
了解です。ここでは 「3. アニメーションループ」 にフォーカスして、requestAnimationFrame を使った型安全なループ実装を最小構成で導入します。
すでにある debounce やリサイズ処理に影響を与えず、後から統合しやすい形で進めます。

## ねらい（この段階でやること）

requestAnimationFrame ベースのループを作る
deltaTime（前フレームからの経過時間）を安全に計算し、時間依存で更新できる形にする
いつでも 開始/停止できる（将来のクリーンアップに備える）
タブ非表示/復帰で dt の暴走を抑制（可）

## 提案：最小のアニメーション・ループ実装（TypeScript）

下のコードは「ループ本体のみ」です。
Canvas 参照やリサイズは後で接続します。update と render の2関数へ分割し、テストと拡張がしやすい形にしてあります。
*/

// 3. アニメーションループ（最小実装）

// 状態の例（後で自由に差し替え可）
type State = {
  t: number;      // 経過時間（秒）
  tick: number;   // フレーム数
};

const state: State = { t: 0, tick: 0 };

// 物理・ロジック更新（dt: 前フレームからの経過時間[秒]）
function update(dt: number) {
  // 例：時間を蓄積するだけ（後で物理・座標更新に使える）
  state.t += dt;
  state.tick += 1;
}

// 描画処理（Canvas が後で手に入る前提。ここではダミー）
function render() {
  // ここは後で ctx.clearRect や描画などに置き換えます
  // 例: console.log(`[render] t=${state.t.toFixed(2)}s, tick=${state.tick}`);
}

// ループ管理
let rafId = 0;
let lastTs = 0; // 前フレームの timestamp（ms）

/**
 * フレーム関数
 * @param ts DOMHighResTimeStamp (ms)
 */
function step(ts: number) {
  // 次のフレームを予約
  rafId = window.requestAnimationFrame(step);

  // 初回フレームは dt を 0 として初期化
  if (lastTs === 0) {
    lastTs = ts;
    return;
  }

  // 経過時間（秒）を計算
  let dt = (ts - lastTs) / 1000;

  // 一時停止復帰やタブ非アクティブ後の「巨大 dt」を抑制
  // ここでは上限を 0.033s（= 約30fps相当）にクリップ
  dt = Math.min(dt, 0.033);

  // 前回タイムスタンプを更新
  lastTs = ts;

  // 更新→描画
  update(dt);
  render();
}

// 公開する制御関数（開始・停止・再開）
export function startLoop() {
  if (rafId === 0) {
    lastTs = 0; // 初回ステップで dt を0にするためリセット
    rafId = window.requestAnimationFrame(step);
  }
}

export function stopLoop() {
  if (rafId !== 0) {
    window.cancelAnimationFrame(rafId);
    rafId = 0;
  }
}

export function resetTime() {
  // 時間をリセットしたい時に呼ぶ（任意）
  lastTs = 0;
}
/* ------------------- */
/* ---- 呼び出し側 ---- */
/* ------------------- */

document.addEventListener('DOMContentLoaded', () => {
  // ループ開始
  startLoop();

  // 例：タブ非表示の間は止めたい場合
  const onVisibility = () => {
    if (document.hidden) {
      stopLoop();
    } else {
      resetTime(); // 復帰時に dt を0から再開
      startLoop();
    }
  };
  document.addEventListener('visibilitychange', onVisibility);

  // 必要ならクリーンアップ
  // window.addEventListener('beforeunload', () => {
  //   stopLoop();
  //   document.removeEventListener('visibilitychange', onVisibility);
  // });
});

/*
## 実装のポイント

- deltaTime（dt）計算

requestAnimationFrame から渡される ts は高精度なミリ秒（DOMHighResTimeStamp）。
dt = (ts - lastTs) / 1000 として秒へ変換し、更新処理は dt に比例させます（物理・アニメは解像度やフレームレートに依存しない）。

- 巨大 dt の処理

タブが非表示だったり、デバッガで止めた後に復帰すると 巨大な dt が来てシミュレーションが「ワープ」します。
ここでは **上限 0.033s（≒30fps相当）**でクリップして暴走を防いでいます。
より厳密には「固定タイムステップ + アキュムレータ」方式もあります（必要なら後段で導入可能）。

- 開始/停止/復帰
  - startLoop() は二重起動を防止
  - stopLoop() は確実に cancelAnimationFrame
  - 復帰時は resetTime() を挟むことで 復帰直後の dt を0 にして安定させます
*/
