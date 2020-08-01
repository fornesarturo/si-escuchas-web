<template>
    <div>
      <div>
        Total: {{ total }}, Limit: {{ limit }}, Offset: {{ offset }}
      </div>
      <hr>
      <div class="tracks">
        <Track v-for="track in items" :key="track.id" v-bind="track">
          <template v-slot:actions>
            <button @click="$emit('select', track)">Play</button>
            <button @click="$emit('enqueue', track)">Add to Queue</button>
          </template>
        </Track>
      </div>
    </div>
</template>

<script>
import Track from "./Track.vue"

export default {
  name: "TrackList",
  components: { Track },
  props: {
    items: {
      type: Array,
      default: function() { return [] }
    },
    total: {
      type: Number,
      default: 0
    },
    limit: {
      type: Number,
      default: 0
    },
    offset: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {}
  },
  methods: {
  }
}
</script>

<style scoped>
.tracks {
  width: 100%;
  display: grid;
  grid-template-columns: minmax(300px, 600px);
  grid-auto-rows: 135px;
  justify-content: center;
  row-gap: 10px;
}

button {
  background-color: rgb(255, 206, 166);
  min-width: 80px;
  height: 25px;
  color: rgb(65, 65, 65);
  border-radius: 5px;
}
</style>
