import type { App, Component } from 'vue'

// 插件配置选项接口
export interface PluginOptions {
  enabled?: boolean
  autoRun?: boolean
  [key: string]: any
}

// 插件接口定义
export interface Plugin {
  // 插件基本信息
  name: string
  title: string
  description?: string
  version?: string
  icon?: string
  
  // 插件功能
  component?: Component
  setup?: (app: App) => void
  run?: () => void | Promise<void>
  shouldActivate?: () => boolean
  
  // 插件配置
  options?: PluginOptions
  defaultOptions?: PluginOptions
  
  // 插件状态
  enabled?: boolean
  autoRun?: boolean
}

// 插件状态接口
export interface PluginState {
  plugins: Plugin[]
  currentPlugin: Plugin | null
  enabledPlugins: Plugin[]
}