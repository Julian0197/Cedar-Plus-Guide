import { withInstall } from '@msk/utils'
import Icon from './src/icon.vue'
// 通过 withInstall 方法给 Icon 添加了一个 install 方法
const ElIcon = withInstall(Icon)
// 可以通过 app.use 来使用，也可以通过 import 方式单独使用
export default ElIcon
// 导出 Icon 组件的 props
export * from './src/icon'
