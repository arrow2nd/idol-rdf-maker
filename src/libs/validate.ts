/**
 * 数値のみ
 * @param value 文字列
 * @returns エラーメッセージ
 */
export function validateNumber(value: string) {
  return /^\d+$/.test(value) ? undefined : '数値を入力してください'
}

/**
 * 日付 (YYYY-MM-DD)
 * @param value 文字列
 * @returns エラーメッセージ
 */
export function validateDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? undefined
    : 'YYYY-MM-DDの形式で入力してください'
}

/**
 * URL
 * @param value 文字列
 * @returns エラーメッセージ
 */
export function validateURL(value: string) {
  return /^https?:\/\//.test(value) ? undefined : '有効なURL形式ではありません'
}
