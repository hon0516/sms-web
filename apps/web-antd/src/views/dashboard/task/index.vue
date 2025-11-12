<template>
  <div class="m-[20px]">
    <ATable
      :pagination="sendData"
      @change="sendData.onChange"
      :columns="columns"
      :data-source="tableData"
    >
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
            <a style="color: #1677ff" @click="handleEdit(record)">修改间隔</a>
            <ADivider type="vertical" v-if="record.status === 1" />
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
      <div>
        <div class="flex items-center">
          <AInput
            style="width: 200px; margin: 10px 0"
            v-model:value="detailPagination.deviceCode"
            placeholder="输入设备编号查询"
          />
          <AButton @click="getDetail" type="primary" class="mx-[10px]">
            查询
          </AButton>
          <AButton @click="handleReload" type="primary">重置</AButton>
        </div>

        <ATable
          :pagination="detailPagination"
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
      </div>
    </AModal>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import {
  Button as AButton,
  Divider as ADivider,
  Form as AForm,
  FormItem as AFormItem,
  Input as AInput,
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
    title: '操作',
    key: 'action',
    width: 300,
  },
  {
    title: '任务名称',
    dataIndex: 'batchName',
    width: 160,
  },
  {
    title: '内容',
    dataIndex: 'content',
    // width: 250,
    // ellipsis: true,
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
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 120,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
    width: 180,
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
    title: '执行顺序',
    dataIndex: 'seqNo',
    width: 100,
  },
  {
    title: '短信内容',
    dataIndex: 'content',
    width: 220,
    ellipsis: true,
  },
  {
    title: '任务执行时间',
    dataIndex: 'executionTime',
    width: 180,
  },
  {
    title: '实际发送时间',
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
];

const loading = ref(false);
const tableData = ref([]);
const detailTableData = ref([]);
const visible = ref(false);
const visible1 = ref(false);
const messageInfo = ref({
  id: '',
  newIntervalMinutes: undefined,
});
const detailId = ref('');
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
  const res = await getTaskListApi({
    pageNum: sendData.value.pageNum,
    pageSize: sendData.value.pageSize,
  });
  sendData.value.total = res.total;
  tableData.value =
    Array.isArray(res.list) && res.list.length > 0 ? res.list : [];
}
function handleEdit(record) {
  // messageInfo.value = JSON.parse(JSON.stringify(record));
  messageInfo.value.id = record.id;
  messageInfo.value.newIntervalMinutes = record.intervalMinutes;
  visible.value = true;
}
async function handleDetail(record) {
  visible1.value = true;
  detailId.value = record.id;
  getDetail();
}
const sendData = ref({
  pageNum: 1,
  pageSize: 10,
  total: 0,
  onChange: (pagination) => {
    if (typeof pagination === 'object') {
      pageChange(pagination.current, pagination.pageSize);
    } else {
      pageChange(pagination, 10);
    }
  },
});
function pageChange(page: number, pageSize: number) {
  sendData.value.pageNum = page;
  sendData.value.pageSize = pageSize;
  getTaskList();
}
const detailPagination = ref({
  pageNum: 1,
  pageSize: 10,
  total: 0,
  deviceCode: '',
  onChange: (pagination) => {
    console.log(pagination, 'pagination');

    if (typeof pagination === 'object') {
      detailPageChange(pagination.current, pagination.pageSize);
    } else {
      detailPageChange(pagination, 10);
    }
  },
});
function detailPageChange(page: number, pageSize: number) {
  detailPagination.value.pageNum = page;
  detailPagination.value.pageSize = pageSize;
  getDetail();
}
async function getDetail() {
  const res = await getTaskDeatilApi({
    taskId: detailId.value,
    deviceCode: detailPagination.value.deviceCode,
    pageNum: detailPagination.value.pageNum,
    pageSize: detailPagination.value.pageSize,
  });
  detailPagination.value.total = res.total;
  detailTableData.value =
    Array.isArray(res.list) && res.list.length > 0 ? res.list : [];
}
function handleReload() {
  detailPagination.value.deviceCode = '';
  getDetail();
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
