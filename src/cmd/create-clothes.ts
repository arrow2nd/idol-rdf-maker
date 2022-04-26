import * as vscode from 'vscode'

import { showResourceNameInputBox } from '../libs/input'
import { showQuickPickIdols } from '../libs/pick'

/**
 * 衣装の RDF データを作成
 * @param resource リソース名
 * @param name 衣装名
 * @param desc 衣装説明
 * @param idols 所有アイドルの配列
 * @returns RDF
 */
const createClothesRDF = (
  resource: string,
  name: string,
  desc: string,
  idols: string[]
): string => `<rdf:Description rdf:about="${resource}">
  <schema:name xml:lang="ja">${name}</schema:name>
  <rdfs:label rdf:datatype="http://www.w3.org/2001/XMLSchema#string">${name}</rdfs:label>
  ${idols.map((e) => `<imas:Whose rdf:resource="${e}"/>`).join('\n  ')}
  <schema:description xml:lang="ja">${desc}</schema:description>
  <rdf:type rdf:resource="https://sparql.crssnky.xyz/imasrdf/URIs/imas-schema.ttl#Clothes"/>
</rdf:Description>`

/**
 * 衣装データを作成
 * @param textEdit TextEditor
 */
export async function createClothes(textEdit: vscode.TextEditor) {
  // リソース名
  const resourceName = await showResourceNameInputBox()
  if (typeof resourceName === 'undefined') return

  // 衣装名
  const clothesName = await vscode.window.showInputBox({
    title: '衣装名を入力 (schema:name)'
  })
  if (typeof clothesName === 'undefined') return

  // 衣装説明
  const clothesDesc = await vscode.window.showInputBox({
    title: '衣装説明を入力 (schema:description)'
  })
  if (typeof clothesDesc === 'undefined') return

  // アイドルを選択
  const idols = await showQuickPickIdols()
  if (typeof idols === 'undefined') return

  // RDFを作成
  const rdf = createClothesRDF(resourceName, clothesName, clothesDesc, idols)

  // エディタへ挿入
  const cursorPos = textEdit.selection.active
  await textEdit.edit((editBuilder) => editBuilder.insert(cursorPos, rdf))
}
