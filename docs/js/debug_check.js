/**
 * 各種型判定
 */
export const debugCheck = {
    /**
     * 値が配列かどうかを判定します。
     * @param val 判定する値
     * @returns `val is unknown[]`
     */
    isArray: (val) => Array.isArray(val),
    /**
     * 値が真偽値（boolean）かどうかを判定します。
     * @param val 判定する値
     * @returns `val is boolean`
     */
    isBoolean: (val) => typeof val === 'boolean',
    /**
     * 値が関数かどうかを判定します。
     * @param val 判定する値
     * @returns `val is (...args: unknown[]) => unknown`
     */
    isFunction: (val) => typeof val === 'function',
    /**
     * 値が `null` かどうかを判定します。
     * @param val 判定する値
     * @returns `val is null`
     */
    isNull: (val) => val === null,
    /**
     * 値が「有限な数値」かどうかを判定します。
     * `NaN` や `Infinity` を除外します。
     * @param val 判定する値
     * @returns `val is number`
     */
    isNumber: (val) => typeof val === 'number' && Number.isFinite(val),
    /**
     * 値が文字列かどうかを判定します。
     * @param val 判定する値
     * @returns `val is string`
     */
    isString: (val) => typeof val === 'string',
    /**
     * 値が `undefined` かどうかを判定します。
     * @param val 判定する値
     * @returns `val is undefined`
     */
    isUndefined: (val) => typeof val === 'undefined',
    /**
     * 値がシンボルかどうかを判定します。
     * @param val 判定する値
     * @returns `val is symbol`
     */
    isSymbol: (val) => typeof val === 'symbol',
    /**
     * 値が「オブジェクト（配列と null を除く）」かどうかを判定します。
     * ※ Plain Object に限定しない一般的なオブジェクト判定です。
     * @param val 判定する値
     * @returns `val is object`
     */
    isObject: (val) => typeof val === 'object' && val !== null && !Array.isArray(val),
    /**
     * 値が「プレーンオブジェクト」かどうかを判定します。
     * 例：`{}`, `Object.create(null)` は true。
     * クラスインスタンスや配列、関数、Map/Set は false。
     * @param val 判定する値
     * @returns `val is Record<string | number | symbol, unknown>`
     */
    isPlainObject: (val) => {
        if (typeof val !== 'object' || val === null)
            return false;
        const proto = Object.getPrototypeOf(val);
        return proto === Object.prototype || proto === null;
    },
    /**
     * オブジェクトが「空（自分自身の列挙可能なプロパティが0）」かどうかを判定します。
     * Map/Set は対象外です。必要なら `isEmpty` を使用してください。
     * @param obj 判定する値
     * @returns 空なら true
     */
    isEmptyObject: (obj) => typeof obj === 'object' && obj !== null && !Array.isArray(obj) && Object.keys(obj).length === 0,
    /**
     * 値が Date インスタンスで、かつ有効な日時かどうかを判定します。
     * @param val 判定する値
     * @returns `val is Date`
     */
    isDate: (val) => val instanceof Date && !Number.isNaN(val.getTime()),
    /**
     * 値が RegExp インスタンスかどうかを判定します。
     * @param val 判定する値
     * @returns `val is RegExp`
     */
    isRegExp: (val) => val instanceof RegExp,
    /**
     * 値が Promise ライク（then を持つ）かどうかを判定します。
     * ネイティブ Promise である必要はありません。
     * @param val 判定する値
     * @returns `val is Promise<unknown>`
     */
    isPromise: (val) => !!val && (typeof val === 'object' || typeof val === 'function') && 'then' in val,
    /**
     * 値が Map かどうかを判定します。
     * @param val 判定する値
     * @returns `val is Map<unknown, unknown>`
     */
    isMap: (val) => val instanceof Map,
    /**
     * 値が Set かどうかを判定します。
     * @param val 判定する値
     * @returns `val is Set<unknown>`
     */
    isSet: (val) => val instanceof Set,
    /**
     * 値が iterable（for...of できる）かどうかを判定します。
     * @param val 判定する値
     * @returns iterable なら true
     */
    isIterable: (val) => val != null && typeof val[Symbol.iterator] === 'function',
    /**
     * 代表的な「空」判定。
     * - 文字列: 長さ0
     * - 配列: 長さ0
     * - Map/Set: size=0
     * - プレーンオブジェクト: キー数0
     * その他は false（未定義・null は true 扱い）
     * @param val 判定する値
     * @returns 空なら true
     */
    isEmpty: (val) => {
        if (val == null)
            return true; // null/undefined
        if (typeof val === 'string')
            return val.length === 0;
        if (Array.isArray(val))
            return val.length === 0;
        if (val instanceof Map || val instanceof Set)
            return val.size === 0;
        if (typeof val === 'object') {
            // プレーンオブジェクトのみ空判定したいなら isPlainObject を併用してください
            return Object.keys(val).length === 0;
        }
        return false;
    },
};
