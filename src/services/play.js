import requestor from "./requestor"
import { refreshToken } from "./login"

/**
 *
 * @param {string} query Search this query
 */
export async function search(query) {
  const correctlySpacedQuery = query.replace(/ /g, "+")
  try {
    const res = await requestor.get("/search", { params: { query: correctlySpacedQuery } })
    return res
  } catch (err) {
    if (err.status === 401) {
      localStorage.removeItem("access_token")
      const refreshResult = await refreshToken()
      localStorage.setItem("access_token", refreshResult.access_token)
      return await requestor.get("/search", { params: { query: correctlySpacedQuery } })
    } else {
      throw err
    }
  }
}

export async function play(id, trackUri) {
  try {
    const res = await requestor.put(`https://api.spotify.com/v1/me/player/play?device_id=${id}`,
      { uris: [trackUri] },
      { headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` }, withCredentials: false })
    return res
  } catch (err) {
    if (err.status === 401) {
      localStorage.removeItem("access_token")
      const refreshResult = await refreshToken()
      localStorage.setItem("access_token", refreshResult.access_token)
      return await requestor.put(`https://api.spotify.com/v1/me/player/play?device_id=${id}`,
        { uris: [trackUri] },
        { headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` }, withCredentials: false })
    } else {
      throw err
    }
  }
}
