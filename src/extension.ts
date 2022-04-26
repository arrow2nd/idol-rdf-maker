import * as vscode from 'vscode'

import { createClothes } from './cmd/create-clothes'

export function activate(context: vscode.ExtensionContext) {
  const disposables: vscode.Disposable[] = [
    vscode.commands.registerTextEditorCommand(
      'idol-rdf-maker.createClothes',
      createClothes
    )
  ]

  context.subscriptions.push(...disposables)
}

export function deactivate() {}
