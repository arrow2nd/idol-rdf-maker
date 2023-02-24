import { indicator } from "ordinal";
import * as vscode from "vscode";

import { insertEditor } from "../libs/editor";
import { commonQuickPickOptions, showInputBox } from "../libs/input";
import { validateNumber } from "../libs/validate";
import { buildXML } from "../libs/xml";

import { idolQuickPickItems } from "../data/idols";
import { rankingTypeQuickPickItems } from "../data/ranking";

/** ランキング情報 */
type Ranking = {
  type: string;
  times: string;
  rank: string;
  idol: string;
  voteNumber?: string;
};

/**
 * ランキング情報の RDF データを作成
 * @param ranking ランキング情報
 * @returns RDF データ
 */
function createRankingRDF(ranking: Ranking): string {
  const { idol, voteNumber } = ranking;

  const number = ranking.times + indicator(parseInt(ranking.times));
  const type = ranking.type === "CinderellaGirls" ? "" : `_${ranking.type}`;
  const rank = ranking.rank.padStart(2, "0");

  const imasVoteNumber =
    voteNumber === ""
      ? undefined
      : {
          "imas:VoteNumber": {
            "@_rdf:datatype": "http://www.w3.org/2001/XMLSchema#integer",
            "#text": voteNumber
          }
        };

  const rankingData = {
    "rdf:Description": {
      "@_rdf:about": `${number}${type}_${rank}`,
      "schema:member": {
        "@_rdf:resource": idol
      },
      ...imasVoteNumber,
      "rdf:type": {
        "@_rdf:resource":
          "https://sparql.crssnky.xyz/imasrdf/URIs/imas-schema.ttl#CinderellaRankingResult"
      }
    }
  };

  return buildXML(rankingData);
}

/** 基本情報 */
type BasicInfo = {
  type: string;
  times: string;
  baseRank: string;
};

/**
 * ランキングの基本情報を入力
 * @returns ランキング情報
 */
async function inputBasicInfo(): Promise<BasicInfo | undefined> {
  // ランキングの種類
  const type = await vscode.window.showQuickPick(rankingTypeQuickPickItems, {
    ...commonQuickPickOptions,
    title: "ランキングの種類を選択"
  });
  if (typeof type === "undefined") return;

  // 開催数
  const times = await showInputBox({
    title: "開催数を入力 (第 n 回)",
    validateInput: validateNumber
  });
  if (typeof times === "undefined") return;

  // 順位
  const baseRank = await showInputBox({
    title: "順位の開始値を入力",
    value: "1",
    validateInput: validateNumber
  });
  if (typeof baseRank === "undefined") return;

  return {
    type: type.label,
    times,
    baseRank
  };
}

/**
 * アイドルの順位情報を入力
 * @param rank 順位
 * @returns 順位情報
 */
async function inputIdolRankInfo(rank: string): Promise<Ranking | undefined> {
  // アイドル
  const idol = await vscode.window.showQuickPick(idolQuickPickItems, {
    ...commonQuickPickOptions,
    title: `第 ${rank} 位のアイドルを選択 (schema:member)`
  });
  if (typeof idol === "undefined") return;

  // 票数
  const voteNumber = await showInputBox({
    title: `第 ${rank} 位の票数を入力 (imas:VoteNumber)`
  });
  if (typeof voteNumber === "undefined") return;

  return {
    type: "",
    times: "",
    rank,
    idol: idol.label,
    voteNumber
  };
}

/**
 * ランキングデータを作成
 * @param editor TextEditor
 */
export async function createRankingData(editor: vscode.TextEditor) {
  // ランキングの基本情報
  const basicInfo = await inputBasicInfo();
  if (typeof basicInfo === "undefined") return;

  // アイドルの順位情報
  for (let rank = parseInt(basicInfo.baseRank); rank <= 50; rank++) {
    const rankingInfo = await inputIdolRankInfo(rank.toString());
    if (!rankingInfo) return;

    const rdf = createRankingRDF({
      ...rankingInfo,
      type: basicInfo.type,
      times: basicInfo.times
    });

    await insertEditor(editor, rdf);
  }
}
