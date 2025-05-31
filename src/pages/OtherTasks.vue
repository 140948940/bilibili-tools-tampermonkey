<script setup lang="ts">
import { useModuleStore } from '@/stores/useModuleStore'
import helpInfo from '@/utils/help-info'
import Info from '@/components/icons/InfoIcon.vue'
import TaskStatus from '@/components/icons/TaskStatusIcon.vue'
const moduleStore = useModuleStore()

const config = moduleStore.moduleConfig.DailyTasks.OtherTasks

const status = moduleStore.moduleStatus.DailyTasks.OtherTasks
</script>

<template>
  <div>
    <el-row>
      <el-space wrap>
        <el-switch v-model="config.groupSign.enabled" active-text="应援团签到" />
        <Info :item="helpInfo.DailyTasks.OtherTasks.groupSign" />
        <TaskStatus :status="status.groupSign" />
      </el-space>
    </el-row>
    <el-row>
      <el-space wrap>
        <el-switch v-model="config.silverToCoin.enabled" active-text="银瓜子换硬币" />
        <Info :item="helpInfo.DailyTasks.OtherTasks.silverToCoin" />
        <TaskStatus :status="status.silverToCoin" />
      </el-space>
    </el-row>
    <!-- <el-row>
      <el-space wrap :size="[8, 0]">
        <el-switch v-model="config.getYearVipPrivilege.enabled" active-text="领取年度大会员权益" />
        <Info :item="helpInfo.DailyTasks.OtherTasks.getYearVipPrivilege" />
        <TaskStatus :status="status.getYearVipPrivilege" />
      </el-space>
    </el-row> -->
    <el-divider />
  </div>
</template>
