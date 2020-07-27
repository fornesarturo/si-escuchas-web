import requestor from "./requestor"

/**
 *
 * @param {string} query Search this query
 */
export function search(query) {
  const correctlySpacedQuery = query.replace(/ /g, "+")
  return requestor.get("/search", { params: { query: correctlySpacedQuery } })
}
