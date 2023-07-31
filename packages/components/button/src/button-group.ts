import { buttonProps } from './button'

import type { ExtractPropTypes } from 'vue'
import type buttonGroup from './button-group.vue'

// 因为 size 和 type 属性和 Button 中的属性是一样的，所以可以进行复用
export const buttonGroupProps = {
  size: buttonProps.size,
  type: buttonProps.type,
} as const

export type ButtonGroupProps = ExtractPropTypes<typeof buttonGroupProps>
export type ButtonGroupInstance = InstanceType<typeof buttonGroup>
