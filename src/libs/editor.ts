import type { TextEditor } from "vscode";

/**
 * テキストをエディタに挿入
 * @param editor TextEditor
 * @param text テキスト
 */
export async function insertEditor(editor: TextEditor, text: string) {
  const cursorPos = editor.selection.active;
  const lineText = editor.document.lineAt(cursorPos.line).text;

  // 挿入する行を見て、インデントを合わせる
  if (/^\s+$/.test(lineText)) {
    text = text.replace(/\n/g, `\n${lineText}`);
  }

  await editor.edit((editBuilder) => editBuilder.insert(cursorPos, text));
}
