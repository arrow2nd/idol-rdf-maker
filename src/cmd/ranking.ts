import { indicator } from 'ordinal'
import * as vscode from 'vscode'

import { idolQuickPickItems } from '../data/idols'
import { rankingTypeQuickPickItems } from '../data/ranking'
import { insertEditor } from '../libs/editor'
import { commonQuickPickOptions, showInputBox } from '../libs/input'
import { validateNumber } from '../libs/validate'

/** ランキング情報 */
type Ranking = {
  number: string
  rank: string
  voteNumber: string
  idol: string
  type?: string
}

/**
 * ランキング情報を RDF データに変換
 * @param ranking ランキング情報
 * @returns RDF データ
 */
function convert2RankingRDF(ranking: Ranking) {
  const { idol, voteNumber } = ranking

  const number = ranking.number + indicator(parseInt(ranking.number))
  const type = ranking.type === 'CinderellaGirls' ? '' : `_${ranking.type}`
  const rank = ranking.rank.padStart(2, '0')

  const imasVoteNumber =
    voteNumber &&
    `\n  <imas:VoteNumber rdf:datatype="http://www.w3.org/2001/XMLSchema#integer">${voteNumber}</imas:VoteNumber>`

  return `<rdf:Description rdf:about="${number}${type}_${rank}">
  <schema:member rdf:resource="${idol}"/>${imasVoteNumber}
  <rdf:type rdf:resource="https://sparql.crssnky.xyz/imasrdf/URIs/imas-schema.ttl#CinderellaRankingResult"/>
</rdf:Description>`
}

/**
 * ランキング情報の入力を受付
 * @param rank 順位
 * @returns ランキング情報
 */
async function inputRankingInfo(rank: string): Promise<Ranking | undefined> {
  // 票数
  const voteNumber = await showInputBox({
    title: `第 ${rank} 位の票数を入力 (imas:VoteNumber)`
  })
  if (typeof voteNumber === 'undefined') return

  // アイドル
  const idol = await vscode.window.showQuickPick(idolQuickPickItems, {
    ...commonQuickPickOptions,
    title: `第 ${rank} 位のアイドルを選択 (schema:member)`
  })
  if (typeof idol === 'undefined') return

  return {
    number: '',
    rank,
    voteNumber,
    idol: idol.label
  }
}

/**
 * ランキングデータを作成
 * @param editor TextEditor
 */
export async function createRankingData(editor: vscode.TextEditor) {
  // 開催数
  const number = await showInputBox({
    title: '開催数を入力 (第 n 回)',
    validateInput: validateNumber
  })
  if (typeof number === 'undefined') return

  // 順位
  const baseRankStr = await showInputBox({
    title: '順位の開始値を入力',
    value: '1',
    validateInput: validateNumber
  })
  if (typeof baseRankStr === 'undefined') return

  // ランキングの種類
  const type = await vscode.window.showQuickPick(rankingTypeQuickPickItems, {
    ...commonQuickPickOptions,
    title: 'ランキングの種類を選択'
  })

  const baseRank = parseInt(baseRankStr)

  for (let rank = baseRank; rank <= 50; rank++) {
    const rankingInfo = await inputRankingInfo(rank.toString())
    if (!rankingInfo) return

    const rdf = convert2RankingRDF({
      ...rankingInfo,
      number,
      type: type?.label
    })

    await insertEditor(editor, rdf + '\n')
  }
}
