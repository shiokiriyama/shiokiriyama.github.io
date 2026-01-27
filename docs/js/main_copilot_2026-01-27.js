/*
 * - Canvas を生成して DOM に追加
 *
 * document.createElement('canvas') で作成、document.body などに追加。
 *
 * - リサイズ処理（debounce を適用）
 *
 * window.innerWidth / innerHeight を使って Canvas の表示サイズを決める。
 * 高 DPI 対応（devicePixelRatio）のため、canvas.width/height は物理解像度、style.width/height は CSS ピクセルに分ける。
 *
 * - アニメーションループ
 *
 * requestAnimationFrame でループ。
 * deltaTime（前フレームからの経過ms）を計算し、物理計算を時間依存に。
 *
 * - サンプル：1つのボールが弾む
 *
 * 位置と速度を持つ簡単なボールを描画。壁でバウンドさせる。
 *
 * - クリーンアップ
 *
 * AbortController でイベントリスナを一括解除。
 * cancelAnimationFrame でループ停止できるようにする（今回はページ生存中は動かしっぱなしでもOK。例として停止コードをコメントで残す）。
 */
import { debounce } from './debounce';
document.addEventListener('DOMContentLoaded', () => {
    // ==========
    // 1) Canvas 準備
    // ==========
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        // 取得失敗時は処理を中断
        // （実運用ではユーザーにフィードバックするなど）
        return;
    }
    // 見た目サイズ（CSS）を調整しやすいように style 経由で付与
    canvas.style.display = 'block'; // スクロールバー回避
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    document.body.appendChild(canvas);
    // ==========
    // 2) リサイズ処理（高DPI対応）
    // ==========
    const resizeCanvas = () => {
        const dpr = window.devicePixelRatio || 1;
        // CSS ピクセルの表示サイズ（= viewport）
        const cssWidth = window.innerWidth;
        const cssHeight = window.innerHeight;
        // 物理解像度に合わせて backing store サイズを設定
        canvas.width = Math.max(1, Math.floor(cssWidth * dpr));
        canvas.height = Math.max(1, Math.floor(cssHeight * dpr));
        // 座標系を CSS ピクセル基準に戻すため、スケール
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        // 背景クリア
        ctx.clearRect(0, 0, cssWidth, cssHeight);
    };
    // Debounced resize handler
    const handleResize = debounce(() => {
        resizeCanvas();
        // ここにレイアウト依存の再計算などがあれば書く
        // console.log('Resize handled');
    }, 150);
    const gravity = 1500; // px/s^2
    const restitution = 0.8; // 反発係数
    const ball = {
        pos: { x: 200, y: 200 },
        vel: { x: 220, y: -50 },
        radius: 24,
        color: '#2AA9FF',
    };
    // ==========
    // 4) ループ（requestAnimationFrame）
    // ==========
    let rafId = 0;
    let lastTs = 0;
    const step = (ts) => {
        rafId = window.requestAnimationFrame(step);
        // 初回
        if (!lastTs) {
            lastTs = ts;
            return;
        }
        // 経過時間（秒）
        const dt = Math.min(0.033, (ts - lastTs) / 1000); // 上限 33ms
        lastTs = ts;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        // 物理更新
        ball.vel.y += gravity * dt;
        ball.pos.x += ball.vel.x * dt;
        ball.pos.y += ball.vel.y * dt;
        // 壁反射（左右）
        if (ball.pos.x - ball.radius < 0) {
            ball.pos.x = ball.radius;
            ball.vel.x *= -restitution;
        }
        else if (ball.pos.x + ball.radius > width) {
            ball.pos.x = width - ball.radius;
            ball.vel.x *= -restitution;
        }
        // 壁反射（上下）
        if (ball.pos.y - ball.radius < 0) {
            ball.pos.y = ball.radius;
            ball.vel.y *= -restitution;
        }
        else if (ball.pos.y + ball.radius > height) {
            ball.pos.y = height - ball.radius;
            ball.vel.y *= -restitution;
            // 地面で速度が極小になったら止める（数値振動対策）
            if (Math.abs(ball.vel.y) < 10)
                ball.vel.y = 0;
        }
        // 描画
        ctx.clearRect(0, 0, width, height);
        // 背景（任意）
        ctx.fillStyle = '#0B0F14';
        ctx.fillRect(0, 0, width, height);
        // ボール
        ctx.beginPath();
        ctx.arc(ball.pos.x, ball.pos.y, ball.radius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fillStyle = ball.color;
        ctx.fill();
        // 影（簡易）
        const shadowY = height - 10;
        const dist = Math.max(0, shadowY - ball.pos.y);
        const scale = Math.max(0.2, 1 - dist / (height * 0.8));
        ctx.fillStyle = 'rgba(0,0,0,0.25)';
        ctx.beginPath();
        ctx.ellipse(ball.pos.x, shadowY, ball.radius * 1.5 * scale, ball.radius * 0.5 * scale, 0, 0, Math.PI * 2);
        ctx.fill();
    };
    // ==========
    // 5) イベント登録と初期化
    // ==========
    const controller = new AbortController();
    const { signal } = controller;
    window.addEventListener('resize', handleResize, { signal });
    // 初期反映
    resizeCanvas();
    // 初期位置を中心寄りに
    ball.pos.x = Math.max(ball.radius + 10, Math.min(canvas.clientWidth - ball.radius - 10, canvas.clientWidth / 2));
    ball.pos.y = Math.max(ball.radius + 10, Math.min(canvas.clientHeight - ball.radius - 10, canvas.clientHeight / 3));
    // ループ開始
    rafId = window.requestAnimationFrame(step);
    // ==========
    // 6) クリーンアップ（必要時に呼ぶ）
    // ==========
    const cleanup = () => {
        controller.abort(); // resizeリスナ解除
        cancelAnimationFrame(rafId); // ループ停止
        // DOMから取り外す場合
        // canvas.remove();
        // 残タイマーのキャンセル
        handleResize.cancel();
    };
    // 例: ページが非表示になったら一時停止/復帰（任意）
    const onVisibility = () => {
        if (document.hidden) {
            cancelAnimationFrame(rafId);
            handleResize.cancel();
        }
        else {
            lastTs = 0; // 次フレームで dt をリセット
            rafId = window.requestAnimationFrame(step);
        }
    };
    document.addEventListener('visibilitychange', onVisibility, { signal });
    // SPAなどでアンマウント時に cleanup() を呼べるように、必要なら export やグローバルへ
    // (window as any).__cleanupCanvasDemo__ = cleanup;
});
