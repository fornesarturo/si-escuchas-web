import requestor from './requestor'

export function sendMessage(message) {
  return requestor.post('/msg', message)
}
