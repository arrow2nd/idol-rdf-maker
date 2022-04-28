import * as vscode from 'vscode'

import { idolQuickPickItems } from '../data/idols'
import { insertEditor } from '../libs/editor'
import { escapeHTML } from '../libs/escape'
import { commonQuickPickOptions, getLabels, showInputBox } from '../libs/input'

/** 衣装情報 */
type Clothes = {
  resource: string
  name: string
  desc: string
  idols: string[]
}

/** 作成する衣装データの種類 */
type CreateClothesType = 'default' | 'forEachIdol' | 'normalAndAnother'

/**
 * 衣装情報を RDF データに変換
 * @param clothes 衣装情報
 * @returns RDF データ
 */
function convert2ClothesRDF(clothes: Clothes): string {
  const { idols } = clothes

  const resource = encodeURIComponent(clothes.resource)
  const name = escapeHTML(clothes.name)
  const desc = escapeHTML(clothes.desc)

  return `<rdf:Description rdf:about="${resource}">
  <schema:name xml:lang="ja">${name}</schema:name>
  <rdfs:label rdf:datatype="http://www.w3.org/2001/XMLSchema#string">${name}</rdfs:label>
  <schema:description xml:lang="ja">${desc}</schema:description>
  ${idols.map((e) => `<imas:Whose rdf:resource="${e}"/>`).join('\n  ')}
  <rdf:type rdf:resource="https://sparql.crssnky.xyz/imasrdf/URIs/imas-schema.ttl#Clothes"/>
</rdf:Description>`
}

/**
 * 衣装の RDF データを作成
 * @param clothes 衣装情報
 * @param type 作成する衣装データの種類
 * @returns RDF データ
 */
function createClothesRDF(clothes: Clothes, type: CreateClothesType): string {
  switch (type) {
    // アイドル毎に衣装データを作成
    case 'forEachIdol':
      return clothes.idols
        .map((idol) =>
          convert2ClothesRDF({
            ...clothes,
            resource: `${clothes.resource}_${idol.replace(/_/g, '')}`,
            idols: [idol]
          })
        )
        .join('\n')

    // アナザー衣装も合わせて作成 (TheaterDays)
    case 'normalAndAnother':
      return [
        convert2ClothesRDF(clothes),
        convert2ClothesRDF({
          ...clothes,
          resource: clothes.resource + '%2B',
          name: clothes.name + '+',
          desc: `「${clothes.name}」のアナザー衣装です。`
        })
      ].join('\n')

    default:
      return convert2ClothesRDF(clothes)
  }
}

/**
 * 衣装情報の入力を受付
 * @returns 衣装情報
 */
async function inputClothesInfo(): Promise<Clothes | undefined> {
  // リソース名
  const resource = await showInputBox({
    title: 'リソース名を入力 (rdf:Description)'
  })
  if (typeof resource === 'undefined') return

  // 衣装名
  const name = await showInputBox({
    title: '衣装名を入力 (schema:name)'
  })
  if (typeof name === 'undefined') return

  // 衣装説明
  const desc = await showInputBox({
    title: '衣装説明を入力 (schema:description)'
  })
  if (typeof desc === 'undefined') return

  // アイドルを選択
  const idols = await vscode.window.showQuickPick(idolQuickPickItems, {
    ...commonQuickPickOptions,
    title: '所有アイドルを選択 (imas:Whose)',
    canPickMany: true
  })
  if (typeof idols === 'undefined') return

  return {
    resource,
    name,
    desc,
    idols: getLabels(idols)
  }
}

/**
 * 衣装データを作成
 * @param editor TextEditor
 * @param type 作成する衣装データの種類
 */
export async function createClothesData(
  editor: vscode.TextEditor,
  type: CreateClothesType
) {
  const clothesInfo = await inputClothesInfo()
  if (!clothesInfo) return

  const rdf = createClothesRDF(clothesInfo, type)

  await insertEditor(editor, rdf)
}
