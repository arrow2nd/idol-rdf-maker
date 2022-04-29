import * as vscode from 'vscode'

import { insertEditor } from '../libs/editor'
import { commonQuickPickOptions } from '../libs/input'
import { buildXML } from '../libs/xml'

import { idolQuickPickItems } from '../data/idols'

/** 語彙の種類 */
type CreateMemberType = 'imas:Whose' | 'schema:member'

/**
 * imas:Whose / schema:member を作成
 * @param editor TextEditor
 * @param type 作成するデータの語彙
 * @returns RDF データ
 */
export async function createMemberData(
  editor: vscode.TextEditor,
  type: CreateMemberType
) {
  const idols = await vscode.window.showQuickPick(idolQuickPickItems, {
    ...commonQuickPickOptions,
    title: `アイドルを選択 (${type})`,
    canPickMany: true
  })
  if (!idols) return

  const idolsData = {
    [type]: idols.map(({ label }) => ({ '@_rdf:resource': label }))
  }

  await insertEditor(editor, buildXML(idolsData))
}
