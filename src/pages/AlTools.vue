<template>
  <el-form :model="form" size="small" label-width="120px">
    <!-- 是否启用自动申诉 -->
    <el-form-item label="刷新后生效">
      <el-switch v-model="moduleStore.moduleConfig.AlTools.enabled" active-text="自动申诉" /><TaskStatus :status="moduleStore.moduleConfig.AlTools.status"></TaskStatus>
      <span>启用后每日将按照动态顺序自动申诉A-SOUL成员、李滇滇评论区(目前只针对视频)</span>
    </el-form-item>
    <el-form-item label="刷新后生效">
      <el-switch
        v-model="moduleStore.moduleConfig.AlTools.currentVideoEnabled"
        active-text="当前视频自动申诉"
      />
      <span>启用后将自动申诉当前视频（https://www.bilibili.com/video下的）</span>
    </el-form-item>
    <el-form-item label="申诉动态/视频成员">
      <el-checkbox-group v-model="moduleStore.moduleConfig.AlTools.asldd">
        <el-checkbox v-for="item in upOptions" :label="item.value">{{ item.label }}</el-checkbox>
      </el-checkbox-group>
    </el-form-item>
    <el-form-item label="申诉类型">
      <el-checkbox-group v-model="moduleStore.moduleConfig.AlTools.selectedContentTypes" disabled>
        <!-- <el-checkbox label="动态">动态</el-checkbox> -->
        <el-checkbox label="视频">视频</el-checkbox>
      </el-checkbox-group>
    </el-form-item>
    <el-form-item label="申诉bvid">
      <el-input v-model="form.bvid"></el-input>
    </el-form-item>
    <!-- 添加Tag -->
    <el-form-item label="添加申诉原因模板">
      <div style="display: flex; gap: 10px">
        <el-input
          v-model="tagInput"
          type="textarea"
          :rows="2"
          placeholder="输入申诉原因，15字以上"
          style="width: 400px"
        />
        <el-button @click="addTag" :disabled="tagInput.length > 15">添加</el-button>
      </div>
      <div style="margin-top: 8px">
        <el-tag
          v-for="(tag, index) in tags"
          :key="index"
          closable
          @close="removeTag(index)"
          @click="form.reason = tag"
          class="tag"
        >
          {{ tag }}
        </el-tag>
      </div>
    </el-form-item>

    <!-- 申诉原因输入 -->
    <el-form-item label="申诉原因">
      <el-input
        v-model="moduleStore.moduleConfig.AlTools.reason"
        type="textarea"
        :rows="2"
        placeholder="不用填写，默认随机使用上面理由，提交时会优先使用本条理由"
      />
    </el-form-item>

    <!-- 操作按钮 -->
    <el-form-item label="操作">
      <el-button type="primary" @click="handleSingleAppeal">点击申诉</el-button>
      <el-button type="primary" @click="handleBatchAppeal">重新批量申诉</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { useModuleStore } from '@/stores/useModuleStore'
import { onMounted, ref, watch } from 'vue'
import { setValue, getValue } from '@/utils/storage/index'
import { upOptions } from '@/contanst'
import {ElMessage} from 'element-plus'
import TaskStatus from '@/components/icons/TaskStatusIcon.vue'
const moduleStore = useModuleStore()
const defaultAppealReasons = [
  '我的评论内容没有任何问题，是被恶意举报脚本举报导致的误删除，请求恢复我的评论。',
  '我的评论符合平台规则，可能是被恶意举报，恳请恢复。',
  '此评论并无违规，应该是误判，希望能恢复。',
  '我的言论遵循社区规范，遭恶意举报致使评论被删，望恢复。',
  '评论内容健康且积极，无端被删，望查明并恢复。',
  '此条评论是正常交流，不存在违规，误删请恢复。',
  '我按平台规定发表评论，却被恶意处理，请求恢复。',
  '评论内容无任何不当之处，疑似误删，盼恢复。',
  '我的发言符合平台要求，被恶意举报删除，望恢复。',
  '评论内容合理合规，被错误处理，恳请恢复。',
]
const form = ref({
  autoAppealEnabled: false,
  reason: '',
  bvid: '',
})

const tagInput = ref('')
const tags = ref([])
watch(
  () => tags.value,
  (val) => {
    if (val) {
      setValue('appealReasons', JSON.stringify(val))
    }
  },
  {
    immediate: true,
  },
)

onMounted(() => {
  tags.value = Array.from(new Set([...defaultAppealReasons, ...getValue('appealReasons', [])]))
})
// 添加 Tag
function addTag() {
  const value = tagInput.value.trim()
  if (value) {
    tags.value.push(value)
    tagInput.value = ''
  }
}

// 删除 Tag
function removeTag(index) {
  tags.value.splice(index, 1)
}
function handleSingleAppeal() {
  console.log('handleBatchAppeal')
  // 利用 emitter 通知 FansMedals 模块去获取数据
  if (!form.value.bvid) {
    ElMessage.warning('请输入bvid')
  }
  moduleStore.emitter.emit('Run_Auto_Appeal', {
    module: 'handleSingleAppeal',
    params: {
      bvid: form.value.bvid,
    },
  })
}
// 批量申诉
function handleBatchAppeal() {
  console.log('handleBatchAppeal')
  // 利用 emitter 通知 FansMedals 模块去获取数据
  moduleStore.emitter.emit('Run_Auto_Appeal', {
    module: 'handleBatchAppeal',
    params: {
      reason: form.value.reason,
    },
  })
}
</script>

<style scoped>
.el-tag {
  margin-right: 8px;
  cursor: pointer;
}
</style>
