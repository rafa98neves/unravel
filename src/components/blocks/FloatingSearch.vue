<script setup lang="ts">
import { ref, defineEmits } from 'vue'

import Dialog from 'primevue/dialog'
import Listbox from 'primevue/listbox'

import { onClickOutside } from '@vueuse/core'

import { useCanvasStore } from '@/stores/canvas'
import { computed } from 'vue'
import type { FormOption } from '@/constants/interfaces'

const store = useCanvasStore()

const emit = defineEmits(['update:visible'])

const dialogRef = ref(null)

const options = computed(() => {
  let options: FormOption[] = []

  Object.values(store.nodeTree).forEach((branch) => {
    options = options.concat(branch.map((val) => ({ name: val.name, value: val.id })))
  })

  return options
})

function onSelect(payload: { value: FormOption }) {
  store.goToEnvironment(payload.value.value)
}

onClickOutside(dialogRef, () => emit('update:visible', false))
</script>

<template>
  <Dialog
    v-bind="$attrs"
    :style="{ width: '30vw' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
  >
    <template #container>
      <Listbox
        filter
        ref="dialogRef"
        optionLabel="name"
        filter-placeholder="Search for a system..."
        :options="options"
        @change="onSelect"
      />
    </template>
  </Dialog>
</template>
