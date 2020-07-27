import Vue from 'vue'
import Vuex from 'vuex'

import * as messagesService from '../services/messages'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    spotifyPlaybackSDKReady: false,
    player: null,
    currentlyPlaying: null,
    paused: false,
    socket: null,
    channelId: "",
    eventSource: null,
    userId: ""
  },
  mutations: {
    setSpotifyPlaybackSDKReady(state, ready) {
      state.spotifyPlaybackSDKReady = ready
    },
    setPlayer(state, player) {
      state.player = player
    },
    setCurrentlyPlaying(state, track) {
      state.currentlyPlaying = track
    },
    setPaused(state, paused) {
      state.paused = paused
    },
    setChannelId(state, channelId) {
      state.channelId = channelId
    },
    setAccessToken(state, accessToken) {
      localStorage.setItem("access_token", accessToken)
    }
  },
  actions: {
    setInfo({ state }, data) {
      state.userId = data.id
    },
    sendSocket({ state }, { message, trackUri }) {
      if (state.socket == null) {
        return
      }
      state.socket.send(JSON.stringify({ message, trackUri }))
    },
    startSockets({ state, commit }) {
      // const socket = new WebSocket("ws://localhost:8080/sockets")
      // socket.addEventListener('message', async (event) => {
      //   console.log(event)
      // })
      // state.socket = socket
    },
    requestPlay({ state, commit, dispatch }, track) {
      if (state.player == null) {
        return
      }
      if (state.channelId) {
        dispatch("messageTrackUpdate", track)
      } else {
        dispatch("play", track)
      }
    },
    play({ state, commit }, track) {
      if (state.player == null) {
        return
      }
      commit("setCurrentlyPlaying", track)
      commit("setPaused", false)
      const getOAuthToken = state.player._options.getOAuthToken
      const id = state.player._options.id
      getOAuthToken(accessToken => {
        fetch(`https://api.spotify.com/v1/me/player/play?device_id=${id}`, {
          method: 'PUT',
          body: JSON.stringify({ uris: [track.uri] }),
          headers: {
            "Content-Type": 'application/json',
            Authorization: `Bearer ${accessToken}`
          }
        })
      })
    },
    requestResume({ state, dispatch, commit }) {
      if (state.player == null) {
        return
      }
      if (state.channelId) {
        dispatch("messagePause", false)
      } else {
        dispatch("resume")
      }
    },
    requestPause({ state, dispatch, commit }) {
      if (state.player == null) {
        return
      }
      if (state.channelId) {
        dispatch("messagePause", true)
      } else {
        dispatch("pause")
      }
    },
    resume({ state, commit }) {
      if (state.player == null) {
        return
      }
      state.player.resume()
        .then(() => commit("setPaused", false))
        .catch(e => console.log(e))
    },
    pause({ state, commit }) {
      if (state.player == null) {
        return
      }
      state.player.pause()
        .then(() => commit("setPaused", true))
        .catch(e => console.log(e))
    },
    messageTrackUpdate({ state }, track) {
      if (state.channelId == null) return
      const message = {
        message: "trackUpdate",
        sender: state.userId,
        channelId: state.channelId,
        trackUri: track.uri,
        track: track,
        recipient: "",
        createdAt: Date.now()
      }
      messagesService.sendMessage(message)
        .then(res => {
          console.log("Sent:", res)
        }).catch(err => console.log(err))
    },
    messagePause({ state }, pause) {
      if (state.channelId == null) return
      const message = {
        message: (pause) ? "pause" : "resume",
        sender: state.userId,
        channelId: state.channelId,
        createdAt: Date.now()
      }
      messagesService.sendMessage(message)
        .then(res => {
          console.log("Sent:", res)
        }).catch(err => console.log(err))
    },
    create({ state, dispatch }, channelId) {
      const message = {
        message: "Start up",
        sender: state.userId,
        channelId: channelId,
        trackUri: "",
        recipient: "",
        createdAt: Date.now()
      }
      messagesService.sendMessage(message)
        .then(res => {
          console.log("Success:", res)
          dispatch("connect", channelId)
        }).catch(err => console.log(err))
    },
    connect({ state, dispatch, commit }, channelId) {
      commit("setChannelId", channelId)
      const eventSource = new EventSource(`${process.env.VUE_APP_API_URL}/msg/sse/${channelId}`)
      eventSource.onmessage = function (event) {
        console.log("SSE Received: ", JSON.parse(event.data))
      }
      eventSource.onerror = function (err) {
        console.log("SSE Error:", err)
        eventSource.close()
      }
      eventSource.addEventListener("trackUpdate", function (event) {
        const data = JSON.parse(event.data)
        if (data == null) return
        const seconds = 30
        const dateNSecondsAgo = new Date(new Date().getTime() - seconds * 1000)
        if (new Date(data.createdAt).getTime() < dateNSecondsAgo.getTime()) {
          return
        }
        console.log("PARSED SSE:", data)
        if (data.trackUri != null && data.trackUri.length > 10 && data.track != null) {
          dispatch("play", data.track)
        }
      })
      eventSource.addEventListener("pause", function (event) {
        const data = JSON.parse(event.data)
        if (data == null) return
        const seconds = 30
        const dateNSecondsAgo = new Date(new Date().getTime() - seconds * 1000)
        if (new Date(data.createdAt).getTime() < dateNSecondsAgo.getTime()) {
          return
        }
        console.log("SSE Pause:", data)
        dispatch("pause")
      })
      eventSource.addEventListener("resume", function (event) {
        const data = JSON.parse(event.data)
        if (data == null) return
        const seconds = 30
        const dateNSecondsAgo = new Date(new Date().getTime() - seconds * 1000)
        if (new Date(data.createdAt).getTime() < dateNSecondsAgo.getTime()) {
          return
        }
        console.log("SSE Resume:", data)
        dispatch("resume")
      })
      state.eventSource = eventSource
    },
    disconnect({ state, commit }) {
      if (state.eventSource == null) return
      state.eventSource.close()
      state.eventSource = null
      commit("setChannelId", "")
    }
  },
  modules: {
  },
  getters: {
    spotifyPlaybackSDKReady(state) {
      return state.spotifyPlaybackSDKReady
    },
    player(state) {
      return state.player
    },
    currentlyPlaying(state) {
      return state.currentlyPlaying
    },
    paused(state) {
      return state.paused
    },
    channelId(state) {
      return state.channelId
    },
    accessToken(state) {
      return localStorage.getItem("access_token")
    }
  }
})
