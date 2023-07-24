<template>
  <i :class="bem.b()" :style="style" v-bind="$attrs">
    <slot />
  </i>
</template>

<script setup lang="ts">
import { useNamespace } from '@msk/hooks'
import { addUnit, isUndefined } from '@msk/utils'
import { computed } from 'vue';
import { iconProps } from './icon'
import type { CSSProperties } from 'vue'

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
