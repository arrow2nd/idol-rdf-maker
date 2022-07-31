import * as vscode from 'vscode'

import { insertEditor } from '../libs/editor'
import { fixedEncodeURIComponent } from '../libs/encode'
import {
  commonQuickPickOptions,
  getLabels,
  manyQuickPickPlaceHolder,
  showInputBox
} from '../libs/input'
import { buildXML } from '../libs/xml'

import { idolQuickPickItems } from '../data/idols'

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
 * 衣装情報の XML オブジェクトを作成
 * @param clothes 衣装情報
 * @returns XML オブジェクト
 */
function createClothesXMLObject(clothes: Clothes): any {
  const { name, desc, idols, resource } = clothes

  return {
    '@_rdf:about': resource,
    'schema:name': {
      '@_xml:lang': 'ja',
      '#text': name
    },
    'rdfs:label': {
      '@_rdf:datatype': 'http://www.w3.org/2001/XMLSchema#string',
      '#text': name
    },
    'schema:description': {
      '@_xml:lang': 'ja',
      '#text': desc
    },
    'imas:Whose': idols.map((e) => ({ '@_rdf:resource': e })),
    'rdf:type': {
      '@_rdf:resource':
        'https://sparql.crssnky.xyz/imasrdf/URIs/imas-schema.ttl#Clothes'
    }
  }
}

/**
 * 衣装の RDF データを作成
 * @param clothes 衣装情報
 * @param type 作成する衣装データの種類
 * @returns RDF データ
 */
function createClothesRDF(clothes: Clothes, type: CreateClothesType): string {
  let clothesData = []

  switch (type) {
    // アイドル毎に衣装データを作成
    case 'forEachIdol':
      clothesData = clothes.idols.map((idol) =>
        createClothesXMLObject({
          ...clothes,
          resource: `${clothes.resource}_${idol.replace(/_/g, '')}`,
          idols: [idol]
        })
      )
      break

    // アナザー衣装も合わせて作成 (TheaterDays)
    case 'normalAndAnother':
      clothesData = [
        createClothesXMLObject(clothes),
        createClothesXMLObject({
          ...clothes,
          resource: clothes.resource + '%2B',
          name: clothes.name + '+',
          desc: `「${clothes.name}」のアナザー衣装です。`
        })
      ]
      break

    default:
      clothesData = [createClothesXMLObject(clothes)]
  }

  return buildXML({
    'rdf:Description': clothesData
  })
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
    placeHolder: manyQuickPickPlaceHolder,
    canPickMany: true
  })
  if (typeof idols === 'undefined') return

  return {
    resource: fixedEncodeURIComponent(resource),
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
