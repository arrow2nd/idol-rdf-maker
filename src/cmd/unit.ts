import * as vscode from 'vscode'

import { insertEditor } from '../libs/editor'
import { escapeHTML } from '../libs/escape'
import {
  commonQuickPickOptions,
  getLabels,
  manyQuickPickPlaceHolder,
  showInputBox
} from '../libs/input'
import { validateHexColor } from '../libs/validate'
import { buildXML } from '../libs/xml'

import { idolQuickPickItems } from '../data/idols'

/** ユニット情報 */
type Unit = {
  name: string
  nameKana: string
  color: string
  desc: string
  idols: string[]
}

/**
 * ユニット情報の RDF データを作成
 * @param unit ユニット情報
 * @returns RDF データ
 */
function createUnitRDF(unit: Unit) {
  const { nameKana, idols, color } = unit

  const resource = encodeURIComponent(unit.name)
  const name = escapeHTML(unit.name)
  const desc = escapeHTML(unit.desc)

  const unitData = {
    'rdf:Description': {
      '@_rdf:about': resource,
      'schema:name': {
        '@_rdf:datatype': 'http://www.w3.org/2001/XMLSchema#string',
        '#text': name
      },
      'rdfs:label': {
        '@_rdf:datatype': 'http://www.w3.org/2001/XMLSchema#string',
        '#text': name
      },
      'imas:nameKana': {
        '@_xml:lang': 'ja',
        '#text': nameKana
      },
      'schema:member': idols.map((e) => ({ '@_rdf:resource': e })),
      'imas:Color': {
        '@_rdf:datatype': 'http://www.w3.org/2001/XMLSchema#hexBinary',
        '#text': color
      },
      'schema:description': {
        '@_xml:lang': 'ja',
        '#text': desc
      },
      'rdf:type': {
        '@_rdf:resource':
          'https://sparql.crssnky.xyz/imasrdf/URIs/imas-schema.ttl#Unit'
      }
    }
  }

  return buildXML(unitData)
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
    validateInput: validateHexColor
  })
  if (typeof color === 'undefined') return

  // 衣装説明
  const desc = await showInputBox({
    title: '衣装説明を入力 (schema:description)'
  })
  if (typeof desc === 'undefined') return

  // 所属アイドル
  const idols = await vscode.window.showQuickPick(idolQuickPickItems, {
    ...commonQuickPickOptions,
    title: '所属アイドルを選択 (schema:member)',
    placeHolder: manyQuickPickPlaceHolder,
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

  const rdf = createUnitRDF(unitInfo)

  await insertEditor(editor, rdf)
}
