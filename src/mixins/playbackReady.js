import cookie from "./cookie"

export default {
  mixins: [cookie],
  computed: {
    accessToken() {
      return this.$store.getters.accessToken
    },
    ready: {
      get() {
        return this.$store.getters.spotifyPlaybackSDKReady
      },
      set(value) {
        this.$store.commit("setSpotifyPlaybackSDKReady", value)
      }
    },
    player: {
      get() {
        return this.$store.getters.player
      },
      set(value) {
        this.$store.commit("setPlayer", value)
      }
    }
  },
  watch: {
    ready: function(now, before) {
      if (now) {
        this.createPlayer()
      }
    }
  },
  created() {
    window.onSpotifyWebPlaybackSDKReady = () => {
      this.ready = true
    }
    window.onunload = () => {
      this.$store.dispatch("disconnect")
    }
    window.onbeforeunload = () => {
      this.$store.dispatch("disconnect")
    }
  },
  methods: {
    createPlayer() {
      if (!this.ready || this.accessToken == null || this.accessToken.length === 0) {
        return
      }
      this.player = new window.Spotify.Player({
        name: 'Reproductor bien cool',
        getOAuthToken: cb => { cb(localStorage.getItem("access_token")) }
      })

      // Error handling
      this.player.addListener('initialization_error', ({ message }) => { console.error(message) })
      this.player.addListener('authentication_error', ({ message }) => { console.error(message) })
      this.player.addListener('account_error', ({ message }) => { console.error(message) })
      this.player.addListener('playback_error', ({ message }) => { console.error(message) })

      // Playback status updates
      this.player.addListener('player_state_changed', state => { console.log(state) })

      // Ready
      this.player.addListener('ready', ({ device_id: deviceId }) => {
        console.log('Ready with Device ID', deviceId)
      })

      // Not Ready
      this.player.addListener('not_ready', ({ device_id: deviceId }) => {
        console.log('Device ID has gone offline', deviceId)
      })

      // Connect to the player!
      this.player.connect()
    }
  }
}
