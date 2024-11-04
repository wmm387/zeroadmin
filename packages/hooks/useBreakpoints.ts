import { useBreakpoints as _useBreakpoints, breakpointsTailwind } from '@vueuse/core'

export const useBreakpoints = () => {
  const breakpoints = _useBreakpoints(breakpointsTailwind)

  const smallerThanSm = breakpoints.smaller('sm')

  return {
    smallerThanSm,
  }
}

export default useBreakpoints
