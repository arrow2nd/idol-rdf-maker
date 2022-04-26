import * as vscode from 'vscode'

import { createClothesData } from './cmd/clothes'

export function activate(context: vscode.ExtensionContext) {
  const disposables: vscode.Disposable[] = [
    vscode.commands.registerTextEditorCommand(
      'idol-rdf-maker.createClothes',
      (textEditor) => createClothesData(textEditor, 'commonResourceNames')
    ),
    vscode.commands.registerTextEditorCommand(
      'idol-rdf-maker.createClothesWithDiffResourceNames',
      (textEditor) => createClothesData(textEditor, 'diffResourceNames')
    ),
    vscode.commands.registerTextEditorCommand(
      'idol-rdf-maker.createClothesAndAnother',
      (textEditor) => createClothesData(textEditor, 'andAnother')
    )
  ]

  context.subscriptions.push(...disposables)
}

export function deactivate() {}
