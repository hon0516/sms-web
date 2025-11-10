<template>
  <div class="mt-[20px]">
    <AButton
      class="mb-[10px]"
      v-if="selectedRowKeys.length > 0"
      @click="handleDel"
      type="primary"
      danger
    >
      批量删除
    </AButton>
    <ATable
      :row-selection="{
        selectedRowKeys,
        onChange: onSelectChange,
      }"
      :row-key="(record) => record.id"
      :pagination="sendData"
      @change="sendData.onChange"
      :columns="columns"
      :data-source="data"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'lastType'">
          <Tag v-if="record.lastType === 1" color="orange">收</Tag>
          <Tag v-else color="green">发</Tag>
        </template>
        <template v-if="column.key === 'phone'">
          <a style="color: #1677ff" @click="handleDetail(record)">{{
            record.phone
          }}</a>
        </template>
        <template v-else-if="column.key === 'action'">
          <span>
            <APopconfirm
              title="是否确认删除?"
              ok-text="是"
              cancel-text="否"
              @confirm="handleDel(record)"
            >
              <a style="color: #ff4848">删除</a>
            </APopconfirm>
          </span>
        </template>
      </template>
    </ATable>
  </div>
</template>
<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';

import {
  Button as AButton,
  Popconfirm as APopconfirm,
  Table as ATable,
  message,
  Tag,
} from 'ant-design-vue';

import { deleteMessageApi, getMessageListApi } from '#/api/core/sms';

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
const selectedRowKeys = ref([]);
const selectedRows = ref([]);
const onSelectChange = (keys, rows) => {
  // console.log('selectedRowKeys changed:', rows);
  selectedRows.value = rows;
  selectedRowKeys.value = keys;
};
const columns = [
  {
    title: '操作',
    key: 'action',
    width: 80,
  },
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
    title: '收发状态',
    dataIndex: 'lastType',
    key: 'lastType',
    width: 200,
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
    type: props.typeValue,
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
async function handleDel(record) {
  const array = selectedRows.value.length > 0 ? selectedRows.value : [record];
  const res = await deleteMessageApi(array);
  if (res == 1) {
    message.success('删除成功');
    selectedRowKeys.value = [];
    selectedRows.value = [];
    getList(props.deviceCode);
  } else {
    message.error(res);
  }
}

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
