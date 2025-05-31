// plugins.ts
import { defineStore } from 'pinia'
import type { Plugin, PluginState } from '../types/plugin'

export const usePluginStore = defineStore('plugins', {
  state: (): PluginState => ({
    plugins: [],
    currentPlugin: null,
    enabledPlugins: []
  }),

  getters: {
    getPlugins: (state) => state.plugins,
    getCurrentPlugin: (state) => state.currentPlugin,
    getEnabledPlugins: (state) => state.enabledPlugins
  },

  actions: {
    registerPlugin(plugin: Plugin) {
      if (this.plugins.find(p => p.name === plugin.name)) {
        return
      }

      // 使用插件默认配置或用户配置初始化
      plugin.enabled = plugin.options?.enabled ?? plugin.defaultOptions?.enabled ?? true
      plugin.autoRun = plugin.options?.autoRun ?? plugin.defaultOptions?.autoRun ?? false

      this.plugins.push(plugin)

      if (plugin.enabled) {
        this.enabledPlugins.push(plugin)
      }
    },

    enablePlugin(pluginName: string) {
      const plugin = this.plugins.find(p => p.name === pluginName)
      if (plugin && !plugin.enabled) {
        plugin.enabled = true
        this.enabledPlugins.push(plugin)
      }
    },

    disablePlugin(pluginName: string) {
      const plugin = this.plugins.find(p => p.name === pluginName)
      if (plugin && plugin.enabled) {
        plugin.enabled = false
        this.enabledPlugins = this.enabledPlugins.filter(p => p.name !== pluginName)
      }
    },

    setCurrentPlugin(plugin: Plugin) {
      this.currentPlugin = plugin
    },

    updatePluginOptions(pluginName: string, options: Partial<Plugin['options']>) {
      const plugin = this.plugins.find(p => p.name === pluginName)
      if (plugin) {
        plugin.options = { ...plugin.options, ...options }
      }
    }
  }
})