<template>
  <div>
    <el-icon :size="20" :color="'green'"><EditIcon /></el-icon>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import EditIcon from './EditIcon.vue'

export default defineComponent({
  name: 'App',
  components: {
    EditIcon,
  },
})
</script>
<style scoped></style>
