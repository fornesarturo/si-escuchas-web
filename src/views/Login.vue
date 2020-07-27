<template>
  <div>
    <a :href="url">
      <button>Inicia Sesión con Spotify</button>
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
