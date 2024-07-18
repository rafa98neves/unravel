<script setup lang="ts">
import { PrimeIcons } from '@primevue/core/api'

const TIPS = [{ label: 'Open search', shortcut: ['Ctrl ⌘', 'P'] }]
</script>

<template>
  <div class="c-Tips">
    <div v-for="{ label, shortcut } in TIPS" :key="label">
      <i :class="PrimeIcons.SEARCH" />
      <span class="c-Tips__key" v-for="key in shortcut" :key="key">
        {{ key }}
      </span>
      <span class="c-Tips__label"> {{ label }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.c-Tips {
  z-index: 2;
  position: fixed;
  bottom: 2rem;
  left: 2rem;

  &__label {
    font-size: 10px;
    white-space: nowrap;
    overflow: hidden;
    width: 0;
  }

  &__key {
    font-size: 8px;
    border: 1px solid var(--un-c-white-mute);
    border-radius: 4px;
    padding: 0.3rem 0.6rem;
    text-align: center;
  }

  div {
    transition: all 0.5s;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    opacity: 0.2;
    gap: 1rem;

    &:hover {
      opacity: 1;

      .c-Tips__label {
        width: auto;
      }
    }
  }
}
</style>
