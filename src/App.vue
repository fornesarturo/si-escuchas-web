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
body {
  background-color: darkslategray;
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
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: peachpuff;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
