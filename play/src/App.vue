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
    <!-- test input -->
    <el-input v-model="state" />
  </div>
</template>
<script lang="ts">
import { defineComponent, nextTick, ref, watch } from 'vue'
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
    // test button
    const handleClick = (e: Event) => {
      console.log(e, 'event111')
    }
    const buttonRef = ref()
    nextTick(() => {
      console.log('buttonRef222', buttonRef.value.ref)
    })

    // test input
    const state = ref('MSK')
    watch(
      () => state.value,
      (newVal) => {
        console.log('state值：', newVal)
      }
    )

    return {
      handleClick,
      buttonRef,
      Edit,
      state,
    }
  },
})
</script>
<style scoped></style>
