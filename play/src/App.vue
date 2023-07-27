<template>
  <div>
    <el-icon :size="20" :color="'green'"><EditIcon /></el-icon>
    <el-button @click="handleClick">按钮</el-button>
    <el-button type="primary">Primary</el-button>
    <el-button type="success" plain>Success</el-button>
    <el-button type="info" round>Info</el-button>
    <el-button type="warning" circle>Warning</el-button>
    <el-button type="danger" disabled>Danger</el-button>
    <el-button size="large">按钮</el-button>
    <el-button size="small">按钮</el-button>
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

  setup() {
    const handleClick = (e: Event) => {
      console.log(e, 'event')
    }

    return {
      handleClick,
    }
  },
})
</script>
<style scoped></style>
