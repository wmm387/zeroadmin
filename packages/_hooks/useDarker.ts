import { useDark, useToggle } from '@vueuse/core'

export default function useDarker() {
  const isDark = useDark()
  const toggleDark = useToggle(isDark)

  return { isDark, toggleDark }
}
