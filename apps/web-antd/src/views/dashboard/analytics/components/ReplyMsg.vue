<template>
  <div class="mt-[20px]">
    <ATable
      :row-key="(record) => record.id"
      :pagination="sendData"
      @change="sendData.onChange"
      :columns="columns"
      :data-source="data"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'status'">
          <Tag v-if="record.status === 1" color="green">已读</Tag>
          <Tag v-else color="red">未读</Tag>
        </template>
        <template v-if="column.key === 'phone'">
          <a style="color: #1677ff" @click="handleDetail(record)">{{
            record.phone
          }}</a>
        </template>
      </template>
    </ATable>
  </div>
</template>
<script lang="ts" setup>
import { onActivated, ref, watch } from 'vue';
import { onBeforeRouteLeave, useRouter } from 'vue-router';

import { useIntervalFn } from '@vueuse/core';
import { Table as ATable, Tag } from 'ant-design-vue';

import { getMessageListApi } from '#/api/core/sms';

const props = defineProps({
  deviceCode: {
    type: Array,
    default: [],
  },
  typeValue: {
    type: Number,
    default: undefined,
  },
});
const columns = [
  {
    title: '手机号码',
    dataIndex: 'phone',
    key: 'phone',
    width: 200,
  },
  {
    title: '短信内容',
    dataIndex: 'lastMessage',
    width: 300,
  },
  {
    title: '时间',
    dataIndex: 'lastTime',
    width: 200,
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 120,
  },
];
const { push } = useRouter();
interface DataItem {
  title: string;
  description: string;
  time: string;
}
const data = ref<DataItem[]>([]);
const sendData = ref({
  pageNum: 1,
  pageSize: 10,
  total: 0,
  onChange: (pagination) => {
    if (typeof pagination === 'object') {
      pageChange(pagination.current, pagination.pageSize);
    }
  },
});
function pageChange(page: number, pageSize: number) {
  sendData.value.pageNum = page;
  sendData.value.pageSize = pageSize;
  getList(props.deviceCode);
}
function handleDetail(row) {
  push(
    `/messageDetail?phone=${encodeURIComponent(row.phone)}&deviceCode=${row.deviceCode}`,
  );
}
async function getList(deviceCode) {
  const res = await getMessageListApi({
    deviceCode:
      deviceCode.length > 0 && deviceCode[0] ? deviceCode.join(',') : undefined,
    type: 1,
    pageNum: sendData.value.pageNum,
    pageSize: sendData.value.pageSize,
  });
  sendData.value.total = res.total;
  data.value =
    Array.isArray(res.list) && res.list.length > 0
      ? res.list.map((item) => {
          return {
            ...item,
          };
        })
      : [];
}
// 定时器
const { pause, resume } = useIntervalFn(() => {
  getList(props.deviceCode);
}, 60 * 1000);
onActivated(() => {
  resume();
  getList(props.deviceCode);
});
onBeforeRouteLeave(() => pause());

watch(
  () => props.deviceCode,
  (newVal) => {
    getList(newVal);
  },
  { immediate: true },
);
watch(
  () => props.typeValue,
  () => {
    getList(props.deviceCode);
  },
);
</script>
