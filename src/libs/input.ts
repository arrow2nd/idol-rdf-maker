import * as vscode from 'vscode'

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

/** QuickPick の共通設定 */
export const commonQuickPickOptions: vscode.QuickPickOptions = {
  matchOnDescription: true,
  matchOnDetail: true,
  ignoreFocusOut: true
}

/** 複数選択可能な QuickPick の共通プレースホルダ */
export const manyQuickPickPlaceHolder =
  'チェックボックスをクリック・Spaceキーで選択'

/**
 * ラベル文字列を取得
 * @param items 選択要素
 * @returns ラベル文字列の配列
 */
export function getLabels(items: vscode.QuickPickItem[]): string[] {
  return items.map(({ label }) => label)
}
