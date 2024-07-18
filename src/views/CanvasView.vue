<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue'

import Canvas from '@/components/sections/Canvas.vue'
import FloatingSearch from '@/components/blocks/FloatingSearch.vue'
import Tips from '@/components/blocks/Tips.vue'

import useShortcuts from '@/composables/useShortcuts'
import useDimensions from '@/composables/useDimensions'

const { onSearch, destroy } = useShortcuts()

const isVisible = ref(false)

onSearch(() => {
  isVisible.value = true
})

const { isBiggerOrEqualThan } = useDimensions()

onBeforeUnmount(destroy)
</script>

<template>
  <div class="c-CanvasView">
    <Tips v-if="isBiggerOrEqualThan('MD')" />
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
