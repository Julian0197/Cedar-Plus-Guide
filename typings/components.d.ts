import type Icon from '@msk/components/icon'
// For this project development
import '@vue/runtime-core'

export {}

// 用`declare module`语法声明了一个模块，指定了模块的路径`'*.vue'`，表示所有的`.vue`文件都可以在该模块内使用。
declare module '@vue/runtime-core' {
  // GlobalComponents for Volar
  export interface GlobalComponents {
    ElIcon: typeof Icon
  }
}
