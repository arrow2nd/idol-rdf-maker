import * as vscode from 'vscode'

import { createClothesData } from './cmd/clothes'
import { createMemberData } from './cmd/member'

export function activate(context: vscode.ExtensionContext) {
  const disposables: vscode.Disposable[] = [
    // clothes
    vscode.commands.registerTextEditorCommand(
      'idol-rdf-maker.createClothes',
      (textEditor) => createClothesData(textEditor, 'default')
    ),
    vscode.commands.registerTextEditorCommand(
      'idol-rdf-maker.createClothesForEachIdol',
      (textEditor) => createClothesData(textEditor, 'forEachIdol')
    ),
    vscode.commands.registerTextEditorCommand(
      'idol-rdf-maker.createClothesNormalAndAnother',
      (textEditor) => createClothesData(textEditor, 'normalAndAnother')
    ),
    // member
    vscode.commands.registerTextEditorCommand(
      'idol-rdf-maker.createImasWhose',
      (textEditor) => createMemberData(textEditor, 'imas:Whose')
    ),
    vscode.commands.registerTextEditorCommand(
      'idol-rdf-maker.createSchemaMember',
      (textEditor) => createMemberData(textEditor, 'schema:member')
    )
  ]

  context.subscriptions.push(...disposables)
}

export function deactivate() {}
