import * as vscode from 'vscode'

import { castQuickPickItems } from '../data/casts'
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

/** QuickPick で表示するデータの種類 */
type QuickPickDataType = 'アイドル' | '声優'

/**
 * 指定したデータの QuickPick を表示
 * @param type 表示するデータの種類
 * @param title タイトル
 * @returns アイドルのリソース名 (配列)
 */
export async function showQuickPickData(
  type: QuickPickDataType,
  title?: string
): Promise<string[] | undefined> {
  const items = type === '声優' ? castQuickPickItems : idolQuickPickItems

  const results = await vscode.window.showQuickPick(items, {
    title: title || `${type}を選択`,
    ...commonQuickPickOptions,
    canPickMany: true
  })

  return results?.map(({ label }) => label)
}
