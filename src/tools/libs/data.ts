import { QuickPickItem } from "vscode";

/** ブランドリスト */
const brands = new Map([
  ["765AS", "765PRO ALLSTARS"],
  ["DearlyStars", "ディアリースターズ"],
  ["MillionLive", "ミリオンライブ！"],
  ["CinderellaGirls", "シンデレラガールズ"],
  ["SideM", "SideM"],
  ["ShinyColors", "シャイニーカラーズ"],
  ["Other", "その他"]
]);

type Unit = {
  name: string;
  member: string[];
};

/** ユニットリスト */
const units: Unit[] = [
  {
    name: "Jupiter（じゅぴたー）",
    member: ["Mitarai_Shota", "Amagase_Toma", "Ijuin_Hokuto"]
  },
  {
    name: "DRAMATIC STARS（どらまちっくすたーず）",
    member: ["Sakuraba_Kaoru", "Tendo_Teru", "Kashiwagi_Tsubasa"]
  },
  {
    name: "Altessimo（あるてっしも）",
    member: ["Tsuzuki_Kei", "Kagura_Rei"]
  },
  {
    name: "Beit（ばいと）",
    member: ["Takajo_Kyoji", "Pierre", "Watanabe_Minori"]
  },
  {
    name: "W（だぶる）",
    member: ["Aoi_Yusuke", "Aoi_Kyosuke"]
  },
  {
    name: "FRAME（ふれーむ）",
    member: ["Kimura_Ryu", "Akuno_Hideo", "Shingen_Seiji"]
  },
  {
    name: "彩（さい）",
    member: ["Kiyosumi_Kuro", "Nekoyanagi_Kirio", "Hanamura_Shoma"]
  },
  {
    name: "High×Joker（はいじょーかー）",
    member: [
      "Fuyumi_Jun",
      "Akiyama_Hayato",
      "Iseya_Shiki",
      "Sakaki_Natsuki",
      "Wakazato_Haruna"
    ]
  },
  {
    name: "神速一魂（しんそくいっこん）",
    member: ["Akai_Suzaku", "Kurono_Genbu"]
  },
  {
    name: "Café Parade（かふぇぱれーど）",
    member: [
      "Uzuki_Makio",
      "Kamiya_Yukihiro",
      "Asselin_BB_2",
      "Shinonome_Soichiro",
      "Mizushima_Saki"
    ]
  },
  {
    name: "もふもふえん",
    member: ["Tachibana_Shiro", "Okamura_Nao", "Himeno_Kanon"]
  },
  {
    name: "S.E.M（せむ）",
    member: ["Yamashita_Jiro", "Maita_Rui", "Hazama_Michio"]
  },
  {
    name: "THE 虎牙道（ざ　こがどう）",
    member: ["Enjoji_Michiru", "Taiga_Takeru", "Kizaki_Ren"]
  },
  {
    name: "F-LAGS（ふらっぐす）",
    member: ["Tsukumo_Kazuki", "Akizuki_Ryo_315", "Kabuto_Daigo"]
  },
  {
    name: "Legenders（れじぇんだーず）",
    member: ["Kuzunoha_Amehiko", "Kitamura_Sora", "Koron_Chris"]
  },
  {
    name: "C.FIRST（くらすふぁーすと）",
    member: ["Hanazono_Momohito", "Amamine_Shu", "Mayumi_Eishin"]
  },
  {
    name: "illumination STARS（いるみねーしょんすたーず）",
    member: ["Sakuragi_Mano", "Kazano_Hiori", "Hachimiya_Meguru"]
  },
  {
    name: "L’Antica（あんてぃーか）",
    member: [
      "Tsukioka_Kogane",
      "Tanaka_Mamimi",
      "Shirase_Sakuya",
      "Mitsumine_Yuika",
      "Yukoku_Kiriko"
    ]
  },
  {
    name: "放課後クライマックスガールズ",
    member: [
      "Komiya_Kaho",
      "Sonoda_Chiyoko",
      "Saijo_Juri",
      "Morino_Rinze",
      "Arisugawa_Natsuha"
    ]
  },
  {
    name: "ALSTROEMERIA（あるすとろめりあ）",
    member: ["Osaki_Amana", "Osaki_Tenka", "Kuwayama_Chiyuki"]
  },
  {
    name: "Straylight（すとれいらいと）",
    member: ["Serizawa_Asahi", "Mayuzumi_Fuyuko", "Izumi_Mei"]
  },
  {
    name: "noctchill（のくちる）",
    member: [
      "Asakura_Toru",
      "Higuchi_Madoka",
      "Fukumaru_Koito",
      "Ichikawa_Hinana"
    ]
  },
  {
    name: "SHHis（しーず）",
    member: ["Nanakusa_Nichika", "Aketa_Mikoto"]
  }
];

/**
 * ブランド名を検索しやすい名称に変換
 * @param idol アイドルリソース名
 * @param brand ブランド名
 * @returns 変換後のブランド名
 */
export function convertBrandName(idol: string, brand: string): string {
  if (["Ryoo_Haena", "Juney", "Im_Yujin"].includes(idol)) {
    return "韓国版モバマス";
  }

  return brands.get(brand) || brand;
}

/**
 * 所属している主要ユニット名を取得
 * @param idol アイドルリソース名
 * @returns ユニット名
 */
export function getUnitName(idol: string): string | undefined {
  return units.find(({ member }) => member.includes(idol))?.name;
}

/**
 * ユニット順ベースでソート
 * @param items アイテム
 * @returns ソート済みアイテム
 */
export function sortByUnit(items: QuickPickItem[]): QuickPickItem[] {
  const result = [] as QuickPickItem[];
  const sortList = units.map((e) => e.member).flat();

  brands.forEach((brand) => {
    const brandItems = items.filter((e) => e.detail?.includes(brand));

    // SideM・シャニ以外はソートしない
    if (!["SideM", "シャイニーカラーズ"].includes(brand)) {
      result.push(...brandItems);
      return;
    }

    const sorted = brandItems.sort(
      (a, b) => sortList.indexOf(a.label) - sortList.indexOf(b.label)
    );

    result.push(...sorted);
  });

  return result;
}
