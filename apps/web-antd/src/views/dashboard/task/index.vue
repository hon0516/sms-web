<template>
  <div class="m-[20px]">
    <ATable :pagination="false" :columns="columns" :data-source="tableData">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'createTime'">
          <span>
            {{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
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
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import { useUserStore } from '@vben/stores';

import {
  Button as AButton,
  Form as AForm,
  FormItem as AFormItem,
  message,
  Modal as AModal,
  Select as ASelect,
  Table as ATable,
} from 'ant-design-vue';
import dayjs from 'dayjs';

import { getTaskListApi, updateIntervalApi } from '#/api/core/sms';

const columns = [
  {
    title: '任务名称',
    dataIndex: 'batchName',
  },
  {
    title: '内容',
    dataIndex: 'content',
  },
  {
    title: '时间间隔',
    dataIndex: 'intervalMinutes',
  },
  {
    title: '总任务数',
    dataIndex: 'totalCount',
  },
  {
    title: '已发送任务数',
    dataIndex: 'sentCount',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
  },
  {
    title: '操作',
    key: 'action',
  },
];
const userStore = useUserStore();
const loading = ref(false);
const tableData = ref([]);
const visible = ref(false);
const messageInfo = ref({
  id: '',
  newIntervalMinutes: undefined,
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
onMounted(() => {
  getTaskList();
});
</script>
