<template>
  <div class="m-[20px]">
    <ATable :pagination="false" :columns="columns" :data-source="tableData">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'createTime'">
          <span>
            {{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
          </span>
        </template>
        <template v-else-if="column.key === 'status'">
          <span>
            {{ getStatusText(record.status) }}
          </span>
        </template>
        <template v-else-if="column.key === 'action'">
          <span>
            <a
              v-if="userStore.userInfo.account === 'admin'"
              style="color: #1677ff"
              @click="handleEdit(record)"
              >修改间隔</a
            >
            <ADivider
              type="vertical"
              v-if="
                userStore.userInfo.account === 'admin' && record.status === 1
              "
            />
            <a
              v-if="record.status === 1"
              style="color: #1677ff"
              @click="handlePause(record)"
              >暂停</a
            >
            <ADivider type="vertical" />
            <a
              v-if="record.status === 2"
              style="color: #1677ff"
              @click="handleResume(record)"
              >继续</a
            >
            <ADivider type="vertical" v-if="record.status === 2" />
            <APopconfirm
              title="是否确认删除?"
              ok-text="是"
              cancel-text="否"
              @confirm="handleDel(record)"
            >
              <a v-if="record.status !== 4" style="color: #ff4848">删除</a>
            </APopconfirm>
            <ADivider type="vertical" v-if="record.status !== 4" />
            <a style="color: #1677ff" @click="handleDetail(record)">
              查看详情</a
            >
          </span>
        </template>
      </template>
    </ATable>
    <AModal v-model:open="visible" :footer="null" title="修改间隔">
      <div>
        <AForm
          :model="messageInfo"
          name="basic"
          :label-col="{ span: 4 }"
          :wrapper-col="{ span: 20 }"
          @finish="handleOk"
          autocomplete="off"
        >
          <AFormItem label="时间间隔" name="newIntervalMinutes">
            <ASelect
              v-model:value="messageInfo.newIntervalMinutes"
              style="width: 100%"
              placeholder="选择时间间隔"
              :options="[
                { value: 1, label: '1分钟' },
                { value: 2, label: '2分钟' },
                { value: 3, label: '3分钟' },
                { value: 5, label: '5分钟' },
                { value: 10, label: '10分钟' },
              ]"
            />
          </AFormItem>
          <AFormItem :wrapper-col="{ span: 14, offset: 4 }">
            <AButton
              style="margin-right: 10px"
              :loading="loading"
              type="primary"
              html-type="submit"
            >
              确认
            </AButton>
            <AButton @click="visible = false"> 取消 </AButton>
          </AFormItem>
        </AForm>
      </div>
    </AModal>
    <AModal
      :width="1300"
      v-model:open="visible1"
      :footer="null"
      title="任务详情"
    >
      <ATable
        :pagination="false"
        :columns="detailColumns"
        :data-source="detailTableData"
        :scroll="{ y: 500 }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'simSlot'">
            <span>
              {{ record.simSlot === 0 ? '卡槽1' : '卡槽2' }}
            </span>
          </template>
        </template>
      </ATable>
    </AModal>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import { useUserStore } from '@vben/stores';

import {
  Button as AButton,
  Divider as ADivider,
  Form as AForm,
  FormItem as AFormItem,
  Modal as AModal,
  Popconfirm as APopconfirm,
  Select as ASelect,
  Table as ATable,
  message,
} from 'ant-design-vue';
import dayjs from 'dayjs';

import {
  delTaskApi,
  getTaskDeatilApi,
  getTaskListApi,
  pauseTaskApi,
  resumeTaskApi,
  updateIntervalApi,
} from '#/api/core/sms';

const columns = [
  {
    title: '任务名称',
    dataIndex: 'batchName',
    width: 160,
  },
  {
    title: '内容',
    dataIndex: 'content',
    // width: 300,
    ellipsis: true,
  },
  {
    title: '时间间隔',
    dataIndex: 'intervalMinutes',
    width: 100,
  },
  {
    title: '总任务数',
    dataIndex: 'totalCount',
    width: 120,
  },
  {
    title: '已发送任务数',
    dataIndex: 'sentCount',
    width: 120,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
    width: 200,
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 120,
  },
  {
    title: '操作',
    key: 'action',
    width: 300,
  },
];
const detailColumns = [
  {
    title: '设备编号',
    dataIndex: 'deviceCode',
    width: 160,
  },
  {
    title: '目标手机号',
    dataIndex: 'phone',
    width: 200,
  },
  {
    title: '手机卡槽',
    dataIndex: 'simSlot',
    key: 'simSlot',
    width: 120,
  },
  {
    title: '短信内容',
    dataIndex: 'content',
    width: 220,
    ellipsis: true,
  },
  {
    title: '计划发送时间',
    dataIndex: 'sendTime',
    width: 180,
  },
  {
    title: '发送状态',
    dataIndex: 'status',
    width: 120,
  },
  {
    title: '状态说明',
    dataIndex: 'statusDesc',
    width: 220,
    ellipsis: true,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 180,
  },
];
const userStore = useUserStore();
const loading = ref(false);
const tableData = ref([]);
const detailTableData = ref([]);
const visible = ref(false);
const visible1 = ref(false);
const messageInfo = ref({
  id: '',
  newIntervalMinutes: undefined,
});
function getStatusText(status) {
  return statusMap.value[status];
}
const statusMap = ref({
  1: '执行中',
  2: '已暂停',
  3: '已完成',
  4: '已删除',
});
async function getTaskList() {
  const res = await getTaskListApi();
  tableData.value = Array.isArray(res) && res.length > 0 ? res : [];
}
function handleEdit(record) {
  // messageInfo.value = JSON.parse(JSON.stringify(record));
  messageInfo.value.id = record.id;
  messageInfo.value.newIntervalMinutes = record.intervalMinutes;
  visible.value = true;
}
async function handleDetail(record) {
  visible1.value = true;
  const res = await getTaskDeatilApi({
    taskId: record.id,
  });
  detailTableData.value = Array.isArray(res) && res.length > 0 ? res : [];
}
async function handleOk() {
  loading.value = true;
  const res = await updateIntervalApi({
    taskId: messageInfo.value.id,
    newIntervalMinutes: messageInfo.value.newIntervalMinutes,
  });
  if (res && res.includes('成功')) {
    message.success(res);
    visible.value = false;
    getTaskList();
  } else {
    message.error(res);
  }
  setTimeout(() => {
    loading.value = false;
  }, 300);
}
async function handlePause(record) {
  const res = await pauseTaskApi({
    batchId: record.id,
  });
  message.success(res);
  getTaskList();
}
async function handleResume(record) {
  const res = await resumeTaskApi({
    batchId: record.id,
  });
  message.success(res);
  getTaskList();
}
async function handleDel(record) {
  const res = await delTaskApi({
    batchId: record.id,
  });
  message.success(res);
  getTaskList();
}
onMounted(() => {
  getTaskList();
});
</script>
