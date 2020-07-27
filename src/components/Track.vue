<template>
  <div class="container" @click="$emit('clicked-track')">
    <img class="cover" :src="album.cover" width="100">
    <div class="name">
      {{name}}
    </div>
    <div class="artist">
      <i>{{artists[0].name}}</i>
    </div>
    <div class="info">
      {{album.name}} <b>{{duration}}</b>
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
  grid-column: 1 / -1;
  display: grid;
  width: 100%;
  /* margin-right: auto;
  margin-left: auto; */
  grid-template: repeat(3, 1fr) / repeat(3, minmax(100px, 1fr));
  /* padding: 20px 50px; */
  border: 1px solid gray;
}

.cover {
  display: block;
  grid-row: 1 / span 3;
  grid-column: 1 / 2;
  justify-self: center;
  align-self: center;
}

.name {
  grid-row: 1 / span 1;
  grid-column: 2 / 4;
  align-self: end;
  font-size: larger;
}

.artist {
  grid-row: 2 / span 1;
  grid-column: 2 / 4;
  align-self: end;
  font-size: medium;
}

.info {
  grid-row: 3 / span 1;
  grid-column: 2 / 4;
  align-self: start;
  font-size: small;
}
</style>
