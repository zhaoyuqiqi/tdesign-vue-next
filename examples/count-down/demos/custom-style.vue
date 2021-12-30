<template>
  <div>
    <t-count-down :time="time">
      <template #default="timeData">
        <div class="container">
          <div class="days">{{ timeData.days }}天</div>
          <div class="hours">{{ timeData.hours }}时</div>
          <div class="minutes">{{ timeData.minutes }}分</div>
          <div class="seconds">{{ timeData.seconds }}秒</div>
        </div>
      </template>
    </t-count-down>
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
<style lang="less" scoped>
.container {
  display: flex;
  line-height: 50px;
  text-align: center;
  color: #fff;
  div {
    width: 50px;
    height: 50px;
    background-color: #e34d59;
    border-radius: 10px;
    &.hours,
    &.minutes {
      border-radius: 50%;
      margin: 0 20px;
    }
  }
}
</style>
