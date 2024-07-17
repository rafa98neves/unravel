<script setup lang="ts">
import { EXTRA_TYPE, type EnvironmentExtra } from '@/constants/interfaces'

defineProps<{ extra: EnvironmentExtra }>()
</script>

<template>
  <div class="c-EnvironmentExtra">
    <a :href="extra.value" v-if="extra.type === EXTRA_TYPE.LINK" target="_blank">
      {{ extra.label }}
    </a>

    <template v-else-if="extra.type === EXTRA_TYPE.VERSION">
      <b> Current version</b>: {{ extra.value }}
    </template>

    <template v-else-if="extra.type === EXTRA_TYPE.EMAIL">
      <a :href="`mailto:${extra.value}`"> {{ extra.label }}</a>
    </template>
  </div>
</template>
