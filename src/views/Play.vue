<template>
    <div>
      <channel-connection/>
      <div v-if="player != null">
        Player: {{player._options.name}}
      </div>
      <div v-else>
        <button @click="createPlayer()">Start Player</button>
      </div>
      <div v-if="currentlyPlaying != null">
        <div>
          Now Playing:
          <button v-if="paused" @click="resume()">Play</button>
          <button v-else @click="pause()">Pause</button>
        </div>
        <div class="now-playing">
          <Track v-bind="currentlyPlaying"/>
        </div>
      </div>
      <Search/>
    </div>
</template>

<script>
import Search from "../components/Search.vue"
import Track from "../components/Track.vue"
import ChannelConnection from "../components/ChannelConnection.vue"
import playbackReady from "../mixins/playbackReady"

export default {
  name: "Play",
  components: { Search, Track, ChannelConnection },
  mixins: [playbackReady],
  data() {
    return {
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
    }
  },
  methods: {
    resume() {
      this.$store.dispatch("requestResume")
    },
    pause() {
      this.$store.dispatch("requestPause")
    }
  }
}
</script>

<style scoped>
.now-playing {
  width: 100%;
  display: grid;
  grid-template-columns: minmax(300px, 600px);
  grid-template-rows: minmax(120px, 1fr);
  justify-content: center;
}
</style>
