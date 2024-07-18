<script setup lang="ts">
import { reactive, watch, computed } from 'vue'

import { VueFlow, useVueFlow, type NodeMouseEvent, type ViewportTransform } from '@vue-flow/core'
import { useMouseInElement, useDebounceFn, type MaybeElement } from '@vueuse/core'

import DescriptionPanel from '@/components/blocks/DescriptionPanel.vue'

import useCanvasRenderer from '@/composables/useCanvasRenderer'
import { useCanvasStore } from '@/stores/canvas'
import { SHADOW_COLORS, COLORS } from '@/constants/colors'
import { DEFAULT_ZOOM } from '@/constants/variables'

const flow = useVueFlow()

const store = useCanvasStore()
const { nodes, edges, ...render } = useCanvasRenderer()

const state = reactive({
  isLoading: true,
  isDoubleClick: false,
  showEnvironmentInfo: false,
  defaultZoom: DEFAULT_ZOOM,
})

const debounceZoom = useDebounceFn(handleZoom, 5)

const minZoom = computed(() => {
  return Math.max(state.defaultZoom * 0.5, 0.1);
})

const maxZoom = computed(() => {
  return state.defaultZoom * 1.5
})

const selectedEnv = computed(() => {
  if (!render.selectedNode.value) return null
  return store.getEnvironment(render.selectedNode.value.id)
})

/**
 * Generates canvas based on current root node
 */
async function reGenerateCanvas() {
  document.documentElement.style.setProperty('--un-c-background', COLORS[store.currentLevel])
  document.documentElement.style.setProperty('--un-c-shadow', SHADOW_COLORS[store.currentLevel])
  document.documentElement.style.setProperty('--vf-node-bg', COLORS[store.currentLevel + 1])

  render.selectNode(null)
  render.resetNodes()
  render.convertToNode(store.currentBranch)

  setTimeout(() => {
    flow.fitView().then(() => {
      state.defaultZoom = flow.getViewport().zoom
    })
  }, 10)
}

/**
 ** Handlers
 */

function handleZoom(payload: ViewportTransform) {
  if ((!state.isLoading && payload.zoom >= maxZoom.value) || payload.zoom <= minZoom.value) {
    if (payload.zoom >= maxZoom.value) {
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
    if (!state.isDoubleClick) {
      render.selectNode(payload.node)
      state.showEnvironmentInfo = !!payload
      setTimeout(() => flow.zoomTo(minZoom.value * 1.5, { duration: 400 }))
    }
  }, 200)
}

function onNodeDoubleClick(payload: NodeMouseEvent) {
  state.isDoubleClick = true
  state.isLoading = true

  const {
    position: { x, y },
    dimensions: { width, height }
  } = payload.node

  flow.setCenter(x + width / 2, y + height / 2, { duration: 700 })

  setTimeout(() => {
    store.goToEnvironment(payload.node.id)
    render.selectNode(null)
    state.isLoading = false
    state.isDoubleClick = false
  }, 700)
}

/**
 * Watchers
 */

watch(() => state.showEnvironmentInfo, () => {
  if (!state.showEnvironmentInfo) {
    render.selectNode(null)
    setTimeout(() => flow.fitView({ duration: 400}))
  }
})

watch(() => store.currentLevel, reGenerateCanvas)

/**
 * Inititalization of the component
 */

store.init().then(() => {
  reGenerateCanvas()
  state.isLoading = false
})

</script>

<template>
  <div class="c-Canvas">
    <VueFlow
      :default-viewport="{ zoom: DEFAULT_ZOOM }"
      :max-zoom="maxZoom + 2"
      :min-zoom="minZoom"
      :nodes="nodes"
      :edges="edges"
      @viewport-change="debounceZoom"
      @node-double-click="onNodeDoubleClick"
      @node-click="onNodeClick"
      @pane-click="onNodeClick()"
    />

    <DescriptionPanel
      v-if="selectedEnv"
      v-model:visible="state.showEnvironmentInfo"
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
