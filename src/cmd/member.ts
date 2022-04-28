import * as vscode from 'vscode'

import { insertEditor } from '../libs/editor'
import { showQuickPickIdols } from '../libs/input'

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
  const idols = await showQuickPickIdols()
  if (!idols) return

  const rdfs = idols
    .map((idol) => `<${type} rdf:resource="${idol}"/>`)
    .join('\n')

  await insertEditor(editor, rdfs)
}
