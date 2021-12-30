import { ComponentPublicInstance } from 'vue';
import { emitEvent } from '../utils/event';
import { ITimeData } from './type';

// 毫秒级渲染
export function microTick(vm: ComponentPublicInstance) {
  // 结束时间减当前时间就是剩余时间
  const remain = Math.max(vm.endTime - Date.now(), 0);
  // 如果剩余时间大于0那么就一直进行倒计时
  setRemainTime(vm, remain);
  // 如果还没有倒计时完成
  if (remain > 0) {
    vm.frameId = window.requestAnimationFrame(() => {
      microTick(vm);
    });
  }
}

// 秒级渲染
export function macroTick(vm: ComponentPublicInstance) {
  // 结束时间减当前时间就是剩余时间
  const remain = Math.max(vm.endTime - Date.now(), 0);
  // 判断是否是同一秒
  const isSameTime = Math.floor(remain / 1000) === Math.floor(vm.remain / 1000);
  // 如果不是同一秒或者倒计时时间为0了那么就设置时间
  if (!isSameTime || remain / 1000 === 0) {
    setRemainTime(vm, remain);
  }
  // 如果还没有倒计时完成
  if (vm.remain > 0 && vm.counting) {
    vm.frameId = window.requestAnimationFrame(() => {
      macroTick(vm);
    });
  }
}

/**
 *
 * @param remain {Number} 倒计时的毫秒数
 */
function setRemainTime(vm: ComponentPublicInstance, remain: number) {
  vm.remain = remain;
  // 抛出事件当前时间改变
  // 秒级渲染在0-1秒时会更新两次一次是不到1秒，一次是0毫秒时
  emitEvent(vm, 'change', vm.timeData);
  if (vm.remain === 0) {
    // 倒计时结束
    vm.pause();
    emitEvent(vm, 'finish', undefined);
  }
}

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
// 解析时间，将毫秒值解析为timeData格式
export function parseTime(time: number): ITimeData {
  const days = Math.floor(time / DAY);
  const hours = Math.floor((time % DAY) / HOUR);
  const minutes = Math.floor((time % HOUR) / MINUTE);
  const seconds = Math.floor((time % MINUTE) / SECOND);
  const milliseconds = Math.floor(time % SECOND);
  return {
    days,
    hours,
    minutes,
    seconds,
    milliseconds,
  };
}
// 格式化时间
export function formatTime(vm: ComponentPublicInstance, format: string, timeData: ITimeData): string {
  const { days } = timeData;
  let { hours } = timeData;
  let { minutes } = timeData;
  let { seconds } = timeData;
  let { milliseconds } = timeData;

  // eslint-disable-next-line no-bitwise
  if (!~format.indexOf('DD')) {
    hours += days * 24;
  } else {
    format = format.replace('DD', padZero(vm, days.toString()));
  }

  // eslint-disable-next-line no-bitwise
  if (!~format.indexOf('HH')) {
    minutes += hours * 60;
  } else {
    format = format.replace('HH', padZero(vm, hours.toString()));
  }

  // eslint-disable-next-line no-bitwise
  if (!~format.indexOf('mm')) {
    seconds += minutes * 60;
  } else {
    format = format.replace('mm', padZero(vm, minutes.toString()));
  }

  // eslint-disable-next-line no-bitwise
  if (!~format.indexOf('ss')) {
    milliseconds += seconds * 1000;
  } else {
    format = format.replace('ss', padZero(vm, seconds.toString()));
  }

  // eslint-disable-next-line no-bitwise
  if (~format.indexOf('S')) {
    const ms = padZero(vm, milliseconds.toString(), 3);

    // eslint-disable-next-line no-bitwise
    if (~format.indexOf('SSS')) {
      format = format.replace('SSS', ms);
      // eslint-disable-next-line no-bitwise
    } else if (~format.indexOf('SS')) {
      format = format.replace('SS', ms.slice(0, 2));
    } else {
      format = format.replace('S', ms.charAt(0));
    }
  }

  return format;
}
// 左侧补0
function padZero(vm: ComponentPublicInstance, time: string, len = 2): string {
  if (vm.autoPadZero) return time.padStart(len, '0');
  return time;
}
