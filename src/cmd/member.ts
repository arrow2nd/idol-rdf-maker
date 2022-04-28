import * as vscode from 'vscode'

import { idolQuickPickItems } from '../data/idols'
import { insertEditor } from '../libs/editor'
import { commonQuickPickOptions } from '../libs/input'

/** 語彙の種類 */
type CreateMemberType = 'imas:Whose' | 'schema:member'

/**
 * imas:Whose / schema:member を作成
 * @param editor TextEditor
 * @param type 作成する語彙の種類
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

  const rdfs = idols
    .map(({ label }) => `<${type} rdf:resource="${label}"/>`)
    .join('\n')

  await insertEditor(editor, rdfs)
}
