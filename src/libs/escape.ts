/** エスケープ対象文字 */
const escapeChars = new Map([
  ['&', '&amp;'],
  ["'", '&#x27;'],
  ['`', '&#x60;'],
  ['"', '&quot;'],
  ['<', '&lt;'],
  ['>', '&gt;']
])

/**
 * HTML特殊文字をエスケープ
 * @param text 文字列
 * @returns エスケープ済み文字列
 */
export function escapeHTML(text: string) {
  return text.replace(/[&'`"<>]/g, (match) => escapeChars.get(match) || '')
}
