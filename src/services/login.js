import requestor from './requestor'

export function login() {
  return requestor.get('/spotify', { headers: { "Access-Control-Allow-Origin": "*" } })
}

export function me() {
  return requestor.get('/me')
}

export function refreshToken() {
  return requestor.get('/refresh_token')
}
