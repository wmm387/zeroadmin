import presetWmm from '@wmm387/unocss-preset'
import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno,
  transformerDirectives,
} from 'unocss'

export default defineConfig({
  shortcuts: [
    ['bg-gray-d', 'bg-#f7f8fa dark:bg-#262727'],
    ['bg-white-d', 'bg-white dark:bg-#141414'],
  ],
  presets: [
    presetAttributify(),
    presetIcons({ scale: 1.2 }),
    presetUno(),
    presetWmm({ enableElementPlusColor: true }),
  ],
  transformers: [
    transformerDirectives(),
  ],
})
