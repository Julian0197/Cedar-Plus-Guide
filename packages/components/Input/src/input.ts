import { isString } from '@vueuse/core'
import { UPDATE_MODEL_EVENT } from '@msk/constants'
import type { ExtractPropTypes, PropType } from 'vue'
import type Input from './input.vue'

// 定义props
export const inputProps = {
  modelValue: {
    type: [String, Number, Object] as PropType<string | number | object>,
    default: '',
  },
  type: {
    type: String,
    default: 'text',
  },
} as const

// 内部props类型 => 外部，（constructorType => type）
export type InputProps = ExtractPropTypes<typeof inputProps>

export const inputEmits = {
  [UPDATE_MODEL_EVENT]: (value: string) => isString(value),
}

export type InputEmits = typeof inputEmits

export type InputInstance = InstanceType<typeof Input>