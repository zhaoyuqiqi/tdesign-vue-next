<template>
  <div>
    <t-count-down :time="time" format="DD天HH时mm分ss秒"> </t-count-down>
    <br />
    <p>可使用“auto-pad-zero”属性来控制是否在左侧自动补0凑齐2位数（毫秒级为3位数）</p>
    <br />
    <t-count-down :time="time" :auto-pad-zero="false" format="DD天HH时mm分ss秒"> </t-count-down>
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
