/* eslint-disable */

/**
 * 该文件为脚本自动生成文件，请勿随意修改。如需修改请联系 PMC
 * updated at 2021-12-29 10:41:30
 * */

 
 export interface TdCountDown {
   /**
    * 需要倒计时的毫秒数
    * @default 0
    */
   time?: number;
   /**
    * 时间格式
    * @default 'HH:mm:ss'
    */
    format?: string ;
   /**
    * 是否自动倒计时
    * @default true
    */
    autoStart?: boolean;
   /**
    * 是否开启毫秒级渲染
    * @default false
    */
    millisecond?: boolean;
    /**
     * 是否为行内元素
     * @default false
     */
     inline?:boolean,
     /**
      * 是否在左侧自动补0凑齐2位数（毫秒级为3位）
      * @default true
      */
     autoPadZero?:boolean
 }
 
export interface ITimeData {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
}