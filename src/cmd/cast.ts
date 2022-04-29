import * as vscode from 'vscode'

import { insertEditor } from '../libs/editor'
import { commonQuickPickOptions, manyQuickPickPlaceHolder } from '../libs/input'
import { buildXML } from '../libs/xml'

import { castQuickPickItems } from '../data/casts'

/** 語彙の種類 */
type CreateCastType = 'schema:actor' | 'imas:cv'

/**
 * schema:actor / imas:cv を作成
 * @param editor TextEditor
 * @param type 作成するデータの語彙
 * @returns RDF データ
 */
export async function createCastData(
  editor: vscode.TextEditor,
  type: CreateCastType
) {
  const actors = await vscode.window.showQuickPick(castQuickPickItems, {
    ...commonQuickPickOptions,
    title: `声優を選択 (${type})`,
    placeHolder: manyQuickPickPlaceHolder,
    canPickMany: true
  })
  if (!actors) return

  const idolsData = {
    [type]: actors.map(({ label }) => ({ '@_xml:lang': 'ja', '#text': label }))
  }

  await insertEditor(editor, buildXML(idolsData))
}
