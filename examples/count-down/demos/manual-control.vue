<template>
  <div class="tdesign-demo-block-column">
    <div class="tdesign-demo-block-row">
      <t-count-down ref="countDown" :auto-start="false" :time="time" format="DD天HH时mm分ss秒"> </t-count-down>
    </div>
  </div>
  <div class="tdesign-demo-block-column" style="margin-top: 20px">
    <div class="tdesign-demo-block-row">
      <t-button theme="primary" @click="start">开始</t-button>
      <t-button theme="danger" @click="pause">暂停</t-button>
      <t-button theme="success" @click="reset">重置</t-button>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  setup() {
    const countDown = ref(null);
    const time = ref(30 * 60 * 60);
    function start() {
      countDown.value.start();
    }
    function pause() {
      countDown.value.pause();
    }
    function reset() {
      countDown.value.reset();
    }
    return {
      start,
      countDown,
      pause,
      reset,
      time,
    };
  },
});
</script>
