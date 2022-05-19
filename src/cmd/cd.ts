import * as vscode from 'vscode'

import { insertEditor } from '../libs/editor'
import { escapeHTML } from '../libs/escape'
import { showInputBox } from '../libs/input'
import { validateDate, validateNumber, validateURL } from '../libs/validate'
import { buildXML } from '../libs/xml'

import { releaseFormatQuickPickItems } from '../data/releaseFormat'
import { releaseTypeQuickPickItems } from '../data/releaseType'

/** アルバム情報 */
type Album = {
  title: string
  catalogNumber: string
  datePublished: string
  musicReleaseFormat: string
  albumReleaseType: string
  url: string
  // byArtists: string[]
  numTracks: string
}

function createCDRDF(album: Album): string {
  const {
    catalogNumber,
    musicReleaseFormat,
    datePublished,
    url,
    albumReleaseType,
    numTracks
  } = album

  const title = encodeURIComponent(album.title)

  const CDData = {
    'rdf:Description': {
      '@_rdf:about': catalogNumber,
      'rdf:type': {
        '@_rdf:resource': 'http://schema.org/MusicRelease'
      },
      // <schema:creditedTo rdf:resource="Kisaragi_Chihaya" />
      'schema:catalogNumber': {
        '@_rdf:datatype': 'http://www.w3.org/2001/XMLSchema#string',
        '#text': catalogNumber
      },
      'schema:musicReleaseFormat': {
        '@_rdf:datatype': 'http://www.w3.org/2001/XMLSchema#string',
        '#text': musicReleaseFormat
      },
      'schema:datePublished': {
        '@_rdf:datatype': 'http://www.w3.org/2001/XMLSchema#date',
        '#text': datePublished
      },
      'schema:url': {
        '@_rdf:resource': url
      },
      'schema:releaseOf': {
        'rdf:Description': {
          '@_rdf:about': title
        },
        'rdf:type': {
          '@_rdf:resource': 'http://schema.org/MusicAlbum'
        },
        'schema:albumRelease': {
          '@_rdf:resource': catalogNumber
        },
        'schema:albumReleaseType': {
          '@_rdf:datatype': 'http://www.w3.org/2001/XMLSchema#string',
          '#text': albumReleaseType
        },
        'schema:name': {
          '@_xml:lang': 'ja',
          '#text': escapeHTML(album.title)
        },
        // <schema:byArtist rdf:resource="Kisaragi_Chihaya" />
        'schema:numTracks': {
          '@_rdf:datatype': 'http://www.w3.org/2001/XMLSchema#integer',
          '#text': numTracks
        },
        'schema:track': []
      }
    }
  }

  return buildXML(CDData)
}

/**
 * アルバム情報の入力を受付
 * @returns アルバム情報
 */
async function inputAlbumInfo(): Promise<Album | undefined> {
  // アルバム名
  const title = await showInputBox({
    title: 'アルバム名を入力'
  })
  if (typeof title === 'undefined') return

  // 商品ID
  const catalogNumber = await showInputBox({
    title: '商品IDを入力'
  })
  if (typeof catalogNumber === 'undefined') return

  // 発売日
  const datePublished = await showInputBox({
    title: '発売日を入力 (schema:datePublished)',
    validateInput: validateDate
  })
  if (typeof datePublished === 'undefined') return

  // リリース形式
  const releaseFormat = await vscode.window.showQuickPick(
    releaseFormatQuickPickItems,
    {
      title: 'リリース形式を選択 (schema:musicReleaseFormat)'
    }
  )
  if (typeof releaseFormat === 'undefined') return

  // リリース形態
  const releaseType = await vscode.window.showQuickPick(
    releaseTypeQuickPickItems,
    {
      title: 'リリース形態を選択 (schema:albumReleaseType)'
    }
  )
  if (typeof releaseType === 'undefined') return

  // URL
  const url = await showInputBox({
    title: '詳細ページのURLを入力 (schema:url)',
    validateInput: validateURL
  })
  if (typeof url === 'undefined') return

  // TODO: アルバムアーティストの扱いがよくわからなかった

  // トラック数
  const numTracks = await showInputBox({
    title: 'トラック数を入力',
    value: '1',
    validateInput: validateNumber
  })
  if (typeof numTracks === 'undefined') return

  return {
    title,
    catalogNumber,
    datePublished,
    musicReleaseFormat: releaseFormat.label,
    albumReleaseType: releaseType.label,
    url,
    numTracks
  }
}

/**
 * CD データを作成
 * @param editor TextEditor
 * @returns RDF データ
 */
export async function createCDData(editor: vscode.TextEditor) {
  // アルバム情報
  const albumInfo = await inputAlbumInfo()
  if (typeof albumInfo === 'undefined') return

  // トラック情報

  const rdf = createCDRDF(albumInfo)

  await insertEditor(editor, rdf)
}
