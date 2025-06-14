import { unsafeWindow } from '$'
import BaseModule from '../../BaseModule'
import type { ToolsModules } from '@/modules/type'
import type { ModuleStatusTypes } from '@/types'
import { getVideoInfo, submitAppeal, dynamicAll, feedType } from '@/apis/index'
import useMetaInfo from '@/stores/useMetaInfo'
import { getValue } from '@/utils/storage'
import { ElMessage } from 'element-plus'
import { useCacheStore } from '@/stores/useCacheStore'
import { sleep } from '@/utils/index'
import { isTimestampToday, delayToNextMoment, tsm, isNowIn } from '@/utils/luxon/index'
import _ from 'lodash'

class AlTools extends BaseModule implements ToolsModules {
  static runOnMultiplePages = true
  config = this.moduleStore.moduleConfig.AlTools
  public videoInfo: {
    bvid?: string
  } = {}
  public dynamicAllParam = {
    page: 10,
    // type: 'all',
    type: 'video',
  }
  public isAppealed = false
  public isKilling = 0
  public offset: Record<string, string> = {}
  get status(): ModuleStatusTypes {
    return this.config.status
  }
  set status(s: ModuleStatusTypes) {
    this.config.status = s
  }
  public async kill() {
    if (this.status != 'running') {
      return
    }
    this.isKilling = 1
    while (true) {
      await sleep(1000)
      if (this.isKilling == 2) {
        this.isKilling = 0
        this.status = ''
        this.dynamicAllParam.page = 1
        this.config._lastCompleteTime = 0
        return
      }
    }
  }
  /**批量申诉 */
  public async handleAutoAppeal(): Promise<void> {
    if (this.dynamicAllParam.page > 20) {
      console.log('第二十页动态')
      return
    }
    if (this.isKilling === 1) {
      this.isKilling = 2
      return
    }
    if (isTimestampToday(this.config._lastCompleteTime)) {
      this.logger.log('今天已经批量申诉过了')
    } else {
      try {
        const cacheStore = useCacheStore()
        if (cacheStore.currentScriptType === 'Main') {
          this.status = 'running'
          const asldd = this.config.asldd
          for (let idx = 0; idx < asldd.length; idx++) {
            const { page, type } = this.dynamicAllParam
            this.dynamicAllParam.page++
            console.log('{ type, page, host_mid: asldd[idx] }', {
              type,
              page,
              host_mid: asldd[idx],
              offset: this.offset[asldd[idx]],
            })
            const {
              data: { items, offset },
            } = await dynamicAll({
              type,
              page,
              host_mid: asldd[idx],
              offset: this.offset[asldd[idx]] || 0,
            })
            this.offset[asldd[idx]] = offset
            const appealList = items.filter((item) => {
              const uid = Number(item?.modules?.module_author?.mid)
              return this.config.asldd.includes(uid)
            })
            console.log('appealList', appealList)
            for (let i = 0; i < appealList.length; i++) {
              try {
                const item = appealList[i]
                if (item.type === feedType.DYNAMIC_TYPE_AV) {
                  const { code } = await this.handleSubmitAppeal(
                    item.modules.module_dynamic.major.archive.bvid,
                  )
                  if (code === 56601) {
                    this.config._lastCompleteTime = tsm()
                    this.status = 'done'
                    return
                  }
                  await sleep(_.random(3000, 5000))
                }
              } catch (error) {
                this.logger.error('批量申诉出错', error)
              }
            }
          }

          if (this.status !== 'done') {
            return this.handleAutoAppeal()
          }
          this.config._lastCompleteTime = tsm()
          this.status = 'done'
        } else {
          this.logger.log('不是主页面，不执行')
        }
      } catch (error) {
        this.status = 'error'
        this.logger.error('处理自动申诉出错', error)
      }
    }
  }
  public async handleAutoAppealInVideo() {
    if (this.config.currentVideoEnabled) {
      if (isTimestampToday(this.config._lastCompleteTime)) return
      if (unsafeWindow.location.href.includes('www.bilibili.com/video')) {
        this.logger.log('视频自动申诉模块启动')
        const metaInfo = useMetaInfo()
        if (!this.videoInfo.bvid) {
          if (!metaInfo.metaInfo.videoInfo) {
            await metaInfo.setMetaInfo()
          }
          if (metaInfo.metaInfo.videoInfo) {
            const { data: videoInfo } = await getVideoInfo(metaInfo.metaInfo.videoInfo)
            this.videoInfo = videoInfo
          } else {
            throw new Error('未获取到视频信息')
          }
        }
        if (this.videoInfo.bvid) {
          return this.handleSubmitAppeal(this.videoInfo.bvid)
        }
      }
    } else {
      console.warn('不是视频页面')
    }
  }
  public async handleSubmitAppeal(bvid: string, reason = '') {
    console.log('handleSubmitAppeal', bvid)
    try {
      if (!bvid) {
        throw new Error('bvid为空')
      }
      const appealReasons = getValue('appealReasons', [])
      const res = await submitAppeal({
        bvid: bvid,
        reason:
          (this.config.reason && this.config.reason.length > 15) ||
          appealReasons[Math.floor(Math.random() * appealReasons.length)],
      })
      if (res.code === 0) {
        // 成功状态
        ElMessage.success(`申诉结果：${res.data.success_toast}`)
      } else {
        ElMessage.error(`${res.message}, bvid:${bvid} `)
      }
      return res
    } catch (error) {
      this.logger.error('提交申诉失败', error)
    }
  }
  public async run() {
    try {
      const emitter = this.moduleStore.emitter
      // 监听 LiveTasks.vue 发出的获取粉丝勋章事件
      emitter.off('Run_Auto_Appeal')
      emitter.on('Run_Auto_Appeal', async (data) => {
        if (data.module === 'handleBatchAppeal') {
          await this.kill()
          this.handleAutoAppeal()
        } else if (data.module === 'handleSingleAppeal') {
          const { bvid, reason } = data.params || {}
          await this.handleSubmitAppeal(bvid, reason)
        }
      })

      // const medalTasks = this.moduleStore.moduleConfig.DailyTasks.LiveTasks.medalTasks
      // const taskValues = [medalTasks.light, medalTasks.watch]

      // if (taskValues.some((t) => t.enabled && !isTimestampToday(t._lastCompleteTime, 0, 4))) {
      //   // 开启了点亮熄灭勋章或观看直播功能且今天没完成过
      //   biliStore.fansMedalsStatus = 'loading'
      //   biliStore.fansMedals = await this.getFansMetals()
      //   biliStore.fansMedalsStatus = 'loaded'
      // }

      // setTimeout(
      //   () => this.run().catch((reason) => this.logger.error(reason)),
      //   delayToNextMoment(0, 4).ms,
      // )
      await this.handleAutoAppealInVideo()
      await this.handleAutoAppeal()
    } catch (error) {
      this.logger.error('提交申诉失败', error)
    }
  }
}

export default AlTools
