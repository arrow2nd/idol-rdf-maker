import * as vscode from 'vscode'

import { idolQuickPickItems } from '../data/idols'
import { insertEditor } from '../libs/editor'
import { escapeHTML } from '../libs/escape'
import { commonQuickPickOptions, getLabels, showInputBox } from '../libs/input'

/** ユニット情報 */
type Unit = {
  name: string
  nameKana: string
  color: string
  desc: string
  idols: string[]
}

/**
 * 衣装情報を RDF データに変換
 * @param unit ユニット情報
 * @returns RDF データ
 */
function convert2UnitRDF(unit: Unit) {
  const { nameKana, idols, color } = unit

  const resouce = encodeURIComponent(unit.name)
  const name = escapeHTML(unit.name)
  const desc = escapeHTML(unit.desc)

  return `<rdf:Description rdf:about="${resouce}">
  <schema:name rdf:datatype="http://www.w3.org/2001/XMLSchema#string">${name}</schema:name>
  <rdfs:label rdf:datatype="http://www.w3.org/2001/XMLSchema#string">${name}</rdfs:label>
  <imas:nameKana xml:lang="ja">${nameKana}</imas:nameKana>
  ${idols.map((idol) => `<schema:member rdf:resource="${idol}"/>`).join('\n  ')}
  <imas:Color rdf:datatype="http://www.w3.org/2001/XMLSchema#hexBinary">${color}</imas:Color>
  <schema:description xml:lang="ja">${desc}</schema:description>
  <rdf:type rdf:resource="https://sparql.crssnky.xyz/imasrdf/URIs/imas-schema.ttl#Unit"/>
</rdf:Description>`
}

/**
 * ユニット情報の入力を受付
 * @returns ユニット情報
 */
async function inputUnitInfo(): Promise<Unit | undefined> {
  // ユニット名
  const name = await showInputBox({
    title: 'ユニット名を入力 (rdf:Description / schema:name / rdfs:label)'
  })
  if (typeof name === 'undefined') return

  // 読み仮名
  const nameKana = await showInputBox({
    title: '読み仮名を入力 (imas:nameKana)'
  })
  if (typeof nameKana === 'undefined') return

  // カラーコード
  const color = await showInputBox({
    title: 'イメージカラーのカラーコード (imas:Color)',
    validateInput: (value) =>
      value === '' || /^[A-Fa-f0-9]{6}$/.test(value)
        ? undefined
        : '6ケタの16進数カラーコードを入力してください'
  })
  if (typeof color === 'undefined') return

  // 衣装説明
  const desc = await showInputBox({
    title: '衣装説明を入力 (schema:description)'
  })
  if (typeof desc === 'undefined') return

  // アイドルを選択
  const idols = await vscode.window.showQuickPick(idolQuickPickItems, {
    ...commonQuickPickOptions,
    title: '所属アイドルを選択 (schema:member)',
    canPickMany: true
  })
  if (typeof idols === 'undefined') return

  return {
    name,
    nameKana,
    color: color.toUpperCase(),
    desc,
    idols: getLabels(idols)
  }
}

/**
 * ユニットデータを作成
 * @param editor TextEditor
 */
export async function createUnitData(editor: vscode.TextEditor) {
  const unitInfo = await inputUnitInfo()
  if (!unitInfo) return

  const rdf = convert2UnitRDF(unitInfo)

  await insertEditor(editor, rdf)
}
