import { resolve } from 'node:path'
import Vue from '@vitejs/plugin-vue'
import VueJsx from '@vitejs/plugin-vue-jsx'
import Unocss from 'unocss/vite'
import ElementPlus from 'unplugin-element-plus/vite'
import VueRouter from 'unplugin-vue-router/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@pkg': resolve(__dirname, './packages'),
    },
  },
  plugins: [
    Vue(),
    VueJsx(),
    VueRouter({ exclude: ['**/components/**/*.vue'] }),
    ElementPlus({}),
    Unocss(),
  ],
  build: {
    lib: {
      entry: [
        resolve(__dirname, 'packages/index.ts'),
        resolve(__dirname, 'packages/utils.ts'),
        resolve(__dirname, 'packages/hooks.ts'),
      ],
      name: 'ZeroAdmin',
      cssFileName: 'style',
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
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
      },
    },
  },
})
