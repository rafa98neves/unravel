<script setup lang="ts">
import type { Environment } from '@/constants/interfaces'
import { capitalize } from '@/helpers/common'
import colors from '@/constants/colors'

defineProps<{ parents: Environment[] }>()

const emit = defineEmits<{ (e: 'change', id: string): void }>()

function onClick(id: string) {
  emit('change', id)
}
</script>

<template>
  <div class="c-HeirtageTree">
    <div v-for="{ id, name, level } in parents" :key="id">
      <div class="c-HeirtageTree__text" @click="onClick(id)">
        <span class="indicator" :style="{ backgroundColor: colors[level] }" />
        {{ capitalize(name) }}
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.c-HeirtageTree {
  &__text {
    cursor: pointer;
    display: inline-flex;
    flex-wrap: nowrap;
    align-items: center;
    font-size: 0.8rem;
    color: var(--un-c-white-mute);
    opacity: 0.8;

    .indicator {
      height: 1.6rem;
      min-width: 1.6rem;
      border: 1px solid var(--un-c-black);
      border-radius: 50%;
      box-shadow: inset -0.1px -0.1px 0.1rem 0rem var(--un-c-white-mute);
      margin: 0.5rem 4px;
    }
  }

  :not(:last-child):after {
    content: '';
    display: block;
    width: 0;
    height: 2rem;
    margin: 0.5rem 1rem;
    border-left: 1px solid var(--un-c-grey);
    border-radius: 1rem;
  }
}
</style>
