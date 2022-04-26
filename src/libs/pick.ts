import * as vscode from 'vscode'

import { idolQuickPickItems } from '../data/idols'

/**
 * アイドルを選択
 * @returns アイドルのリソース名 (配列)
 */
export async function showQuickPickIdols(): Promise<string[] | undefined> {
  const results = await vscode.window.showQuickPick(idolQuickPickItems, {
    title: 'アイドルを選択',
    canPickMany: true,
    matchOnDescription: true,
    matchOnDetail: true
  })

  return results && results.map(({ label }) => label)
}
