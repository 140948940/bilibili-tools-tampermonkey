import { upUids } from '@/contanst'
import type { ModuleStatusTypes } from '@/types'
const defaultValues = {
  ui: {
    isCollapse: false,
    isShowPanel: true,
    activeMenuIndex: 'MainSiteTasks',
    panelWidthPercent: 40,
    medalInfoPanelSortMode: false,
  },
  modules: {
    isCloseMessageError: false,
    DailyTasks: {
      MainSiteTasks: {
        login: {
          enabled: false,
          _lastCompleteTime: 0,
        },
        watch: {
          enabled: false,
          _lastCompleteTime: 0,
        },
        coin: {
          enabled: false,
          num: 1,
          _lastCompleteTime: 0,
        },
        share: {
          enabled: false,
          _lastCompleteTime: 0,
        },
      },
      LiveTasks: {
        sign: {
          enabled: false,
          _lastCompleteTime: 0,
        },
        medalTasks: {
          light: {
            enabled: true,
            mode: 'danmu',
            danmuList: [
              '(⌒▽⌒)',
              '（￣▽￣）',
              '(=・ω・=)',
              '(｀・ω・´)',
              '(〜￣△￣)〜',
              '(･∀･)',
              '(°∀°)ﾉ',
              '╮(￣▽￣)╭',
              '_(:3」∠)_',
              '(^・ω・^ )',
              '(●￣(ｴ)￣●)',
              'ε=ε=(ノ≧∇≦)ノ',
              '⁄(⁄ ⁄•⁄ω⁄•⁄ ⁄)⁄',
              '←◡←',
              `(●'◡'●)ﾉ♥`,
            ],
            _lastCompleteTime: 0,
          },
          watch: {
            enabled: false,
            time: 25,
            _watchingProgress: {},
            _lastWatchTime: 0,
            _lastCompleteTime: 0,
          },
          // 白名单点亮徽章
          isWhiteList: true,
          roomidList: [
            22632157, 22637261, 22625027, 22632424, 1878680324, 1829737164, 22625025, 22634198,
          ],
        },
      },
      OtherTasks: {
        groupSign: {
          enabled: false,
          _lastCompleteTime: 0,
        },
        silverToCoin: {
          enabled: true,
          _lastCompleteTime: 0,
        },
        getYearVipPrivilege: {
          enabled: false,
          _nextReceiveTime: 0,
        },
      },
    },
    EnhanceExperience: {
      switchLiveStreamQuality: {
        enabled: false,
        qualityDesc: '原画',
      },
      banp2p: {
        enabled: false,
      },
      noReport: {
        enabled: false,
      },
      noSleep: {
        enabled: false,
      },
      invisibility: {
        enabled: false,
      },
    },
    RemoveElement: {
      removePKBox: {
        enabled: false,
      },
      removeLiveWaterMark: {
        enabled: false,
      },
      removeShopPopover: {
        enabled: false,
      },
      removeGameParty: {
        enabled: false,
      },
      removeGiftPopover: {
        enabled: false,
      },
      removeMicPopover: {
        enabled: false,
      },
      removeComboCard: {
        enabled: false,
      },
      removeRank: {
        enabled: false,
      },
      removeHeaderStuff: {
        enabled: false,
      },
      removeFlipView: {
        enabled: false,
      },
      removeRecommendRoom: {
        enabled: false,
      },
      removeLiveMosaic: {
        enabled: false,
      },
    },
    AlTools: {
      status: '' as ModuleStatusTypes,
      enabled: false,
      currentVideoEnabled: true,
      selectedMembers: [],
      selectedContentTypes: ['视频'],
      reason: '',
      asldd: [...upUids],
      _lastCompleteTime: 0,
    },
  },
  cache: {
    lastAliveHeartBeatTime: 0,
  },
}

export default defaultValues
