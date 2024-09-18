import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import VueJsx from '@vitejs/plugin-vue-jsx'
import VueRouter from 'unplugin-vue-router/vite'
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
    Vue({ script: { propsDestructure: true } }),
    VueJsx(),
    VueRouter({ exclude: ['**/components/**/*.vue'] }),
    ElementPlus({}),
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
