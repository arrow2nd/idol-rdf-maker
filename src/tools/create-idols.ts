import { writeFileSync } from 'fs'
import type { QuickPickItem } from 'vscode'

import { convertBrandName } from './libs/convert'
import { fetchIdolData } from './libs/fetch'

/** SPARQLクエリ (全アイドルを取得) */
const query = `
PREFIX schema: <http://schema.org/>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX imas: <https://sparql.crssnky.xyz/imasrdf/URIs/imas-schema.ttl#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
SELECT DISTINCT ?d ?name ?nameKana ?brand
WHERE {
  ?d rdf:type imas:Idol;
     rdfs:label ?name;
     imas:Brand ?brand.
  OPTIONAL{ ?d imas:alternateNameKana ?nameKana }
  OPTIONAL{ ?d imas:nameKana ?nameKana }
  OPTIONAL{ ?d imas:givenNameKana ?nameKana }
}
ORDER BY ?nameKana
`

;(async () => {
  const data = await fetchIdolData(query)

  const items: QuickPickItem[] = data.map((e): QuickPickItem => {
    const label = e.d.value.match(/detail\/(.+)$/)![1]
    const nameKana = e.nameKana.value.replace(/[・\s]/g, '')
    const brand = convertBrandName(e.brand.value)

    return {
      label,
      description: `${e.name.value} / ${nameKana}`,
      detail: brand
    }
  })

  const json = JSON.stringify(items, null, '  ')
  const result = `import type { QuickPickItem } from 'vscode'\n\nexport const idolQuickPickItems: QuickPickItem[] = ${json}`

  writeFileSync('./src/data/idols.ts', result)

  console.log('[ SUCCESS ]')
})()
