<template>
    <div>
      <channel-connection/>
      <div v-if="player != null">
        Player: <b>{{player._options.name}}</b>
      </div>
      <div v-else>
        <button @click="createPlayer()">Start Player</button>
      </div>
      <div v-if="currentlyPlaying != null">
        <div>
          Now Playing:
        </div>
        <div class="now-playing">
          <Track v-bind="currentlyPlaying">
            <template v-slot:actions>
              <div>
                <button v-if="paused" @click="resume()">Play</button>
                <button v-else @click="pause()">Pause</button>
              </div>
            </template>
          </Track>
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
  grid-template-rows: 115px;
  justify-content: center;
}
button {
  background-color: rgb(255, 206, 166);
  min-width: 80px;
  height: 25px;
  color: rgb(65, 65, 65);
  border-radius: 5px;
}
</style>
