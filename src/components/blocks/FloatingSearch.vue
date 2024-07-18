<script setup lang="ts">
import { ref, defineEmits, onMounted } from 'vue'

import Dialog from 'primevue/dialog'
import Listbox, { type ListboxFilterEvent } from 'primevue/listbox'

import { onClickOutside } from '@vueuse/core'

import { useCanvasStore } from '@/stores/canvas'
import { computed } from 'vue'
import type { FormOption } from '@/constants/interfaces'

const store = useCanvasStore()

const emit = defineEmits(['update:visible'])

const dialogRef = ref(null)

const filter = ref('')

const options = computed(() => {
  if (filter.value.length <= 0) return []

  let options: FormOption[] = []

  Object.values(store.nodeTree).forEach((branch) => {
    options = options.concat(branch.map((val) => ({ name: val.name, value: val.id })))
  })

  return options.filter((opt) => opt.name.toLowerCase().includes(filter.value.toLowerCase()))
})

function onSelect(payload: { value: FormOption }) {
  store.goToEnvironment(payload.value.value)
}

onClickOutside(dialogRef, () => emit('update:visible', false))

function onShown() {
  const inputEl = document.querySelector('[data-pc-name="pcfilter"]') as HTMLInputElement
  if (inputEl) inputEl.focus()
}

function onFilter(event: ListboxFilterEvent) {
  filter.value = event.value
}
</script>

<template>
  <Dialog
    v-bind="$attrs"
    @show="onShown"
    :style="{ width: '30vw' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
  >
    <template #container>
      <Listbox
        ref="dialogRef"
        optionLabel="name"
        filter-placeholder="Search for a system..."
        :options="options"
        filter
        @filter="onFilter"
        @change="onSelect"
      />
    </template>
  </Dialog>
</template>
