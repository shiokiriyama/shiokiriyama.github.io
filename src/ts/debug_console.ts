/**
 * デバッグ用
 */
export const debugConsole = {
  /**
   * 標準ログ出力
   * @param message 出力する値
   * @returns void
   */
  log(message: unknown): void {
    console.log(message);
  },

  /**
   * 情報ログ出力
   * @param message 出力する値
   * @returns void
   */
  info(message: unknown): void {
    console.info(message);
  },

  /**
   * エラーログ出力
   * @param message 出力する値
   * @returns void
   */
  error(message: unknown): void {
    console.error(message);
  },

  /**
   * 呼び出し回数をカウント
   * @param label ラベル
   * @returns void
   */
  count(label?: string): void {
    console.count(label);
  },

  /**
   * カウンタをリセット
   * @param label ラベル
   * @returns void
   */
  countReset(label?: string): void {
    console.countReset(label);
  },

  /**
   * 処理時間計測開始
   * @param label ラベル
   * @returns void
   */
  time(label = 'process(ms)'): void {
    console.time(label);
  },

  /**
   * 処理時間計測終了
   * @param label ラベル
   * @returns void
   */
  timeEnd(label = 'process(ms)'): void {
    console.timeEnd(label);
  },

  /**
   * 警告出力
   * @param message 出力する値
   * @returns void
   */
  warn(message: unknown): void {
    console.warn(message);
  },

  /**
   * 条件が false の場合に警告/エラーを出力します（console.assert）。
   * @param condition 真なら出力しません
   * @param message 失敗時のメッセージ
   * @returns void
   */
  assert(condition: boolean, message?: string): void {
    console.assert(condition, message);
  },
};
