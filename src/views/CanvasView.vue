<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue'

import Canvas from '@/components/sections/Canvas.vue'
import FloatingSearch from '@/components/blocks/FloatingSearch.vue'

import useShortcuts from '@/composables/useShortcuts'

const { onSearch, destroy } = useShortcuts()

const isVisible = ref(false)

onSearch(() => {
  isVisible.value = true
})

onBeforeUnmount(destroy)
</script>

<template>
  <div class="c-CanvasView">
    <FloatingSearch v-model:visible="isVisible" />
    <Canvas />
  </div>
</template>

<style lang="scss" scoped>
.c-CanvasView {
  width: 100%;
  height: 100%;
}
</style>
