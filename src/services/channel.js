import requestor from './requestor'

export function createChannel(channel) {
  return requestor.post('/channel', channel)
}

export function getChannel(channelId) {
  return requestor.get(`/channel/${channelId}`)
}

export function connectUser(channelId, user) {
  return requestor.post(`/channel/${channelId}/connectUser`, null, { params: { user } })
}

export function disconnectUser(channelId, user) {
  return requestor.post(`/channel/${channelId}/disconnectUser`, null, { params: { user } })
}

export function enqueueTrack(channelId, track) {
  return requestor.post(`/channel/${channelId}/enqueueTrack`, track)
}

export function dequeueTrack(channelId, track) {
  return requestor.post(`/channel/${channelId}/dequeueTrack`, track)
}
