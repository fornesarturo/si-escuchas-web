<template>
  <div>
    <p>Enter channel ID:</p>
    <input v-if="channelId == ''" v-model="localChannelId" type="text" placeholder="Channel ID">
    <input v-else v-model="channelId" disabled type="text" placeholder="Channel ID">
    <div v-if="channelId == ''">
      <button @click="connect()">Connect</button>
      <button @click="create()">Create</button>
    </div>
    <div v-else>
      <button @click="disconnect()">Disconnect</button>
    </div>
  </div>
</template>

<script>

export default {
  name: "ChannelConnection",
  mixins: [],
  data() {
    return {
      localChannelId: ""
    }
  },
  computed: {
    channelId: {
      get() {
        return this.$store.getters.channelId
      },
      set(value) {
        this.$store.commit("setChannelId", value)
      }
    }
  },
  methods: {
    connect() {
      this.$store.dispatch("connect", this.localChannelId)
    },
    create() {
      this.$store.dispatch("create", this.localChannelId)
    },
    disconnect() {
      this.$store.dispatch("disconnect")
    }
  }
}
</script>

<style scoped>
input {
  width: 80%;
  max-width: 200px;
  height: 20px;
  background-color: palegoldenrod;
  color: darkslategrey;
  font-size: medium;
  text-align: center;
  border-radius: 5px;
}

button {
  background-color: rgb(255, 206, 166);
  min-width: 80px;
  height: 25px;
  color: rgb(65, 65, 65);
  border-radius: 5px;
}
</style>
