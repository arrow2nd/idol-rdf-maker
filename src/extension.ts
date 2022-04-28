import * as vscode from 'vscode'

import { createClothesData } from './cmd/clothes'
import { createLiveData } from './cmd/live'
import { createMemberData } from './cmd/member'
import { createRankingData } from './cmd/ranking'
import { createUnitData } from './cmd/unit'

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
    // unit
    vscode.commands.registerTextEditorCommand(
      'idol-rdf-maker.createUnit',
      (textEditor) => createUnitData(textEditor)
    ),
    // live
    vscode.commands.registerTextEditorCommand(
      'idol-rdf-maker.createLive',
      (textEditor) => createLiveData(textEditor)
    ),
    // ranking
    vscode.commands.registerTextEditorCommand(
      'idol-rdf-maker.createRanking',
      (textEditor) => createRankingData(textEditor)
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
