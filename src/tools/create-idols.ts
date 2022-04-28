import { writeFileSync } from 'fs'
import type { QuickPickItem } from 'vscode'

import { convertBrandName, getUnitName } from './libs/data'
import { Bindings, fetchIdolData } from './libs/fetch'

/** SPARQLクエリ (全アイドルを取得) */
const query = `
PREFIX schema: <http://schema.org/>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX imas: <https://sparql.crssnky.xyz/imasrdf/URIs/imas-schema.ttl#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
SELECT DISTINCT ?d ?name ?nameKana ?brand ?cv
WHERE {
  ?d rdf:type imas:Idol;
  rdfs:label ?name;
  imas:Brand ?brand.
  OPTIONAL{ ?d imas:alternateNameKana ?nameKana }
  OPTIONAL{ ?d imas:nameKana ?nameKana }
  OPTIONAL{ ?d imas:givenNameKana ?nameKana }
  OPTIONAL{ ?d imas:cv ?cv. FILTER(lang(?cv) = "ja") }
}
ORDER BY ?nameKana
`

/**
 * @param b Bindings
 * @returns 値
 */
function getValues(b: Bindings) {
  const label = b.d.value.match(/detail\/(.+)$/)![1]

  return {
    label,
    nameKana: b.nameKana.value.replace(/[・\s]/g, ''),
    brand: convertBrandName(label, b.brand.value),
    unit: getUnitName(label)
  }
}

/**
 * @param data APIレスポンス配列
 * @returns ソースコード文字列
 */
function createIdols(data: Bindings[]): QuickPickItem[] {
  return data.map((e) => {
    const { label, nameKana, brand, unit } = getValues(e)

    return {
      label,
      description: `${e.name.value} (${nameKana})`,
      detail: `${brand}${unit ? ' / ' + unit : ''}`
    }
  })
}

function createCasts(data: Bindings[]): QuickPickItem[] {
  return data
    .filter((e) => e.cv?.value)
    .map((e) => {
      const { nameKana, brand, unit } = getValues(e)

      return {
        label: e.cv.value,
        description: `${e.name.value} (${nameKana})`,
        detail: `${brand}${unit ? ' / ' + unit : ''}`
      }
    })
}

;(async () => {
  const idolData = await fetchIdolData(query)

  const exportData = [
    {
      name: 'idol',
      items: createIdols(idolData)
    },
    {
      name: 'cast',
      items: createCasts(idolData)
    }
  ]

  for (const { name, items } of exportData) {
    const json = JSON.stringify(items, null, '  ')
    const result = `import type { QuickPickItem } from 'vscode'\n\nexport const ${name}QuickPickItems: QuickPickItem[] = ${json}`

    writeFileSync(`./src/data/${name}s.ts`, result)
  }

  console.log('[ SUCCESS ]')
})()
