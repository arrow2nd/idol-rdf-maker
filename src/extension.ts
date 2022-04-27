import * as vscode from 'vscode'

import { createClothesData } from './cmd/clothes'
import { createMemberData } from './cmd/member'

export function activate(context: vscode.ExtensionContext) {
  const disposables: vscode.Disposable[] = [
    // clothes
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
