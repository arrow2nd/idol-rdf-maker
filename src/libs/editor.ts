import type { TextEditor } from 'vscode'

/**
 * テキストをエディタに挿入
 * @param editor TextEditor
 * @param text テキスト
 */
export async function insertEditor(editor: TextEditor, text: string) {
  const cursorPos = editor.selection.active
  await editor.edit((editBuilder) => editBuilder.insert(cursorPos, text))
}
