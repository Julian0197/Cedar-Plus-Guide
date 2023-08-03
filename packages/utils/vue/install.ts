import { noop } from '@vueuse/core'
import type { Plugin } from 'vue'

// 通过 Vue 提供的 Plugin 类型和传进来的组件类型 T 的集合进行确定我们的组件类型具有 Plugin 类型方法，如 install 方法
export type SFCWithInstall<T> = T & Plugin
export const withInstall = <T, E extends Record<string, any>>(
  main: T,
  extra?: E
) => {
  ;(main as SFCWithInstall<T>).install = function (app): void {
    // 组件的注册名称参数暂时是写死了 ElIcon，在后面的小节，我们再详细说明如何进行设置动态组件名称
    // app.component('ElIcon', comp as SFCWithInstall<T>)

    // 动态设置组件名称
    // ?? 判断是不是null或者undefined
    for (const comp of [main, ...Object.values(extra ?? {})]) {
      app.component(comp.name, comp)
    }
  }
  if (extra) {
    for (const [key, comp] of Object.entries(extra)) {
      // 可以通过基础组件访问同组别的其他组件
      // 例如：ElButton.ButtonGroup 同样可减少用户需要手动引用的代码量
      ;(main as any)[key] = comp
    }
  }
  return main as SFCWithInstall<T> & E
}

export const withNoopInstall = <T>(component: T) => {
  // NOOP 其实就是 () => void 表示不返回任何内容的函数
  ;(component as SFCWithInstall<T>).install = noop

  return component as SFCWithInstall<T>
}
