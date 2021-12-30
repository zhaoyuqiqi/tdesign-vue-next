:: BASE_DOC ::

## API

### CountDown Props

| 名称  | 类型 | 默认值 | 说明| 必传 |
| ---- | ---- | --- | ----- | ---- |
| time    | String / Number | 0                                                 | 倒计时时间（单位 ms）。TS 类型：`string | number`。[通用类型定义](https://github.com/Tencent/tdesign-vue-next/blob/develop/src/common.ts) | N   |
| format        | String  | "HH:mm:ss"      | 时间格式                                          | N                                       |
| auto-start    | Boolean | true            | 是否自动倒计时                                    | N                                       |
| millisecond   | Boolean | false           | 是否开启毫秒级渲染                                | N                                       |
| inline        | Boolean | false           | 是否为行内元素                                    | N                                       |
| auto-pad-zero | Boolean | true            | 是否自动在左侧补 0 凑齐 2 位数（毫秒级为 3 位数） | N                                    |

### format 格式

| 格式 | 说明         |
| ---- | ------------ |
| DD   | 天数         |
| HH   | 小时         |
| mm   | 分钟         |
| ss   | 秒           |
| S    | 毫秒（1 位） |
| SS   | 毫秒（2 位） |
| SSS  | 毫秒（3 位） |

### CountDown Events

| 名称   | 参数                 | 描述             |
| ------ | -------------------- | ---------------- |
| finish | -                    | 倒计时结束时触发 |
| change | `timeData: TimeData` | 倒计时改变时触发 |

### TimeData 格式

| 名称         | 说明     | 类型   |
| ------------ | -------- | ------ |
| days         | 剩余天数 | number |
| hours        | 剩余小时 | number |
| minutes      | 剩余分钟 | number |
| seconds      | 剩余秒数 | number |
| milliseconds | 剩余毫秒 | number |

### CountDown 组件实例方法

| 名称  | 说明                       |
| ----- | -------------------------- |
| start | 开始计时                   |
| pause | 暂停计时                   |
| reset | 停止计时时间并恢复至初始值 |
