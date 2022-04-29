import * as vscode from 'vscode'

import { insertEditor } from '../libs/editor'
import { escapeHTML } from '../libs/escape'
import {
  commonQuickPickOptions,
  getLabels,
  manyQuickPickPlaceHolder,
  showInputBox
} from '../libs/input'
import { validateDate, validateURL } from '../libs/validate'
import { buildXML } from '../libs/xml'

import { castQuickPickItems } from '../data/casts'
import { liveTypeQuickPickItems } from '../data/live'

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
 * ライブ情報の RDF データを作成
 * @param live ライブ情報
 * @returns RDF データ
 */
function createLiveRDF(live: Live): string {
  const { date, url, actors } = live

  const resource = encodeURIComponent(live.title)
  const title = escapeHTML(live.title)
  const location = escapeHTML(live.location)

  const attendanceMode = live.attendanceMode && {
    'schema:eventAttendanceMode': {
      '@_rdf:resource': `http://schema.org/${live.attendanceMode}`
    }
  }

  const liveData = {
    'rdf:Description': {
      '@_rdf:about': resource,
      'schema:actor': actors.map((e) => ({ '@_xml:lang': 'ja', '#text': e })),
      'schema:eventStatus': {
        '@_rdf:resource': 'http://schema.org/EventScheduled'
      },
      ...attendanceMode,
      'schema:name': {
        '@_rdf:datatype': 'http://www.w3.org/2001/XMLSchema#string',
        '#text': title
      },
      'schema:location': {
        '@_rdf:datatype': 'http://www.w3.org/2001/XMLSchema#string',
        '#text': location
      },
      'schema:startDate': {
        '@_rdf:datatype': 'http://www.w3.org/2001/XMLSchema#date',
        '#text': date
      },
      'schema:endDate': {
        '@_rdf:datatype': 'http://www.w3.org/2001/XMLSchema#date',
        '#text': date
      },
      'schema:url': {
        '@_rdf:resource': url
      },
      'rdf:type': {
        '@_rdf:resource':
          'https://sparql.crssnky.xyz/imasrdf/URIs/imas-schema.ttl#Live'
      }
    }
  }

  return buildXML(liveData)
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
    validateInput: validateDate
  })
  if (typeof date === 'undefined') return

  // URL
  const url = await showInputBox({
    title: '特設ページのURLを入力 (schema:url)',
    validateInput: validateURL
  })
  if (typeof url === 'undefined') return

  // 開催形式
  const type = await vscode.window.showQuickPick(liveTypeQuickPickItems, {
    title: '開催形式を選択 (schema:eventAttendanceMode)'
  })
  if (typeof type === 'undefined') return

  // 出演者
  const actors = await vscode.window.showQuickPick(castQuickPickItems, {
    ...commonQuickPickOptions,
    title: '出演者を選択 (schema:actor)',
    placeHolder: manyQuickPickPlaceHolder,
    canPickMany: true
  })
  if (typeof actors === 'undefined') return

  return {
    title,
    location,
    date,
    url,
    actors: getLabels(actors),
    attendanceMode: type.label === 'none' ? undefined : type.label
  }
}

/**
 * ライブデータを作成
 * @param editor TextEditor
 */
export async function createLiveData(editor: vscode.TextEditor) {
  const liveInfo = await inputLiveInfo()
  if (!liveInfo) return

  const rdf = createLiveRDF(liveInfo)

  await insertEditor(editor, rdf)
}
