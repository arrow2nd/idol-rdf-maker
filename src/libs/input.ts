import * as vscode from 'vscode'

import { idolQuickPickItems } from '../data/idols'

/** QuickPick の共通設定 */
export const commonQuickPickOptions: vscode.QuickPickOptions = {
  matchOnDescription: true,
  matchOnDetail: true,
  ignoreFocusOut: true
}

/**
 * InputBox を表示
 * @param options オプション
 * @returns 入力結果
 */
export function showInputBox(
  options?: vscode.InputBoxOptions
): Thenable<string | undefined> {
  return vscode.window.showInputBox({
    ...options,
    ignoreFocusOut: true
  })
}

/**
 * アイドル名の QuickPick を表示
 * @returns アイドルのリソース名 (配列)
 */
export async function showQuickPickIdols(): Promise<string[] | undefined> {
  const results = await vscode.window.showQuickPick(idolQuickPickItems, {
    title: 'アイドルを選択',
    ...commonQuickPickOptions,
    canPickMany: true
  })

  return results?.map(({ label }) => label)
}
