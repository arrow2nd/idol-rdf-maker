import * as vscode from 'vscode'

/**
 * リソース名の入力ボックスを表示
 * @returns リソース名 (URIエンコード済み)
 */
export async function showResourceNameInputBox(): Promise<string | undefined> {
  const resourceName = await vscode.window.showInputBox({
    title: 'リソース名を入力 (rdf:Description)'
  })

  return resourceName && encodeURIComponent(resourceName)
}
