import axios from "axios";

export type Bindings = {
  [variable: string]: { value: string };
};

interface ImasAPIResponse {
  results: {
    bindings: Bindings[];
  };
}

/**
 * imasparql にクエリを投げる
 * @param query SPARQLクエリ
 * @returns 検索結果配列
 */
export async function fetchIdolData(query: string): Promise<Bindings[]> {
  const trimedQuery = query.replace(/[\n\r|\s+]/g, " ");

  const url = new URL("https://sparql.crssnky.xyz/spql/imas/query?output=json");
  url.searchParams.append("query", trimedQuery);

  try {
    const res = await axios.get<ImasAPIResponse>(url.href, { timeout: 5000 });
    return res.data.results.bindings;
  } catch (err) {
    throw err;
  }
}
