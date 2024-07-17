<script setup lang="ts">
import Drawer from 'primevue/drawer'

import HeritageTree from '@/components/blocks/HeritageTree.vue'
import EnvironmentExtra from '@/components/blocks/EnvironmentExtra.vue'

import type { Environment } from '@/constants/interfaces'
import { useCanvasStore } from '@/stores/canvas'

const store = useCanvasStore()

const props = defineProps<{ env: Environment }>()

function recursiveGetParent(parentId?: string, current: Environment[] = []) {
  if (!parentId) return current

  const parent = store.getEnvironment(parentId)

  if (parent) {
    current.unshift(parent)
    return recursiveGetParent(parent.parent, current)
  }

  return current
}

const parentEnvs = recursiveGetParent(props.env.id)
</script>

<template>
  <div>
    <Drawer v-bind="$attrs" :header="env.name.toUpperCase()" position="right" :modal="false">
      <div class="c-DescriptionPanel">
        <div class="c-DescriptionPanel__description" v-html="env.description" />
      </div>

      <template #footer>
        <div class="c-DescriptionPanel__footer">
          <EnvironmentExtra
            class="c-DescriptionPanel__extra"
            v-for="(extra, index) in env.extra"
            :extra="extra"
            :key="index"
          />
        </div>
      </template>
    </Drawer>

    <Drawer v-bind="$attrs" :modal="false" class="small transparent" v-if="parentEnvs.length > 1">
      <template #container>
        <HeritageTree v-bind="$attrs" class="c-DescriptionPanel__tree" :parents="parentEnvs" />
      </template>
    </Drawer>
  </div>
</template>

<style scoped lang="scss">
.c-DescriptionPanel {
  display: flex;
  flex-direction: column;
  height: 100%;

  hr {
    opacity: 0.1;
    border-radius: 20%;
    width: 100%;
    border-color: var(--un-c-white-soft);
    margin-top: auto;
    margin-bottom: 1rem;
  }

  &__extra {
    margin: 1rem 0;
  }

  &__description {
    text-transform: none;
    font-weight: 400;
    margin: 3rem 0;
  }

  &__tree {
    margin-top: 5rem;
    margin-left: 1rem;
  }
}
</style>
