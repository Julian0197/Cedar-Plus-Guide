<template>
  <div :class="nsInput.b()">
    <input
      ref="input"
      :type="type"
      @compositionstart="handleCompositionStart"
      @compositionupdate="handleCompositionUpdate"
      @compositionend="handleCompositionEnd"
      @input="handleInput"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, nextTick, onMounted, ref, shallowRef } from 'vue'
import { useNamespace } from '@msk/hooks'
import { UPDATE_MODEL_EVENT } from '@msk/constants'
import { inputEmits, inputProps } from './input'

defineOptions({
  name: 'ElInput',
})
const props = defineProps(inputProps)
const emit = defineEmits(inputEmits)

// input组件实例
const input = shallowRef<HTMLInputElement>()

const _ref = computed(() => input.value)

// 是否开启了中文输入法
const isComposing = ref(false)

// 拿到父组件中v-model传来的值
const nativeInputValue = computed(() =>
  !props.modelValue ? '' : String(props.modelValue)
)

// 根据父组件中v-model传来的值，改变子组件input实际展示的内容
const setNativeInputValue = () => {
  const input = _ref.value
  if (!input || input.value === nativeInputValue.value) return
  input.value = nativeInputValue.value
}

// 触发input事件，更新数据
const handleInput = async (event: Event) => {
  const { value } = event.target as any
  if (isComposing.value) return
  emit(UPDATE_MODEL_EVENT, value)
  await nextTick()
  setNativeInputValue()
}

const handleCompositionStart = (event: CompositionEvent) => {
  emit('compositionstart', event)
  isComposing.value = true
}
const handleCompositionUpdate = (event: CompositionEvent) => {
  emit('compositionupdate', event)
}
const handleCompositionEnd = (event: CompositionEvent) => {
  emit('compositionend', event)
  if (isComposing.value) {
    isComposing.value = false
    handleInput(event)
  }
}

// 组件渲染后，根据props的值设置表单值
onMounted(() => {
  setNativeInputValue()
})

// input命名空间（BEM）
const nsInput = useNamespace('input')
</script>
