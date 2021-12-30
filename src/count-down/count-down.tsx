import { defineComponent } from 'vue';
import { prefix } from '../config';
import props from './props';
import { formatTime, macroTick, microTick, parseTime } from './utils';

const name = `${prefix}-count-down`;

export default defineComponent({
  name,

  components: {},

  props: { ...props },

  emits: ['finish', 'change'],

  data() {
    return {
      // 结束时间
      endTime: 0,
      // 剩余时间
      remain: 0,
      // 是否正在倒计时
      counting: false,
      frameId: null,
      keepAlivePaused: false,
    };
  },

  computed: {
    timeData() {
      return parseTime(this.remain);
    },

    formattedTime() {
      return formatTime(this, this.format, this.timeData);
    },
  },

  watch: {
    time: {
      handler(nval) {
        if (typeof nval !== 'number') {
          throw new Error(`time Expect a numeric type but get a ${typeof nval}  type`);
        }
        this.pause();
        this.remain = nval;
        // 如果自动开始那么就调用start
        if (this.autoStart) {
          this.start();
        }
      },
      immediate: true,
    },
  },
  unmounted() {
    this.pause();
  },
  activated() {
    // 如果开启了路由缓存标识
    if (this.keepAlivePaused) {
      this.counting = true;
      this.keepAlivePaused = false;
      if (this.millisecond) {
        microTick(this);
      } else {
        macroTick(this);
      }
    }
  },
  deactivated() {
    if (this.counting) {
      this.pause();
      // 开启了路由缓存标识
      this.keepAlivePaused = true;
    }
  },
  methods: {
    /**
     *
     * @returns {void}
     */
    start(): void {
      // 如果正在倒计时那么什么都不做
      if (this.counting) return;
      this.counting = true;
      this.endTime = Date.now() + this.remain;
      // 如果开启了毫秒级渲染就进行毫秒级渲染
      if (this.millisecond) {
        microTick(this);
      } else {
        macroTick(this);
      }
    },
    /**
     * 暂停
     */
    pause() {
      window.cancelAnimationFrame(this.frameId);
      this.counting = false;
    },
    /**
     * 重置按钮，倒计时时间重置为倒计时初始值
     */
    reset() {
      this.pause();
      this.remain = this.time;
    },
  },
  render() {
    const { default: defaultSlot } = this.$slots;

    return (
      <div style={this.inline ? 'display:inline-block;' : 'display:block;'} class={`${name}`}>
        {(defaultSlot && defaultSlot(this.timeData)) || this.formattedTime}
      </div>
    );
  },
});
