<template>
  <div class="mt-[20px]">
    <!-- <List
      :pagination="sendData"
      @change="sendData.onChange"
      item-layout="horizontal"
      :data-source="data"
      bordered
    >
      <template #renderItem="{ item }">
        <ListItem>
          <ListItemMeta :description="item.description">
            <template #title>
              <div class="flex cursor-pointer" @click="handleDetail(item)">
                <a class="mr-[10px] min-w-[200px]">{{ item.title }}</a>
                <div style="color: rgb(50 54 57 / 45%)">
                  {{ item.time }}
                </div>
              </div>
            </template>
          </ListItemMeta>
        </ListItem>
      </template>
    </List> -->
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
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';

import { Table as ATable, Tag } from 'ant-design-vue';

import { getMessageGroupListApi } from '#/api/core/sms';

const props = defineProps({
  deviceCode: {
    type: Array,
    default: [],
  },
});
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
];
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
  const res = await getMessageGroupListApi({
    deviceCode:
      deviceCode.length > 0 && deviceCode[0] ? deviceCode.join(',') : undefined,
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

watch(
  () => props.deviceCode,
  (newVal) => {
    getList(newVal);
  },
  { immediate: true, deep: true },
);
</script>
