<template>
  <div>
    <h1>Logged in as {{response.displayName}}</h1>
    <div>
        <div>
          <img width="150" :src="response.profilePicture" />
        </div>
        <div id="info">
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
            Country: {{response.country}}
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
        </div>
    </div>
    <h2>OAuth</h2>
    <button @click="refresh_token()">
      Obtain new token using the refresh token
    </button>
    <div>
      <button id="logout" @click="logout()">
        Logout
      </button>
    </div>
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
    },
    logout() {
      localStorage.removeItem("access_token")
      this.$router.push({ name: "Login" })
    }
  }
}
</script>

<style scoped>
button {
  background-color: rgb(255, 206, 166);
  min-width: 80px;
  height: 25px;
  color: rgb(65, 65, 65);
  border-radius: 5px;
}

a {
  overflow-wrap: break-word;
}

#info {
  text-align: center;
}

#logout {
  margin-top: 10px;
  height: 100px;
  width: 80%;
  max-width: 200px;
  background-color: #0F5257;
  color: #FFFFFF;
  font-size: x-large;
  border: 4px solid gainsboro;
  border-radius: 120px;
}
</style>
