<template>
  <div class="container" @click="$emit('clicked-track')">
    <div class="actions">
      <slot name="actions"></slot>
    </div>
    <img class="cover" :src="album.cover" width="100">
    <div class="name">
      {{name}}
    </div>
    <div class="artist">
      <i class="artist-name">{{artists[0].name}}</i><i class="explicit" v-if="explicit"> *explicit</i>
    </div>
    <div class="info">
      <span class="text-truncate">{{album.name}}</span> <b>{{duration}}</b>
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
    },
    explicit: {
      type: Boolean,
      default: false
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
.text-truncate {
   display: inline-flex;
   max-width: 150px;
   white-space: nowrap;
   overflow: hidden;
   text-overflow: ellipsis;
}

.container {
  grid-column: 1 / -1;
  display: grid;
  width: 100%;
  /* margin-right: auto;
  margin-left: auto; */
  grid-template: repeat(3, 1fr) minmax(0px, 1fr) / repeat(3, minmax(100px, 1fr));
  /* padding: 20px 50px; */
  border: 1px solid gray;
}

.actions {
  grid-column: 2 / span 2;
  grid-row: 4 / span 1;
  justify-self: center;
  align-self: center;
  min-height: 0px;
}

.cover {
  display: block;
  grid-row: 1 / span 4;
  grid-column: 1 / span 1;
  justify-self: center;
  align-self: center;
}

.name {
  grid-row: span 1;
  grid-column: 2 / span 2;
  align-self: end;
  font-size: larger;
}

.artist {
  grid-row: span 1;
  grid-column: 2 / span 2;
  align-self: end;
  font-size: medium;
}

.artist-name {
  font-size: medium;
}

.explicit {
  font-size: smaller;
}

.info {
  grid-row: span 1;
  grid-column: 2 / span 2;
  align-self: start;
  font-size: small;
}
</style>
