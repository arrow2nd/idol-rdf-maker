import * as vscode from 'vscode'

import { liveTypeQuickPickItems } from '../data/live'
import { insertEditor } from '../libs/editor'
import { escapeHTML } from '../libs/escape'
import { showInputBox, showQuickPickData } from '../libs/input'

/** ライブ情報 */
type Live = {
  title: string
  location: string
  date: string
  url: string
  actors: string[]
  attendanceMode?: string
}

/**
 * ライブ情報を RDF データに変換
 * @param live ライブ情報
 * @returns RDF データ
 */
function convert2LiveRDF(live: Live): string {
  const { date, url, actors } = live

  const resource = encodeURIComponent(live.title)
  const title = escapeHTML(live.title)
  const location = escapeHTML(live.location)

  const attendanceMode = live.attendanceMode
    ? `\n  <schema:eventAttendanceMode rdf:resource="http://schema.org/${live.attendanceMode}" />`
    : ''

  const schemaActors = actors
    .map((e) => `<schema:actor xml:lang="ja">${e}</schema:actor>`)
    .join('\n  ')

  return `<rdf:Description rdf:about="${resource}">
  ${schemaActors}
  <schema:eventStatus rdf:resource="http://schema.org/EventScheduled" />${attendanceMode}
  <schema:name rdf:datatype="http://www.w3.org/2001/XMLSchema#string">${title}</schema:name>
  <rdfs:label rdf:datatype="http://www.w3.org/2001/XMLSchema#string">${title}</rdfs:label>
  <schema:location rdf:datatype="http://www.w3.org/2001/XMLSchema#string">${location}</schema:location>
  <schema:startDate rdf:datatype="http://www.w3.org/2001/XMLSchema#date">${date}</schema:startDate>
  <schema:endDate rdf:datatype="http://www.w3.org/2001/XMLSchema#date">${date}</schema:endDate>
  <schema:url rdf:resource="${url}"/>
  <rdf:type rdf:resource="https://sparql.crssnky.xyz/imasrdf/URIs/imas-schema.ttl#Live"/>
</rdf:Description>`
}

/**
 * ライブ情報の入力を受付
 * @returns ライブ情報
 */
async function inputLiveInfo(): Promise<Live | undefined> {
  // 名前
  const title = await showInputBox({
    title:
      'ライブ・イベント名を入力 (rdf:Description / schema:name / rdfs:label)'
  })
  if (typeof title === 'undefined') return

  // 会場
  const location = await showInputBox({
    title: '会場を入力 (schema:location)'
  })
  if (typeof location === 'undefined') return

  // 日時
  const date = await showInputBox({
    title: '開催日時を入力 (schema:startDate / schema:endDate)',
    validateInput: (value) =>
      /^\d{4}-\d{2}-\d{2}$/.test(value)
        ? undefined
        : 'YYYY-MM-DDの形式で入力してください'
  })
  if (typeof date === 'undefined') return

  // URL
  const url = await showInputBox({
    title: '特設ページのURLを入力 (schema:url)',
    validateInput: (value) =>
      /^https?:\/\//.test(value) ? undefined : '有効なURL形式ではありません'
  })
  if (typeof url === 'undefined') return

  // 開催形式
  const liveType = await vscode.window.showQuickPick(liveTypeQuickPickItems, {
    title: '開催形式を選択'
  })
  const attendanceMode =
    liveType?.label === 'none' ? undefined : liveType?.label

  // 出演者
  const actors = await showQuickPickData('声優', '出演者を選択')
  if (typeof actors === 'undefined') return

  return {
    title,
    location,
    date,
    url,
    actors,
    attendanceMode
  }
}

/**
 * ライブデータを作成
 * @param editor TextEditor
 */
export async function createLiveData(editor: vscode.TextEditor) {
  const liveInfo = await inputLiveInfo()
  if (!liveInfo) return

  const rdf = convert2LiveRDF(liveInfo)

  await insertEditor(editor, rdf)
}
