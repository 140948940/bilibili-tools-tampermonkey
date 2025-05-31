import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import { useCacheStore } from './stores/useCacheStore'
import { dce, isTargetFrame } from './utils/dom'
import { waitForMoment } from './utils/index'
import * as MyIconsVue from './components/icons'
import './assets/css/base.css'
import Logger from './utils/logger'
import { useModuleStore } from './stores/useModuleStore'
import useMetaInfo from './stores/useMetaInfo'

if (isTargetFrame()) {
  const logger = new Logger('Main')

  logger.log('document.readyState', document.readyState)

  const pinia = createPinia()

  const cacheStore = useCacheStore(pinia)

  cacheStore.checkCurrentScriptType()
  logger.log('当前脚本的类型为', cacheStore.currentScriptType)

  if (cacheStore.currentScriptType === 'Main') {
    cacheStore.startMainBLTHAliveHeartBeat()
  }
  console.log('234')

  await waitForMoment('document-body')
  const moduleStore = useModuleStore(pinia)
  moduleStore.loadModules('unknown')
  const metaInfo = useMetaInfo(pinia)
  metaInfo.setMetaInfo()
  const app = createApp(App)

  app.use(ElementPlus)
  app.use(pinia)

  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }

  for (const [key, component] of Object.entries(MyIconsVue)) {
    app.component(key, component)
  }
  moduleStore.loadModules('yes')
  await waitForMoment('document-end')

  const div = dce('div')
  div.id = 'asldd-bilibili-tools-app'
  document.body.append(div)
  app.mount(div)
  console.log('HHH6')
}
