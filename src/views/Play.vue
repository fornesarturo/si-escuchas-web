<template>
    <div>
      <channel-connection/>
      <div v-if="player != null" id="player-details">
        <div>
          Player: <b>{{player._options.name}}</b>
        </div>
        <div>
          <input
            id="set-volume"
            type="range"
            min="0"
            max="1"
            step="0.01"
            :value="volume"
            @input="setVolume($event.target.value)"
            >
        </div>
      </div>
      <div v-else>
        <button @click="createPlayer()">Start Player</button>
      </div>
      <div v-if="currentlyPlaying != null">
        <div>
          Now Playing:
        </div>
        <div class="now-playing">
          <track-item v-bind="currentlyPlaying">
            <template v-slot:actions>
              <div>
                <button v-if="paused" @click="resume()">Play</button>
                <button v-else @click="pause()">Pause</button>
              </div>
            </template>
          </track-item>
          <input
            id="seek-track"
            type="range"
            min="0"
            :max="currentlyPlaying.seconds"
            step="1"
            @mousemove="setDisplaySecond"
            @mouseup="seek"
            @mouseenter="shouldDisplaySecond = true"
            @mouseleave="shouldDisplaySecond = false"
            :value="estimatedSecond"
            >
          <div v-show="shouldDisplaySecond">
            {{ displaySecond }}
          </div>
        </div>
      </div>
      <Search/>
    </div>
</template>

<script>
import Search from "../components/Search.vue"
import TrackItem from "../components/TrackItem.vue"
import ChannelConnection from "../components/ChannelConnection.vue"
import playbackReady from "../mixins/playbackReady"
import { mapState, mapActions } from 'vuex'

function zeroFill(number, width) {
  width -= number.toString().length
  if (width > 0) {
    return new Array(width + (/\./.test(number) ? 2 : 1)).join('0') + number
  }
  return number + ""
}

export default {
  name: "Play",
  components: { Search, TrackItem, ChannelConnection },
  mixins: [playbackReady],
  data() {
    return {
      displaySecond: "",
      shouldDisplaySecond: false,
      estimatedSecond: 0
    }
  },
  computed: {
    ...mapState(['volume']),
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
  watch: {
    currentlyPlaying() {
      this.startEstimatingSecond()
    }
  },
  created() {
    this.setVolume(this.volume)
  },
  methods: {
    ...mapActions(['setVolume']),
    startEstimatingSecond() {
      const st = setInterval(() => {
        console.log(this.estimatedSecond)
        this.estimatedSecond += 1
        if (this.estimatedSecond >= this.currentlyPlaying.seconds) {
          clearInterval(st)
        }
      }, 1000)
    },
    resume() {
      this.$store.dispatch("requestResume")
    },
    pause() {
      this.$store.dispatch("requestPause")
    },
    setDisplaySecond(e) {
      const value = Math.floor((e.offsetX / e.target.clientWidth) * parseInt(e.target.getAttribute('max'), 10))
      this.displaySecond = `${Math.floor(value / 60)}:${zeroFill(value % 60, 2)}`
    },
    seek(e) {
      const second = parseInt(e.target.value)
      this.$store.dispatch("requestSeek", second)
      this.estimatedSecond = second
    }
  }
}
</script>

<style scoped>
.now-playing {
  width: 100%;
  display: grid;
  grid-template-columns: minmax(300px, 600px);
  grid-template-rows: 135px;
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
