<template>
  <div id="login-container">
    <a :href="url">
      <button>Login with Spotify</button>
    </a>
  </div>
</template>

<script>

export default {
  name: "Login",
  computed: {
    url() {
      return `${process.env.VUE_APP_API_URL}/spotify`
    }
  }
}
</script>

<style scoped>
#content {
  margin: 0px;
  min-height: 100vh;
}

#login-container {
  height: 100%;
  min-height: 90vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

a {
  height: 200px;
  width: 80%;
  max-width: 350px;
}

button {
  width: 100%;
  height: 100%;
  background-color: #1DB954;
  color: #FFFFFF;
  font-size: xx-large;
  border: 4px solid gainsboro;
  border-radius: 120px;
}
</style>
