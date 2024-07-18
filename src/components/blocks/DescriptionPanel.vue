<script setup lang="ts">
import { computed } from 'vue'

import Drawer from 'primevue/drawer'

import HeritageTree from '@/components/blocks/HeritageTree.vue'
import EnvironmentExtra from '@/components/blocks/EnvironmentExtra.vue'

import type { Environment } from '@/constants/interfaces'
import { useCanvasStore } from '@/stores/canvas'
import useDimensions from '@/composables/useDimensions'

const store = useCanvasStore()

const props = defineProps<{ env: Environment }>()

const { isSmallerThan, isBiggerOrEqualThan } = useDimensions()

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

const position = computed(() => {
  return isSmallerThan('LG') ? 'full' : 'right'
})
</script>

<template>
  <div>
    <Drawer :header="env.name.toUpperCase()" :position="position" :modal="false" v-bind="$attrs">
      <div class="c-DescriptionPanel">
        <div class="c-DescriptionPanel__description" v-html="env.description" />
      </div>

      <template #footer>
        <div class="c-DescriptionPanel__footer">
          <HeritageTree
            v-if="isSmallerThan('MD') && parentEnvs.length > 1"
            class="c-DescriptionPanel__tree-stripped"
            :parents="parentEnvs"
            v-bind="$attrs"
          />
          <EnvironmentExtra
            class="c-DescriptionPanel__extra"
            v-for="(extra, index) in env.extra"
            :extra="extra"
            :key="index"
          />
        </div>
      </template>
    </Drawer>

    <Drawer
      v-if="isBiggerOrEqualThan('MD') && parentEnvs.length > 1"
      class="small transparent"
      :modal="false"
      v-bind="$attrs"
    >
      <template #container>
        <HeritageTree class="c-DescriptionPanel__tree" :parents="parentEnvs" v-bind="$attrs" />
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

    &-stripped {
      margin-bottom: 2rem;
      margin-left: 0;
    }
  }
}
</style>
