import { unsafeWindow } from '$'
import { type XhrRequestConfig, type XhrRequestHandler, proxy } from 'ajax-hook'
import { type FetchHookProxyConfig, fproxy } from '@/utils/fetch-hook'
import BaseModule from '../BaseModule'
import { getUrlFromFetchInput } from '@/utils/index'
import type { OnFrameTypes, RunAtMoment } from '@/types'

class NoReport extends BaseModule {
  static runOnMultiplePages: boolean = true
  static runAt: RunAtMoment = 'document-start'
  static onFrame: OnFrameTypes = 'all'
  static runAfterDefault: boolean = false

  config = this.moduleStore.moduleConfig.EnhanceExperience.noReport

  /**
   * 判断是否是需要拦截的 URL
   * @param url 需要判断的 URL
   */
  private static isTargetURL(url: string) {
    return url.includes('//data.bilibili.com') || url.includes('//data.bilivideo.com')
  }

  /**
   * 劫持一些能减少日志上报的方法
   * @param win window
   */
  private hookProperties(win: Window) {
    Object.defineProperty(win.navigator, 'sendBeacon', {
      value: () => {
        return true
      }
    })

    Object.defineProperties(win, {
      reportObserver: {
        get() {
          return {
            reportCustomData: function () {}
          }
        },
        set() {}
      },
      reportConfig: {
        get() {
          return {}
        },
        set() {}
      }
    })
  }
  /**
   * 检测当前页面是否为动态页
   * https://t.bilibili.com/
   */
  private isDynamicPage() {
    return window.location.href.includes('t.bilibili.com')
  }
  /**
   * 如果是动态接口
   * /x/polymer/web-dynamic/v1/feed/all的相应，对页面进行修改
  */
  // private modifyDynamicPage(response: Response) {
  //   if (response.url.includes('/x/polymer/web-dynamic/v1/feed/all')) {
  //     const dynItem = document.querySelectorAll('.dyn-item')
  //     dynItem.forEach(item => {
  //       if (!item.querySelector('.altool')) {
  //         item.
  //       }
  //     })
  //   }
  // }
  /**
   * 修改页面
   */
  /**
   * 劫持 XHR 和 fetch 请求
   */
  private ajaxHook() {
    const ajaxHookProxyConfig = {
      onRequest: (config: XhrRequestConfig, handler: XhrRequestHandler) => {
        if (NoReport.isTargetURL(config.url)) {
          handler.resolve({
            config: config,
            status: 200,
            headers: {
              'Content-Type': 'text/plain; charset=utf-8'
            },
            response: 'ok'
          })
        } else {
          handler.next(config)
        }
      }
    }

    const fetchHookConfig: FetchHookProxyConfig = {
      onRequest(config, handler) {
        const url = getUrlFromFetchInput(config.input)
        if (NoReport.isTargetURL(url)) {
          handler.resolve(new Response('ok'))
        } else {
          handler.next(config)
        }
      },
      onResponse(response, handler) {
        handler.next(response)
      }
    }

    proxy(ajaxHookProxyConfig, unsafeWindow)
    fproxy(fetchHookConfig, unsafeWindow)
  }

  public run() {
    this.logger.log('拦截日志数据上报模块开始运行')

    try {
      this.hookProperties(unsafeWindow)
      this.ajaxHook()
    } catch (e) {
      this.logger.error('拦截日志数据上报失败', e)
    }
  }
}

export default NoReport
