import { escape, unescape } from "querystring";

/**
 * RFC 3986 に対応した encodeURIComponent
 * @param str 文字列
 * @returns エンコード後
 * @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent
 */
export function fixedEncodeURIComponent(str: string): string {
  return encodeURIComponent(str).replace(
    /[!'()*]/g,
    (c) => "%" + c.charCodeAt(0).toString(16).toUpperCase()
  );
}
