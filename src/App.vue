<template>
  <div id="app">
    <div v-if="!isLogin" id="nav">
      <router-link class="item" id="item-home" to="/home">Home</router-link>
      <router-link class="item" id="item-play" to="/play">Play</router-link>
    </div>
    <div id="content">
      <router-view/>
    </div>
  </div>
</template>

<script>
import playbackReady from "./mixins/playbackReady"

export default {
  mixins: [playbackReady],
  computed: {
    isLogin() {
      return this.$route.name === "Login"
    }
  }
}
</script>

<style>
body {
  background-color: #0B3142;
  margin: 0px;
}

#content {
  margin: 8px;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  /* color: #2c3e50; */
  color: peachpuff;
}

#nav {
  display: flex;
  justify-content: center;
}

.item {
  flex-grow: 1;
  height: 80px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-size: x-large;
}

#item-home {
  background-color: #77ACA2;
  color: whitesmoke;
}

a {
  text-decoration: none !important;
}

#item-play {
  background-color: #9DBEBB;
  color: whitesmoke;
}

#nav a.router-link-active {
  border: 3px solid gainsboro;
  height: 74px;
}
/* #nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: peachpuff;
}

#nav a.router-link-exact-active {
  color: #42b983;
} */
</style>
