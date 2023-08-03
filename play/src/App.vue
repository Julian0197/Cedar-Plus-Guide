<template>
  <div>
    <el-icon :size="20" :color="'green'"><EditIcon /></el-icon>
    <el-button ref="buttonRef" @click="handleClick">按钮测试</el-button>
    <el-button type="primary" :icon="Edit">props实现图标按钮</el-button>
    <el-button type="success" plain>Success</el-button>
    <el-button type="info" round>Info</el-button>
    <el-button type="warning" circle>Warning</el-button>
    <el-button type="danger" disabled>Danger</el-button>
    <el-button size="large">按钮</el-button>
    <el-button size="small">按钮</el-button>
    <!-- test button-group -->
    <div style="margin-top: 20px">
      <TestButtonGroup />
    </div>
    <el-input />
  </div>
</template>
<script lang="ts">
import { defineComponent, nextTick, ref } from 'vue'
import { Edit } from '@element-plus/icons-vue'
import EditIcon from './EditIcon.vue'
import TestButtonGroup from './TestButtonGroup.vue'

export default defineComponent({
  name: 'App',
  components: {
    EditIcon,
    TestButtonGroup,
  },

  setup() {
    const handleClick = (e: Event) => {
      console.log(e, 'event111')
    }
    const buttonRef = ref()
    nextTick(() => {
      console.log('buttonRef222', buttonRef.value.ref)
    })

    return {
      handleClick,
      buttonRef,
      Edit,
    }
  },
})
</script>
<style scoped></style>
