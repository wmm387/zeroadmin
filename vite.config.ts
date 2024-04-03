import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import VueJsx from '@vitejs/plugin-vue-jsx'
import ElementPlus from 'unplugin-element-plus/vite'
import Unocss from 'unocss/vite'

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@pkg': resolve(__dirname, './packages'),
    },
  },
  plugins: [
    Vue({
      script: {
        propsDestructure: true,
        defineModel: true,
      },
    }),
    VueJsx(),
    // https://github.com/element-plus/unplugin-element-plus/blob/main/README.zh-CN.md
    ElementPlus({}),
    // https://github.com/antfu/unocss
    // see uno.config.ts for config
    Unocss(),
  ],
  build: {
    lib: {
      entry: [resolve(__dirname, 'packages/index.ts'), resolve(__dirname, 'packages/utils.ts')],
      name: 'ZeroAdmin',
      // fileName: (format, entryName) => `${entryName}.${format}.js`,
    },
    rollupOptions: {
      treeshake: true,
      external: ['vue', 'element-plus'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps (not useful if 'umd' is not in lib.formats)
        // globals: {
        //   'vue': 'Vue',
        //   'element-plus': 'ElementPlus',
        // },
        // disable warning on src/index.ts using both default and named export
        exports: 'named',
      },
    },
  },
})
