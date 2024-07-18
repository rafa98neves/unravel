import { useWindowSize } from "@vueuse/core"
import { computed } from "vue"

const breakpoints = {
  XS: 480,
  SM: 768,
  MD: 1024,
  LG: 1200,
}

export default function useDimensions() {
  const { width, height } = useWindowSize()
  
  const isSM = computed(() => width.value <= breakpoints.SM)
  const isMD = computed(() => width.value <= breakpoints.MD && width.value > breakpoints.SM)
  const isLG = computed(() => width.value <= breakpoints.LG && width.value > breakpoints.MD) 
  const isXL = computed(() => width.value > breakpoints.LG) 

  function isBiggerOrEqualThan(size: 'SM' | 'MD' | 'LG') {
    return width.value >= breakpoints[size]
  }

  function isSmallerThan(size: 'SM' | 'MD' | 'LG') {
    return width.value < breakpoints[size]
  }

  function isBetween(min: 'SM' | 'MD' | 'LG', max: 'SM' | 'MD' | 'LG') {
    return width.value > breakpoints[min] && width.value < breakpoints[max]
  }

  return { width, height, isSM, isMD, isLG, isXL, isBiggerOrEqualThan, isSmallerThan, isBetween }
}
