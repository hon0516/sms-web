<template>
  <div class="m-[20px]">
    <ATable :pagination="false" :columns="columns" :data-source="tableData">
      <template #headerCell="{ column }">
        <template v-if="column.key === 'name'">
          <span>
            <smile-outlined />
            Name
          </span>
        </template>
      </template>

      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'createTime'">
          <span>
            {{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
          </span>
        </template>

        <template v-else-if="column.key === 'action'">
          <span>
            <a style="color: #1677ff" @click="handleBind(record)">绑定设备</a>
            <ADivider type="vertical" />
            <a style="color: #1677ff">修改</a>
          </span>
        </template>
      </template>
    </ATable>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import { useUserStore } from '@vben/stores';

import { Divider as ADivider, Table as ATable, message } from 'ant-design-vue';
import dayjs from 'dayjs';

import { bindDeviceApi, getDeviceListApi } from '#/api/core/sms';

const columns = [
  {
    title: '设备编码',
    dataIndex: 'deviceCode',
  },
  {
    title: '发送间隔',
    dataIndex: 'defaultInterval',
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
const tableData = ref([]);
async function getDeviceList() {
  const res = await getDeviceListApi();
  if (Array.isArray(res) && res.length > 0) {
    tableData.value = res;
  } else {
    tableData.value = [];
  }
}
async function handleBind(record) {
  const res = await bindDeviceApi({
    userId: userStore.userInfo.id,
    deviceId: record.deviceId,
    deviceCode: record.deviceCode,
  });
  if (res === 1) {
    message.success('绑定成功');
  } else {
    message.error(res);
  }
}
onMounted(() => {
  getDeviceList();
});
</script>
