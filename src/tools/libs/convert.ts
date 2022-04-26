/** ブランド名 変換リスト */
const brands = new Map([
  ['DearlyStars', 'ディアリースターズ'],
  ['MillionLive', 'ミリオンライブ！'],
  ['CinderellaGirls', 'シンデレラガールズ'],
  ['ShinyColors', 'シャイニーカラーズ'],
  ['Other', 'その他']
])

/**
 * ブランド名を検索しやすい名称に変換
 * @param name ブランド名
 * @returns 変換後のブランド名
 */
export function convertBrandName(name: string): string {
  return brands.get(name) || name
}
