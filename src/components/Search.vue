<template>
    <div>
      <p>Look for Artist, Album or Track: </p>
      <input v-model="searchText" placeholder="The National, I Am Easy To Find, Where is her head ...">
      <track-list v-bind="tracks" @select="selectedTrack" @enqueue="enqueueTrack"/>
    </div>
</template>

<script>
import * as service from '../services/play'
import * as loginService from '../services/login'
import TrackList from "./TrackList.vue"
import debounce from "lodash.debounce"

export default {
  name: "Search",
  components: { TrackList },
  data() {
    return {
      searchText: "",
      tracks: {}
    }
  },
  watch: {
    searchText() {
      this.delayedSearch()
    }
  },
  created() {
    this.delayedSearch = debounce(() => {
      this.search()
    }, 80)
  },
  methods: {
    search() {
      if (this.searchText.length === 0) {
        this.tracks = {}
        return
      }
      service.search(this.searchText)
        .then(res => { this.tracks = res.tracks })
        .catch(err => {
          if (err.status === 401) {
            loginService.refreshToken()
          }
        })
    },
    selectedTrack(track) {
      console.log(`Selected track: ${track.uri}`)
      this.$store.dispatch("requestPlay", track)
    },
    enqueueTrack(track) {
      console.log(`Enqueueing track: ${track.uri}`)
      this.$store.dispatch("enqueueTrack", track)
    }
  }
}
</script>

<style scoped>
input {
  width: 80%;
  max-width: 500px;
  height: 30px;
  background-color: palegoldenrod;
  color: darkslategrey;
  font-size: large;
  text-align: center;
  border-radius: 5px;
  margin-bottom: 10px;
}
</style>
