import type { App } from 'vue'
import { ElInfiniteScroll, ElLoading } from 'element-plus'
import * as components from './components'

import '@unocss/reset/tailwind-compat.css'
import 'uno.css'

import 'element-plus/es/components/infinite-scroll/style/css'
import 'element-plus/es/components/loading/style/css'

const directives = [ElInfiniteScroll, ElLoading]

export function install(app: App<Element>) {
  // 注册组件
  for (const key in components) {
    app.component(key, components[key])
  }
  // 注册指令
  directives.forEach(directive => {
    app.use(directive)
  })
}

export const ZeroAdmin = { install }

export default ZeroAdmin

export * from './components'
export type { DescriptionData } from './components/Descriptions'
export * from './components/ZCrud'
