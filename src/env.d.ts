/// <reference types="vite/client" />
/// <reference types="vite-plugin-monkey/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// 扩展Window接口
interface Window {
  // 可以在这里添加全局变量的类型定义
}

