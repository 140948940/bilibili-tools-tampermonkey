<template>
  <el-config-provider size="small">
    <div class="bilibili-tools-container" :style="{ opacity: opacity / 100 }">
      <div v-html="style"></div>
      <!-- 控制面板开关按钮 -->
      <el-button class="panel-toggle" type="primary" @click="togglePanel">
        {{ isPanelVisible ? '隐藏工具' : '显示工具' }}
      </el-button>

      <!-- 主控制面板 -->
      <el-container v-show="isPanelVisible" class="panel-container">
        <el-header class="panel-header">
          <div class="header-content">
            <span class="header-title" @click="handleError">B站工具集</span>
            <el-button type="primary" @click="handleReset">恢复默认配置</el-button>
            <el-switch
              v-model="moduleStore.moduleConfig.isCloseMessageError"
              active-text="关闭message-error提示"
            />
            <div class="header-actions">
              <!-- 新增的透明度控件 -->
              <span style="margin-right: 16px">透明度：</span>
              <div class="opacity-control">
                <el-slider v-model="opacity" :min="30" :max="100" :step="1" size="small" />
              </div>
            </div>
          </div>
        </el-header>
        <el-container class="tools-container">
          <el-tabs v-model="activeMenu" tabPosition="left" vertical class="tools-tabs">
            <el-tab-pane
              v-for="tools in tools"
              :key="tools.name"
              :name="tools.name"
              :label="tools.name"
            >
              <el-main class="panel-main">
                <div class="plugin-settings">
                  <component :is="tools.component" v-bind="tools.props || {}" />
                </div>
              </el-main>
            </el-tab-pane>
          </el-tabs>
        </el-container>
      </el-container>
    </div>
  </el-config-provider>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, markRaw } from 'vue'
// import { usePluginStore } from './store/plugins'
import AlTools from '@/pages/AlTools.vue'
import LiveTasks from '@/pages/LiveTasks.vue'
import OtherTasks from '@/pages/OtherTasks.vue'
// import MainSiteTasks from '@/pages/MainSiteTasks.vue'
import { getValue, removeValues } from '@/utils/storage/index'
import { ElMessageBox, ElMessage } from 'element-plus'
import { useModuleStore } from './stores/useModuleStore'
// 控制面板显示状态
const isPanelVisible = ref(false)
const activeMenu = ref('评论申诉工具')
const opacity = ref(100)
const tools = ref([
  {
    component: markRaw(AlTools),
    name: '评论申诉工具',
  },
  // {
  //   component: markRaw(MainSiteTasks),
  //   name: '主站任务',
  // },
  {
    component: markRaw(LiveTasks),
    name: '直播任务',
  },
  {
    component: markRaw(OtherTasks),
    name: '其他任务',
  },
])
const moduleStore = useModuleStore()

const style = computed(() => {
  if (moduleStore.moduleConfig.isCloseMessageError) {
    return `<style>
    .el-message.el-message--error{
      display: none!important;
    }
    <style>`
  } else {
    return ''
  }
})
const handleError = () => {
  ElMessage.error('请勿关闭此页面')
}
// 初始化透明度
onMounted(() => {
  const savedOpacity = getValue('panelOpacity')
  if (savedOpacity) {
    opacity.value = parseInt(savedOpacity)
  }
})
const handleReset = () => {
  ElMessageBox.confirm('此操作将清楚插件所有缓存数据,部分功能刷新页面后将重复执行', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    appendTo: '#asldd-bilibili-tools-app',
  }).then(() => {
    removeValues()
    ElMessage.success('重置成功')
  })
}

// 切换控制面板显示状态
const togglePanel = () => {
  isPanelVisible.value = !isPanelVisible.value
}
//
</script>
<style>
#asldd-bilibili-tools-app {
  --el-color-primary: #f69;
  --el-color-primary-light-3: #fc8bab;
  --el-color-primary-dark-2: #f69;
  /* position: fixed;
  left: 0;
  top: 0; */
}
</style>
<style scoped>
.bilibili-tools-container {
  position: fixed;
  z-index: 9999;
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.panel-toggle {
  position: fixed;
  top: 80px;
  left: 20px;
  z-index: 10000;
  transition: all 0.3s ease;
  border-radius: 8px;
  padding: 8px 16px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.panel-toggle:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.15);
}

.panel-container {
  position: fixed;
  top: 80px;
  left: 10%;
  width: 800px;
  background: var(--el-bg-color);
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  border: 1px solid var(--el-border-color-lighter);
  height: 80vh;
}
.tools-container {
  height: 0;
}
.panel-header {
  height: 50px;
  line-height: 50px;
  padding: 0 20px;
  border-bottom: 1px solid var(--el-border-color-lighter);
  background: var(--el-bg-color);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-title {
  font-size: 16px;
  font-weight: bold;
  color: var(--el-text-color-primary);
}
.opacity-control {
  flex: 1;
}
.header-actions {
  width: 300px;
  display: flex;
  align-items: center;
}

.panel-aside {
  border-right: 1px solid var(--el-border-color-lighter);
  background: var(--el-bg-color-page);
}

.tools-menu {
  border-right: none;
  font-size: 12px;
}

.tools-menu .el-menu-item {
  height: 40px;
  line-height: 40px;
  padding: 0 20px;
  margin: 4px 8px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.tools-menu .el-menu-item:hover {
  background-color: var(--el-color-primary-light-9);
}

.tools-menu .el-menu-item.is-active {
  background-color: var(--el-color-primary);
  color: #fff;
}

.panel-main {
  background: var(--el-bg-color);
  padding: 20px;
}

.plugin-settings {
  background-color: var(--el-bg-color-page);
  border-radius: 4px;
  padding: 15px;
  overflow-y: auto;
  height: 100%;
}

.theme-toggle-inner {
  font-size: 18px;
  padding: 8px;
  height: 32px;
  width: 32px;
}

.panel-container {
  background: var(--el-bg-color);
  border-color: var(--el-border-color);
  display: flex;
  flex-direction: column;
}
.plugin-settings {
  /* background-color: var(--bg-color); */
  /* color: var(--text-color);
  border-color: var(--border-color); */
}

.el-menu {
  background-color: var(--bg-color);
  border-color: var(--border-color);
}

.el-menu-item {
  color: var(--text-color);
}
.tools-container :deep(.el-tab-pane) {
  height: 100%;
  overflow-y: auto;
}
.tools-container :deep(.el-tag) {
  white-space: normal;
  line-height: 1.4;
  margin-bottom: 5px;
}
</style>
