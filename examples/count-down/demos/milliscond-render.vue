<template>
  <div>
    <t-count-down :time="time" millisecond format="DD:HH:mm:ss:SSS"> </t-count-down>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  setup() {
    const time = ref(30 * 60 * 1000);
    return { time };
  },
});
</script>
