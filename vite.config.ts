import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import monkey, { cdn, util } from 'vite-plugin-monkey'
import { fileURLToPath, URL } from 'node:url'
import packageJson from './package.json'
export default defineConfig({
  plugins: [
    vue(),
    monkey({
      entry: 'src/main.ts',
      userscript: {
        name: 'asldd-bilibili-tools-app',
        namespace: 'https://github.com/140948940/bilibili-tools-tampermonkey',
        version: packageJson.version,
        description: packageJson.description,
        author: 'A SOUL',
        match: ['*://*.bilibili.com/*'],
        license: 'MIT',
        'run-at': 'document-start',
        connect: [
          'api.bilibili.com',
          'api.live.bilibili.com',
          'api.vc.bilibili.com',
          'passport.bilibili.com',
          'live.bilibili.com',
          'live-trace.bilibili.com',
          '*'
        ],
      },
      build: {
         externalGlobals: {
          vue: cdn.unpkg('Vue', 'dist/vue.global.prod.js').concat(
            // For pinia, another solution is .concat('https://unpkg.com/vue-demi@latest/lib/index.iife.js')
            util.dataUrl(';window.Vue=Vue;window.VueDemi=Vue;')
          ),
          'element-plus': cdn.unpkg('ElementPlus', 'dist/index.full.min.js'),
          '@element-plus/icons-vue': cdn.unpkg('ElementPlusIconsVue', 'dist/index.iife.min.js'),
          pinia: cdn.unpkg('Pinia', 'dist/pinia.iife.prod.js'),
          'vue-draggable-plus': cdn.unpkg('VueDraggablePlus', 'dist/vue-draggable-plus.iife.js'),
          lodash: cdn.unpkg('_', 'lodash.min.js'),
          'hotkeys-js': cdn.unpkg('hotkeys', 'dist/hotkeys.min.js'),
          luxon: cdn.unpkg('luxon', 'build/global/luxon.min.js'),
          'crypto-js': cdn.unpkg('CryptoJS', 'crypto-js.js')
        },
        externalResource: {
          'element-plus/dist/index.css': cdn.unpkg(),
        },
        metaFileName: true,
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
