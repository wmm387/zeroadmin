import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'

export const useBreakpoint = () => {
  const breakpoints = useBreakpoints(breakpointsTailwind)

  const smallerThanSm = breakpoints.smaller('sm')

  return {
    breakpoints,
    smallerThanSm,
  }
}

export default useBreakpoint
