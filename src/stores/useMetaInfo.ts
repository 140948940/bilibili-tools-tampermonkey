import { defineStore } from 'pinia'
import { parseVideoId } from '../utils/index'
import { getCurrentUserInfo } from '../apis/index'
import { ref } from 'vue'
async function getMetaInfo() {
  try {
    const url = window.location.href
    const videoInfo = parseVideoId(url)
    // https://live.bilibili.com/22637261?123
    const roomIdMatch = url.match(/(?:live\.bilibili\.com\/)(\d+)/)
    const roomId = roomIdMatch ? parseInt(roomIdMatch[1], 10) : null
    const { data: userInfo } = await getCurrentUserInfo()
    return {
      videoInfo,
      roomId,
      userInfo,
    }
  } catch (error) {
    console.error('getMetaInfo',error)
    return {
      videoInfo: null,
      roomId: null,
      userInfo: null,
    }
  }
}
type MetaInfoResult = Awaited<ReturnType<typeof getMetaInfo>>
export default defineStore('metaInfo', () => {
  const metaInfo = ref<MetaInfoResult>({
      videoInfo: null,
      roomId: null,
      userInfo: null,
  })
  const setMetaInfo = async () => {
    metaInfo.value = await getMetaInfo()
  }
  return {
    metaInfo,
    setMetaInfo,
  }
})
