<template>
    <div>
      <div>
        Enter channel ID:
        <input v-if="channelId == ''" v-model="localChannelId" type="text" placeholder="Channel ID">
        <input v-else v-model="channelId" disabled type="text" placeholder="Channel ID">
        <div v-if="channelId == ''">
          <button @click="connect()">Connect</button>
          <button @click="create()">Create</button>
        </div>
        <div v-else>
          <button @click="disconnect()">Disconnect</button>
        </div>
      </div>
      <div v-if="player != null">
        Player: {{player._options.name}}
      </div>
      <div v-else>
        <button @click="createPlayer()">Start Player</button>
      </div>
      <div v-if="currentlyPlaying != null">
        <div>
          <button v-if="paused" @click="resume()">Play</button>
          <button v-else @click="pause()">Pause</button>
        </div>
        Now Playing:
        <Track v-bind="currentlyPlaying"/>
      </div>
      <label>Look for Artist, Album or Track: </label>
      <input v-model="searchText" type="search" placeholder="The National, Where is her head, etc.">
      <button @click="search()">Search</button>
      <track-list v-bind="tracks" @select="selectedTrack"/>
    </div>
</template>

<script>
import * as service from '../services/play'
import TrackList from "../components/TrackList.vue"
import Track from "../components/Track.vue"
import cookie from "../mixins/cookie"
import playbackReady from "../mixins/playbackReady"

export default {
  name: "Play",
  components: { TrackList, Track },
  mixins: [cookie, playbackReady],
  data() {
    return {
      searchText: "",
      tracks: {},
      localChannelId: ""
    }
  },
  computed: {
    currentlyPlaying: {
      get() {
        return this.$store.getters.currentlyPlaying
      },
      set(value) {
        this.$store.commit("setCurrentlyPlaying", value)
      }
    },
    paused: {
      get() {
        return this.$store.getters.paused
      }
    },
    channelId: {
      get() {
        return this.$store.getters.channelId
      },
      set(value) {
        this.$store.commit("setChannelId", value)
      }
    }
  },
  methods: {
    resume() {
      this.$store.dispatch("requestResume")
    },
    pause() {
      this.$store.dispatch("requestPause")
    },
    search() {
      if (this.searchText.length === 0) {
        return
      }
      service.search(this.searchText)
        .then(res => { this.tracks = res.tracks })
    },
    selectedTrack(track) {
      console.log(`Selected track: ${track.uri}`)
      if (this.player != null) {
        this.$store.dispatch("requestPlay", track)
      }
    },
    connect() {
      this.$store.dispatch("connect", this.localChannelId)
    },
    create() {
      this.$store.dispatch("create", this.localChannelId)
    },
    disconnect() {
      this.$store.dispatch("disconnect")
    }
  }
}
</script>
