<template>
  <i :class="bem.b()">
    <slot />
  </i>
</template>

<script setup lang="ts">
import { useNamespace } from '@msk/hooks'
const bem = useNamespace('icon')
</script>
