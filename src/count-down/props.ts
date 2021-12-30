/* eslint-disable */

/**
 * 该文件为脚本自动生成文件，请勿随意修改。如需修改请联系 PMC
 * updated at 2021-12-29 10:41:30
 * */

 import { TdCountDown } from './type';
 import { PropType } from 'vue';
 
 export default {
   /** 需要倒计时的毫秒数*/
   time: {
     type: Number as PropType<TdCountDown['time']>,
     default: '',
   },
   /** 时间格式 */
   format: {
     type: String as PropType<TdCountDown['format']>,
     default:'HH:mm:ss',
   },
   /** 是否自动倒计时*/
   autoStart: {
     type: Boolean as PropType<TdCountDown['autoStart']>,
     default: true,
   },
   /** 是否开启毫秒级渲染 */
   millisecond: {
     type: Boolean as PropType<TdCountDown['millisecond']>,
     default: false,
   },
  /**是否为行内元素 */
   inline:{
     type:Boolean as PropType<TdCountDown['inline']>,
     default:false
   },
   /**是否为在左侧自动补0补起2位（毫秒级为3位） */
   autoPadZero:{
     type:Boolean as PropType<TdCountDown['autoPadZero']>,
     default:true
   }
 };
 