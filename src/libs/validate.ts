type ValidateResult = string | undefined;

/**
 * 数値のみ
 * @param value 文字列
 * @returns エラーメッセージ
 */
export function validateNumber(value: string): ValidateResult {
  return /^\d+$/.test(value) ? undefined : "数値を入力してください";
}

/**
 * 日付 (YYYY-MM-DD)
 * @param value 文字列
 * @returns エラーメッセージ
 */
export function validateDate(value: string): ValidateResult {
  return /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? undefined
    : "YYYY-MM-DDの形式で入力してください";
}

/**
 * URL
 * @param value 文字列
 * @returns エラーメッセージ
 */
export function validateURL(value: string): ValidateResult {
  return /^https?:\/\//.test(value) ? undefined : "有効なURL形式ではありません";
}

/**
 * カラーコード
 * @param value 文字列
 * @returns エラーメッセージ
 */
export function validateHexColor(value: string): ValidateResult {
  return value === "" || /^[A-Fa-f0-9]{6}$/.test(value)
    ? undefined
    : "6ケタの16進数カラーコードを入力してください";
}
