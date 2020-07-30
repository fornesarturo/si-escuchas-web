import requestor from './requestor'

export function login() {
  return requestor.get('/spotify', { headers: { "Access-Control-Allow-Origin": "*" } })
}

export async function me() {
  try {
    const res = await requestor.get('/me')
    return res
  } catch (err) {
    if (err.status === 401) {
      const refreshResult = await refreshToken()
      localStorage.setItem("access_token", refreshResult.access_token)
      return await requestor.get('/me')
    } else {
      throw err
    }
  }
}

export function refreshToken() {
  return requestor.get('/refresh_token')
}
