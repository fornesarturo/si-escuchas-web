<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Login</router-link> |
      <router-link to="/home">Home</router-link> |
      <router-link to="/play">Play</router-link>
    </div>
    <router-view/>
  </div>
</template>

<script>
import playbackReady from "./mixins/playbackReady"

export default {
  mixins: [playbackReady]
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
