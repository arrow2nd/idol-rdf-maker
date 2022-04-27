import * as vscode from 'vscode'

import { insertEditor } from '../libs/editor'
import { showQuickPickIdols } from '../libs/pick'

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
 * @param ユニット情報
 * @returns RDFデータ
 */
const convert2unitRDF = ({
  name,
  nameKana,
  color,
  desc,
  idols
}: Unit) => `<rdf:Description rdf:about="${encodeURIComponent(name)}">
  <schema:name rdf:datatype="http://www.w3.org/2001/XMLSchema#string">${name}</schema:name>
  <rdfs:label rdf:datatype="http://www.w3.org/2001/XMLSchema#string">${name}</rdfs:label>
  <imas:nameKana xml:lang="ja">${nameKana}</imas:nameKana>
  ${idols.map((idol) => `<schema:member rdf:resource="${idol}"/>`).join('\n  ')}
  <imas:Color rdf:datatype="http://www.w3.org/2001/XMLSchema#hexBinary">${color}</imas:Color>
  <schema:description xml:lang="ja">${desc}</schema:description>
  <rdf:type rdf:resource="https://sparql.crssnky.xyz/imasrdf/URIs/imas-schema.ttl#Unit"/>
</rdf:Description>`

/**
 * ユニット情報の入力を受付
 * @returns ユニット情報
 */
async function inputUnitInfo(): Promise<Unit | undefined> {
  // ユニット名
  const name = await vscode.window.showInputBox({
    title: 'ユニット名を入力 (rdf:Description / schema:name / rdfs:label)'
  })
  if (typeof name === 'undefined') return

  // 読み仮名
  const nameKana = await vscode.window.showInputBox({
    title: '読み仮名を入力 (imas:nameKana)'
  })
  if (typeof nameKana === 'undefined') return

  // カラーコード
  const color = await vscode.window.showInputBox({
    title: 'イメージカラーのカラーコード (imas:Color)',
    validateInput: (value) =>
      value === '' || /^[A-Fa-f0-9]{6}$/.test(value)
        ? undefined
        : '6ケタの16進数カラーコードを入力してください'
  })
  if (typeof color === 'undefined') return

  // 衣装説明
  const desc = await vscode.window.showInputBox({
    title: '衣装説明を入力 (schema:description)'
  })
  if (typeof desc === 'undefined') return

  // アイドルを選択
  const idols = await showQuickPickIdols()
  if (typeof idols === 'undefined') return

  return {
    name,
    nameKana,
    color: color.toUpperCase(),
    desc,
    idols
  }
}

/**
 * ユニットデータを作成
 * @param editor TextEditor
 */
export async function createUnitData(editor: vscode.TextEditor) {
  // 衣装情報
  const unitInfo = await inputUnitInfo()
  if (!unitInfo) return

  // RDFデータを作成
  const rdf = convert2unitRDF(unitInfo)

  // エディタに挿入
  await insertEditor(editor, rdf)
}
