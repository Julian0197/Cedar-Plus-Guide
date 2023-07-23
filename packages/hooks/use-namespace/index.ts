import { computed, unref } from 'vue'
// 默认命名前缀
export const defaultNamespace = 'el'

export const useNamespace = (block: string) => {
    // 命名前缀也就是命名空间
    const namespace = computed(() => defaultNamespace)
    return {
        namespace,
    }
}
