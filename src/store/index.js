import Vue from "vue"
import Vuex from "vuex"

import * as messagesService from "../services/messages"
import * as channelService from "../services/channel"
import * as playService from "../services/play"

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
    userId: "",
    queue: [],
    connected: [],
    channelOwner: ""
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
    },
    setQueue(state, queue) {
      state.queue = queue
    },
    setConnected(state, connected) {
      state.connected = connected
    },
    setChannelOwner(state, channelOwner) {
      state.channelOwner = channelOwner
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
      if (state.channelId !== "") {
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
      // const getOAuthToken = state.player._options.getOAuthToken
      const id = state.player._options.id
      playService.play(id, track.uri)
    },
    requestResume({ state, dispatch, commit }) {
      if (state.player == null) {
        return
      }
      if (state.channelId !== "") {
        dispatch("messagePause", false)
      } else {
        dispatch("resume")
      }
    },
    requestPause({ state, dispatch, commit }) {
      if (state.player == null) {
        return
      }
      if (state.channelId !== "") {
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
      if (state.channelId === "") return
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
    requestSeek({ state, dispatch }, second) {
      if (state.player == null) {
        return
      }
      if (state.channelId !== "") {
        const message = {
          message: "seekTrack",
          sender: state.userId,
          channelId: state.channelId,
          recipient: "",
          second: second,
          createdAt: Date.now()
        }
        messagesService.sendMessage(message)
          .then(res => {
            console.log("Sent:", res)
          }).catch(err => console.log(err))
      } else {
        dispatch("seek", second)
      }
    },
    seek({ state }, second) {
      if (state.player == null) {
        return
      }
      if (state.currentlyPlaying == null) {
        console.log("No song playing")
        return
      }
      if (second < 0 || state.currentlyPlaying.seconds < second) {
        console.log("Second requested was not recorded")
        return
      }
      const minutes = Math.floor(second / 60)
      const seconds = Math.floor(second % 60)
      state.player.seek(second * 1000)
        .then((res) => console.log(`Player seeked to ${minutes}:${seconds}`))
    },
    setVolume({ state }, volume) {
      if (state.player == null) {
        return
      }
      state.player.setVolume(volume)
        .then(() => {})
        .catch(err => console.log("Error while setting volume", err))
    },
    async enqueueTrack({ state, commit, dispatch }, track) {
      if (state.player == null) {
        return
      }
      if (state.channelId !== "") {
        const message = {
          message: "enqueueTrack",
          sender: state.userId,
          channelId: state.channelId,
          trackUri: track.uri,
          track: track,
          recipient: "",
          createdAt: Date.now()
        }
        await channelService.enqueueTrack(state.channelId, track)
        await messagesService.sendMessage(message)
      } else {
        const queue = state.queue
        queue.push(track)
        commit("setQueue", queue)
      }
    },
    async dequeueTrack({ state, commit, dispatch, getters }, track) {
      if (state.player == null) {
        return
      }
      if (state.channelId !== "") {
        if (state.connected[0] !== state.userId) return
        const message = {
          message: "dequeueTrack",
          sender: state.userId,
          channelId: state.channelId,
          trackUri: track.uri,
          track: track,
          recipient: "",
          createdAt: Date.now()
        }
        await channelService.dequeueTrack(state.channelId, track)
        await messagesService.sendMessage(message)
      } else {
        const queue = state.queue
        const index = queue.findIndex(t => t.id === track.id)
        if (index >= 0) {
          commit("setQueue", queue.filter((t, i) => i !== index))
        }
      }
    },
    async playNextInQueue({ state, dispatch }) {
      if (state.player == null) return
      if (state.channelId !== "") {
        console.log(`Requesting next song... allowed: ${state.connected[0]} or ${state.channelOwner}, you: ${state.userId}`)
        if (state.connected.includes(state.channelOwner) && state.channelOwner !== state.userId) {
          if (state.connected[0] !== state.userId {
            return
          }
        }
        const queue = state.queue
        if (queue.length === 0) return
        const nextTrack = queue[0]
        dispatch("requestPlay", nextTrack)
        dispatch("dequeueTrack", nextTrack)
      } else {
        console.log("Requesting next song locally")
        const queue = state.queue
        if (queue.length === 0) return
        const nextTrack = queue[0]
        dispatch("requestPlay", nextTrack)
        dispatch("dequeueTrack", nextTrack)
      }
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
      if (state.userId == null) return
      channelService.createChannel({ owner: state.userId })
        .then(channel => {
          const message = {
            message: "createChannel",
            sender: state.userId,
            channelId: channel.id,
            trackUri: "",
            recipient: "",
            createdAt: Date.now()
          }
          messagesService.sendMessage(message)
            .then(res => {
              console.log("Success:", res)
              dispatch("connect", channel.id)
            }).catch(err => console.log(err))
        }).catch(err => console.log(err))
    },
    async connect({ state, dispatch, commit }, channelId) {
      const channel = await channelService.getChannel(channelId)
      if (channel == null || typeof channel === "string") {
        alert("No channel, oopsie")
        return
      }
      const message = {
        message: "connectUser",
        sender: state.userId,
        channelId: channelId,
        createdAt: Date.now()
      }
      const res = await messagesService.sendMessage(message)
      const connectedChannel = await channelService.connectUser(channel.id, state.userId)
      console.log("connectUserResponse:", connectedChannel)
      commit("setQueue", connectedChannel.queue)
      commit("setConnected", connectedChannel.connected)
      commit("setChannelOwner", connectedChannel.owner)
      console.log("Connected to Channel:")
      console.log(channel)
      console.log(res)
      commit("setChannelId", channel.id)
      const eventSource = new EventSource(`${process.env.VUE_APP_API_URL}/msg/sse/${channel.id}`)
      eventSource.onmessage = function (event) {
        console.log("SSE Received: ", JSON.parse(event.data))
      }
      eventSource.onerror = function (err) {
        console.log("SSE Error:", err)
        dispatch("disconnect")
          .then(() => dispatch("connect", channelId))
      }
      eventSource.addEventListener("trackUpdate", function (event) {
        const data = JSON.parse(event.data)
        if (data == null) return
        const seconds = 5
        const dateNSecondsAgo = new Date(new Date().getTime() - seconds * 1000)
        if (new Date(data.createdAt).getTime() < dateNSecondsAgo.getTime()) {
          console.log("Just missed this:", event.data)
          return
        }
        console.log("SSE trackUpdate:", data)
        if (data.trackUri != null && data.trackUri.length > 10 && data.track != null) {
          dispatch("play", data.track)
        }
      })
      eventSource.addEventListener("seekTrack", function (event) {
        const data = JSON.parse(event.data)
        if (data == null) return
        const seconds = 5
        const dateNSecondsAgo = new Date(new Date().getTime() - seconds * 1000)
        if (new Date(data.createdAt).getTime() < dateNSecondsAgo.getTime()) {
          console.log("Just missed this:", event.data)
          return
        }
        console.log("SSE seekTrack:", data)
        if (data.second != null) {
          dispatch("seek", data.second)
        }
      })
      eventSource.addEventListener("pause", function (event) {
        const data = JSON.parse(event.data)
        if (data == null) return
        const seconds = 5
        const dateNSecondsAgo = new Date(new Date().getTime() - seconds * 1000)
        if (new Date(data.createdAt).getTime() < dateNSecondsAgo.getTime()) {
          console.log("Just missed this:", event.data)
          return
        }
        console.log("SSE Pause:", data)
        dispatch("pause")
      })
      eventSource.addEventListener("resume", function (event) {
        const data = JSON.parse(event.data)
        if (data == null) return
        const seconds = 5
        const dateNSecondsAgo = new Date(new Date().getTime() - seconds * 1000)
        if (new Date(data.createdAt).getTime() < dateNSecondsAgo.getTime()) {
          console.log("Just missed this:", event.data)
          return
        }
        console.log("SSE Resume:", data)
        dispatch("resume")
      })
      eventSource.addEventListener("disconnectUser", function (event) {
        const data = JSON.parse(event.data)
        if (data == null) return
        const seconds = 5
        const dateNSecondsAgo = new Date(new Date().getTime() - seconds * 1000)
        if (new Date(data.createdAt).getTime() < dateNSecondsAgo.getTime()) {
          console.log("Just missed this:", event.data)
          return
        }
        console.log("SSE disconnectUser:", data)
        channelService.getChannel(state.channelId)
          .then(channel => {
            commit("setQueue", channel.queue)
            commit("setConnected", channel.connected)
            commit("setChannelOwner", channel.owner)
          }).catch(err => console.log(err))
      })
      eventSource.addEventListener("connectUser", function (event) {
        const data = JSON.parse(event.data)
        if (data == null) return
        const seconds = 5
        const dateNSecondsAgo = new Date(new Date().getTime() - seconds * 1000)
        if (new Date(data.createdAt).getTime() < dateNSecondsAgo.getTime()) {
          console.log("Just missed this:", event.data)
          return
        }
        console.log("SSE connectUser:", data)
        channelService.getChannel(state.channelId)
          .then(channel => {
            commit("setQueue", channel.queue)
            commit("setConnected", channel.connected)
            commit("setChannelOwner", channel.owner)
          }).catch(err => console.log(err))
      })
      eventSource.addEventListener("enqueueTrack", function (event) {
        const data = JSON.parse(event.data)
        if (data == null) return
        const seconds = 5
        const dateNSecondsAgo = new Date(new Date().getTime() - seconds * 1000)
        if (new Date(data.createdAt).getTime() < dateNSecondsAgo.getTime()) {
          console.log("Just missed this:", event.data)
          return
        }
        console.log("SSE enqueueTrack:", data)
        channelService.getChannel(state.channelId)
          .then(channel => {
            commit("setQueue", channel.queue)
            commit("setConnected", channel.connected)
            commit("setChannelOwner", channel.owner)
          }).catch(err => console.log(err))
      })
      eventSource.addEventListener("dequeueTrack", function (event) {
        const data = JSON.parse(event.data)
        if (data == null) return
        const seconds = 5
        const dateNSecondsAgo = new Date(new Date().getTime() - seconds * 1000)
        if (new Date(data.createdAt).getTime() < dateNSecondsAgo.getTime()) {
          console.log("Just missed this:", event.data)
          return
        }
        console.log("SSE dequeueTrack:", data)
        channelService.getChannel(state.channelId)
          .then(channel => {
            commit("setQueue", channel.queue)
            commit("setConnected", channel.connected)
            commit("setChannelOwner", channel.owner)
          }).catch(err => console.log(err))
      })
      state.eventSource = eventSource
    },
    async disconnect({ state, commit }) {
      if (state.eventSource == null) return
      const message = {
        message: "disconnectUser",
        sender: state.userId,
        channelId: state.channelId,
        createdAt: Date.now()
      }
      try {
        const res = await messagesService.sendMessage(message)
        console.log("Sent:", res)
      } catch (e) {
        console.log(e)
      } finally {
        const disconnectedChannel = await channelService.disconnectUser(state.channelId, state.userId)
        console.log("disconnectUser result:", disconnectedChannel)
        commit("setQueue", [])
        commit("setConnected", [])
        commit("setChannelOwner", "")
        state.eventSource.close()
        state.eventSource = null
        commit("setChannelId", "")
      }
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
    },
    queue(state) {
      return state.queue
    },
    connected(state) {
      return state.connected
    }
  }
})
