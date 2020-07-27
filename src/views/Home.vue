<template>
  <div>
    <h1>Logged in as {{response.displayName}}</h1>
    <div>
        <div>
          <img width="150" :src="response.profilePicture" />
        </div>
        <div>
          <div>
            Display name: {{response.display_name}}
          </div>
          <div>
            Id: {{response.id}}
          </div>
          <div>
            Email: {{response.email}}
          </div>
          <div>
            Spotify URI: <a :href="response.externalUrl">{{response.externalUrl}}</a>
          </div>
          <div>
            Link: <a :href="response.href">{{response.href}}</a>
          </div>
          <div>
            Profile Image: <a :href="response.profilePicture">{{response.profilePicture}}</a>
          </div>
          <div>
            Country: {{response.country}}
          </div>
        </div>
    </div>
    <h2>OAuth</h2>
    <div>
      Access token: {{accessToken}}
    </div>
    <button @click="refresh_token()">
      Obtain new token using the refresh token
    </button>
  </div>
</template>

<script>
import * as service from '../services/login'
import cookie from '../mixins/cookie'

export default {
  name: 'Home',
  components: {
  },
  mixins: [cookie],
  beforeMount() {
    const queryAccessToken = this.$route.query.access_token
    if (queryAccessToken != null && queryAccessToken.length > 0) {
      this.accessToken = queryAccessToken
    }
    this.me()
  },
  data: function () {
    return {
      response: {}
    }
  },
  computed: {
    accessToken: {
      get() {
        return this.$store.getters.accessToken
      },
      set(value) {
        this.$store.commit("setAccessToken", value)
      }
    },
    refreshToken() {
      return this.getCookie("refresh_token")
    }
  },
  methods: {
    me() {
      service.me()
        .then(res => {
          console.log(res)
          this.response = res
          this.$store.dispatch("setInfo", res)
          this.$store.dispatch("startSockets")
        })
    },
    refresh_token() {
      service.refreshToken()
        .then(res => {
          if (res.access_token != null) {
            this.accessToken = res.access_token
          } else if (res.accessToken != null) {
            this.accessToken = res.accessToken
          }
        })
    }
  }
}
</script>
