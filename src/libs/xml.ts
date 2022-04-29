import { XMLBuilder } from 'fast-xml-parser'

/**
 * XML 文字列をビルド
 * @param obj データオブジェクト
 * @returns XML 文字列
 */
export function buildXML(obj: any): string {
  const builder = new XMLBuilder({
    ignoreAttributes: false,
    format: true,
    suppressEmptyNode: true
  })

  return builder.build(obj)
}
