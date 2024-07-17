import type { Environment } from '@/constants/interfaces'
import type { DefaultEdge, Node } from '@vue-flow/core'

export function createEdge(source: string, target: string): DefaultEdge {
  return {
    id: `connection--${source}-${target}`,
    source,
    target,
    animated: true
  }
}

export function createNode(env: Environment, override: Partial<Node> = {}): Node {
  const { position, parentNode } = override
  const randomPos = { x: Math.random() * 500, y: Math.random() * 500 }

  const out: Node = {
    id: env.id,
    label: env.name,
    position: position ?? randomPos,
    expandParent: !!parentNode,
    ...override
  }

  return out
}
