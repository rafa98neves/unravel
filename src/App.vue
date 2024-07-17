<script setup lang="ts">
import { RouterView } from 'vue-router'

import Universe from '@/components/layout/Universe.vue'
</script>

<template>
  <Universe>
    <RouterView v-slot="{ Component }">
      <Transition appear>
        <component :is="Component" />
      </Transition>
    </RouterView>
  </Universe>
</template>

<style lang="scss" scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 1s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
