import { QuickPickItem } from 'vscode'

export const liveTypeQuickPickItems: QuickPickItem[] = [
  {
    label: 'none',
    detail: '現地のみで開催されたイベント・ライブ'
  },
  {
    label: 'OnlineEventAttendanceMode',
    detail: 'オンラインのみで開催されたイベント・ライブ'
  },
  {
    label: 'MixedEventAttendanceMode',
    detail: '現地とオンライン両方で開催されたイベント・ライブ'
  }
]
