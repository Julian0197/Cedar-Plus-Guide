import { withInstall } from '@msk/utils'
import Button from './src/button.vue'
// 通过 withInstall 方法给 Icon 添加了一个 install 方法
const ELButton = withInstall(Button)
// 可以通过 app.use 来使用，也可以通过 import 方式单独使用
export default ELButton
// 导出 Button 组件的 props
export * from './src/button'
