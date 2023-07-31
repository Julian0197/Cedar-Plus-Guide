<template>
  <button
    ref="_ref"
    :class="[
      ns.b(),
      ns.m(_type),
      ns.m(_size),
      ns.is('disabled', disabled),
      ns.is('plain', plain),
      ns.is('round', round),
      ns.is('circle', circle),
    ]"
    :disabled="disabled"
    :autofocus="autofocus"
    :type="nativeType"
    @click="handleClick"
  >
    <template v-if="loading">
      <slot v-if="$slots.loading" name="loading" />
      <el-icon v-else :class="ns.is('loading')">
        <component :is="loadingIcon"
      /></el-icon>
    </template>
    <!-- 优先通过loading属性 -->
    <el-icon v-else-if="icon || $slots.icon">
      <component :is="icon" v-if="icon" />
      <slot v-else name="icon" />
    </el-icon>
    <slot />
  </button>
</template>
<script lang="ts" setup>
import { computed, inject, ref } from 'vue'
import { useNamespace } from '@msk/hooks'
import { buttonGroupContextKey } from '@msk/tokens'
import { buttonEmits, buttonProps } from './button'

// 定义组件名称
defineOptions({
  name: 'ElButton',
})
// 定义 Props
const props = defineProps(buttonProps)
// 使用 inject 取出祖先组件提供的依赖(inject第二个参数是一个默认值)
const buttonGroupContext = inject(buttonGroupContextKey, undefined)
// 使用 computed 进行缓存计算
const _size = computed(() => props.size || buttonGroupContext?.size)
const _type = computed(() => props.type || buttonGroupContext?.type || '')
// 定义 emit
const emit = defineEmits(buttonEmits)
// classname 的 BEM 命名
const ns = useNamespace('button')
// 按钮 html 元素
const _ref = ref<HTMLButtonElement>()
// 点击事件函数
const handleClick = (evt: MouseEvent) => {
  emit('click', evt)
}

// 组件暴露自己的属性以及方法，去供外部使用
defineExpose({
  ref: _ref,
})
</script>
