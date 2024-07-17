import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import master from '@/data/master.yaml'

import type { Environment } from '@/constants/interfaces'
import { sortBy } from '@/helpers/common'

function importData(fileName: string) {
  return import(`../data/${fileName}.yaml`).then((res) => res.default)
}

export const useCanvasStore = defineStore('canvas', () => {
  const currentRoot = ref<Environment | null>(null)

  const nodeTree = ref<Record<number, Environment[]>>({})

  const currentLevel = computed(() => {
    if (!currentRoot.value) {
      return 0
    } else {
      return currentRoot.value.level
    }
  })

  const currentBranch = computed(() => {
    let branch = nodeTree.value[1]
    const level = currentRoot.value?.level

    if (level) {
      branch = nodeTree.value[level + 1]?.filter((env) => {
        return currentRoot.value?.contains?.includes(env.id)
      })
    }

    return branch ?? []
  })

  async function init() {
    nodeTree.value = {}
    await addToTree(master)
  }

  async function addToTree(env: Environment, level = 0) {
    let promises: Promise<any>[] = []
    let parent: string | undefined
    env.level = level

    if (level) {
      parent = env.id
      if (!nodeTree.value[level]) {
        nodeTree.value[level] = [env]
      } else {
        nodeTree.value[level].push(env)
      }
    }

    if (env.contains) {
      promises = env.contains.map(importData)

      const response = await Promise.allSettled(promises)

      promises = response
        .filter((res) => res.status === 'fulfilled')
        .map((res) => {
          const { value } = res as PromiseFulfilledResult<Environment>
          value.extra?.sort((extraA, extraB) => sortBy(extraA, extraB, 'type'))
          return addToTree({ ...value, parent }, level + 1)
        })

      await Promise.allSettled(promises)
    }
  }

  function getEnvironment(id: string) {
    let tree

    for (tree of Object.values(nodeTree.value)) {
      const foundEnv = tree.find((env) => env.id === id)
      if (foundEnv) {
        return foundEnv
      }
    }

    return null
  }

  function goToEnvironment(id?: string, parent = false) {
    if (!id) {
      window.document.title = 'Unravel'
      currentRoot.value = null
      return currentRoot
    }

    currentRoot.value = currentBranch.value.find((env) => env.id === id) ?? null

    if (!currentRoot.value) {
      Object.values(nodeTree.value).some((branchs) => {
        currentRoot.value = branchs.find((branch) => branch.id === id) ?? null
        return !!currentRoot.value
      })
    }

    if (currentRoot.value) {
      window.document.title = `Unravel | ${currentRoot.value.name}`
      const noData = currentRoot.value.uses?.length === 0;
      
      if (parent || noData) {
        return goToEnvironment(currentRoot.value.parent)
      }
    }

    return currentRoot.value
  }

  return {
    currentRoot,
    nodeTree,
    currentLevel,
    currentBranch,
    init,
    getEnvironment,
    addToTree,
    goToEnvironment
  }
})
