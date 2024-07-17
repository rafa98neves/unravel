<script setup lang="ts">
import { ref, computed } from 'vue'

import { VueFlow, useVueFlow, type NodeMouseEvent, type ViewportTransform } from '@vue-flow/core'
import { useMouseInElement, useDebounceFn, type MaybeElement } from '@vueuse/core'

import DescriptionPanel from '@/components/blocks/DescriptionPanel.vue'

import useCanvasRenderer from '@/composables/useCanvasRenderer'
import { useCanvasStore } from '@/stores/canvas'
import COLORS from '@/constants/colors'
import { DEFAULT_ZOOM, MAX_ZOOM, MIN_ZOOM, NODE_SIZE } from '@/constants/variables'
import { watch } from 'vue'

const flow = useVueFlow()

const { nodes, edges, ...render } = useCanvasRenderer()
const store = useCanvasStore()

const loading = ref(true)
const doubleClick = ref(false)
const showEnvironmentInfo = ref(false)

const debounceZoom = useDebounceFn(handleZoom, 5)

const selectedEnv = computed(() => {
  if (!render.selectedNode.value) return null
  return store.getEnvironment(render.selectedNode.value.id)
})

/**
 * Generates canvas based on current root node
 */
async function reGenerateCanvas() {
  document.documentElement.style.setProperty('--un-c-background', COLORS[store.currentLevel])
  document.documentElement.style.setProperty('--vf-node-bg', COLORS[store.currentLevel + 1])

  render.selectNode(null)
  render.resetNodes()
  render.convertToNode(store.currentBranch)

  flow.zoomTo(DEFAULT_ZOOM)
  setTimeout(() => flow.fitView({ padding: 0.25 }), 10)
}

/**
 ** Handlers
 */

function handleZoom(payload: ViewportTransform) {
  if ((!loading.value && payload.zoom >= MAX_ZOOM) || payload.zoom <= MIN_ZOOM) {
    if (payload.zoom >= MAX_ZOOM) {
      let element: MaybeElement

      const node = nodes.value.find(({ id }) => {
        element = document.querySelector(`[data-id="${id}"]`) as MaybeElement
        return !useMouseInElement(element).isOutside?.value
      })

      if (node) {
        store.goToEnvironment(node.id)
      }
    } else if (store.currentRoot) {
      store.goToEnvironment(store.currentRoot.id, true)
    }
  }
}

function onNodeClick(payload?: NodeMouseEvent) {
  if (!payload?.node) return

  setTimeout(() => {
    if (!doubleClick.value) {
      render.selectNode(payload.node)
      showEnvironmentInfo.value = !!payload
      setTimeout(() => flow.zoomTo(MIN_ZOOM * 1.5, { duration: 400 }))
    }
  }, 200)
}

function onNodeDoubleClick(payload: NodeMouseEvent) {
  doubleClick.value = true

  const {
    position: { x, y }
  } = payload.node

  loading.value = true
  flow.setCenter(x + NODE_SIZE, y + NODE_SIZE, { duration: 1000 })

  setTimeout(() => {
    store.goToEnvironment(payload.node.id)
    render.selectNode(null)
    loading.value = false
    doubleClick.value = false
  }, 700)
}

/**
 * Inititalization of the component
 */
store.init().then(() => {
  reGenerateCanvas()
  loading.value = false
})

watch(() => store.currentLevel, reGenerateCanvas)
</script>

<template>
  <div class="c-Canvas">
    <VueFlow
      :default-viewport="{ zoom: DEFAULT_ZOOM }"
      :max-zoom="MAX_ZOOM + 2"
      :min-zoom="MIN_ZOOM"
      :nodes="nodes"
      :edges="edges"
      @viewport-change="debounceZoom"
      @node-double-click="onNodeDoubleClick"
      @node-click="onNodeClick"
      @pane-click="onNodeClick()"
    />

    {{ selectedEnv }}

    <DescriptionPanel
      v-if="selectedEnv"
      v-model:visible="showEnvironmentInfo"
      :env="selectedEnv"
      @change="(id) => store.goToEnvironment(id, true)"
    />
  </div>
</template>

<style scoped lang="scss">
.c-Canvas {
  width: 100%;
  height: 100%;
}

.flow {
  min-width: 1280px;
}
</style>
