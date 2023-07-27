<template>
  <!-- v-bind="$attrs"是Vue.js中的一个特殊指令，用于将组件实例的父组件传递的所有非props属性绑定到子组件的根元素上。 -->
  <i :class="bem.b()" :style="style" v-bind="$attrs">
    <slot />
  </i>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useNamespace } from '@msk/hooks'
import { addUnit, isUndefined } from '@msk/utils'
import { iconProps } from './icon'
import type { CSSProperties } from 'vue'

defineOptions({
  name: 'ElIcon',
})
const style = computed<CSSProperties>(() => {
  if (!props.size && !props.color) return {}

  return {
    fontSize: isUndefined(props.size) ? undefined : addUnit(props.size),
    '--color': props.color,
  }
})

const props = defineProps(iconProps)
const bem = useNamespace('icon')
</script>
