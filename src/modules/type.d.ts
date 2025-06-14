import {Store} from 'pinia'

export type statusType='' | 'running' | 'done' | 'error'
export interface ToolsModules{
   /**
   * 模块名称，在被导出时定义
   *
   * 输出控制台日志时会用到
   */
  // public moduleName: string
  /**
   * 储存所有模块信息的 Pinia Store
   */
  /**
   * 推荐添加一个 config 属性来表示当前模块的配置项
   *
   * @example config: this.moduleStore.moduleConfig.DailyTasks.MainSiteTasks.login
   */
  protected config?: any
  /**
   * 如果需要在控制面板上显示模块状态，推荐添加一个 status setter 用来设置模块状态
   *
   */
  public status: statusType
  /**
   * 运行模块
   *
   * 默认模块必须返回一个空的Promise，
   * 其它模块若需要使用 await 可以返回一个空的Promise，否则无返回值
   */
  public run(): void | Promise<void>
}
