/** ブランド名 変換リスト */
const brands = new Map([
  ['DearlyStars', 'ディアリースターズ'],
  ['MillionLive', 'ミリオンライブ！'],
  ['CinderellaGirls', 'シンデレラガールズ'],
  ['ShinyColors', 'シャイニーカラーズ'],
  ['Other', 'その他']
])

type Unit = {
  name: string
  member: string[]
}

/** 主要ユニット名リスト */
const units: Unit[] = [
  {
    name: 'イルミネーションスターズ',
    member: ['Sakuragi_Mano', 'Kazano_Hiori', 'Hachimiya_Meguru']
  },
  {
    name: 'アンティーカ',
    member: [
      'Mitsumine_Yuika',
      'Shirase_Sakuya',
      'Tanaka_Mamimi',
      'Tsukioka_Kogane',
      'Yukoku_Kiriko'
    ]
  },
  {
    name: '放課後クライマックスガールズ',
    member: [
      'Arisugawa_Natsuha',
      'Komiya_Kaho',
      'Morino_Rinze',
      'Saijo_Juri',
      'Sonoda_Chiyoko'
    ]
  },
  {
    name: 'アルストロメリア',
    member: ['Kuwayama_Chiyuki', 'Osaki_Amana', 'Osaki_Tenka']
  },
  {
    name: 'ストレイライト',
    member: ['Izumi_Mei', 'Mayuzumi_Fuyuko', 'Serizawa_Asahi']
  },
  {
    name: 'ノクチル',
    member: [
      'Asakura_Toru',
      'Fukumaru_Koito',
      'Higuchi_Madoka',
      'Ichikawa_Hinana'
    ]
  },
  {
    name: 'シーズ',
    member: ['Aketa_Mikoto', 'Nanakusa_Nichika']
  }
]

/**
 * ブランド名を検索しやすい名称に変換
 * @param idol アイドルリソース名
 * @param brand ブランド名
 * @returns 変換後のブランド名
 */
export function convertBrandName(idol: string, brand: string): string {
  if (['Ryoo_Haena', 'Juney', 'Im_Yujin'].includes(idol)) {
    return '韓国版モバマス'
  }

  return brands.get(brand) || brand
}

/**
 * 所属している主要ユニット名を取得
 * @param idol アイドルリソース名
 * @returns ユニット名
 */
export function getUnitName(idol: string): string | undefined {
  return units.find(({ member }) => member.includes(idol))?.name
}
