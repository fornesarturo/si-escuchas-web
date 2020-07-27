import requestor from './requestor'

export function createChannel(channel) {
  return requestor.post('/channel', channel)
}

export function getChannel(channelId) {
  return requestor.get(`/channel/${channelId}`)
}
