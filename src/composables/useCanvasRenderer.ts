import { ref, computed, type Ref } from 'vue'
import type { DefaultEdge, Node } from '@vue-flow/core'

import type { Environment } from '@/constants/interfaces'
import { createEdge, createNode } from '@/helpers/canvas'
import { NODE_SIZE } from '@/constants/variables'

import * as dagre from 'dagre'
import colors from '@/constants/colors'

function calculateSizes(childrens = 0) {
  const multiplier = Math.min(5, 1 + childrens / 2)
  const size = NODE_SIZE * multiplier
  const width = `${size}px`
  const fontSize = `${size / 18}px`
  return { size, width, fontSize }
}

export default function useCanvasRenderer() {
  const nodes = ref<Node[]>([])
  const edges = ref<DefaultEdge[]>([])

  const selectedNode = ref<Node | null>(null)

  const selectedNodeId = computed(() => {
    return selectedNode.value?.id
  })

  function resetNodes() {
    nodes.value = []
    edges.value = []
  }

  function arrangeGraph(_nodes: Ref<Node[]>, _edges: Ref<DefaultEdge[]>) {
    const graph = new dagre.graphlib.Graph()
    graph.setGraph({})
    graph.setDefaultEdgeLabel(() => ({}))

    _nodes.value.forEach((node) => graph.setNode(node.id, node))
    _edges.value.forEach((edge) => graph.setEdge(edge.source, edge.target))

    dagre.layout(graph)

    graph.nodes().forEach((nodeId) => {
      const targetNode = _nodes.value.find((n) => n.id === nodeId)

      if (targetNode) {
        const node = graph.node(nodeId)
        const nodeIncrement = ((targetNode.width as number) ?? 1) / 2
        const x = node.x * 4 - nodeIncrement
        const y = node.y * 11 - nodeIncrement

        targetNode.position = { x, y }
      }
    })

    return [nodes, edges]
  }

  function convertToNode(environments: Environment[]) {
    const _nodes = ref<Node[]>([])
    const _edges = ref<DefaultEdge[]>([])

    environments.forEach((env) => {
      const { uses, level } = env
      const { size, width, fontSize } = calculateSizes(env.contains?.length)

      const baseNode: Partial<Node> = {
        selectable: true,
        width: size,
        style: () => {
          let opacity = 1

          if (selectedNodeId.value && selectedNodeId.value !== env.id) {
            const isConnected = edges.value.some(({ source, target }) => {
              const comparing = [target, source]
              return comparing.includes(selectedNodeId.value!) && comparing.includes(env.id)
            })

            opacity = isConnected ? 0.8 : 0.1
          }

          return {
            fontSize,
            height: width,
            width,
            opacity,
            backgroundColor: colors[level]
          }
        }
      }

      const node = createNode(env, baseNode)

      _nodes.value.push(node)
      uses?.forEach((target) => {
        _edges.value.push(createEdge(node.id, target))
      })
    })

    arrangeGraph(_nodes, _edges)

    nodes.value = _nodes.value
    edges.value = _edges.value
  }

  function selectNode(node: Node | null) {
    selectedNode.value = node
  }

  return { nodes, edges, selectedNode, selectNode, convertToNode, resetNodes }
}
