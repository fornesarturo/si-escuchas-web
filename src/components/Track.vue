<template>
  <div class="container" @click="$emit('clicked-track')">
    <img class="cover" :src="album.cover" width="100">
    <div class="name">
      {{name}}
    </div>
    <div class="info">
      <i>{{artists[0].name}}</i> {{album.name}} <b>{{duration}}</b>
    </div>
  </div>
</template>

<script>

export default {
  name: "Track",
  props: {
    id: {
      type: String,
      default: ""
    },
    name: {
      type: String,
      default: ""
    },
    uri: {
      type: String,
      default: ""
    },
    duration: {
      type: String,
      default: ""
    },
    externalUrl: {
      type: String,
      default: ""
    },
    artists: {
      type: Array,
      default: function() { return [] }
    },
    album: {
      type: Object,
      default: function() { return {} }
    }
  },
  data() {
    return {
      tracks: [],
      total: 0,
      limit: 0,
      offset: 0
    }
  },
  methods: {
  }
}
</script>

<style lang="css" scoped>
.container {
  display: grid;
  width: 600px;
  margin-right: auto;
  margin-left: auto;
  grid-template: repeat(2, 1fr) / repeat(2, 1fr);
  padding: 20px 50px;
  border: 1px solid gray;
  margin-bottom: 10px
}

.cover {
  display: block;
  grid-row: 1 / span 2;
  grid-column: 1 / 2;
  justify-self: center;
}

.name {
  grid-row: 1 / span 1;
  grid-column: 2 / 3;
  align-self: end;
  font-size: larger;
}

.info {
  grid-row: 2 / span 1;
  grid-column: 2 / 3;
  align-self: start;
}
</style>
