/**
 * デバッグ用
 */
export declare const debugConsole: {
    /**
     * 標準ログ出力
     * @param message 出力する値
     * @returns void
     */
    log(message: unknown): void;
    /**
     * 情報ログ出力
     * @param message 出力する値
     * @returns void
     */
    info(message: unknown): void;
    /**
     * エラーログ出力
     * @param message 出力する値
     * @returns void
     */
    error(message: unknown): void;
    /**
     * 呼び出し回数をカウント
     * @param label ラベル
     * @returns void
     */
    count(label?: string): void;
    /**
     * カウンタをリセット
     * @param label ラベル
     * @returns void
     */
    countReset(label?: string): void;
    /**
     * 処理時間計測開始
     * @param label ラベル
     * @returns void
     */
    time(label?: string): void;
    /**
     * 処理時間計測終了
     * @param label ラベル
     * @returns void
     */
    timeEnd(label?: string): void;
    /**
     * 警告出力
     * @param message 出力する値
     * @returns void
     */
    warn(message: unknown): void;
    /**
     * 条件が false の場合に警告/エラーを出力します（console.assert）。
     * @param condition 真なら出力しません
     * @param message 失敗時のメッセージ
     * @returns void
     */
    assert(condition: boolean, message?: string): void;
};
