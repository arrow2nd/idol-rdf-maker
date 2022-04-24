import * as vscode from 'vscode'

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    'idol-rdf-maker.helloWorld',
    () => {
      vscode.window.showInformationMessage('Hello World from idol-rdf-maker!')
    }
  )

  context.subscriptions.push(disposable)
}

export function deactivate() {}
