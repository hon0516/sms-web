<template>
  <div class="mt-[20px]">
    <List
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
                <div class="flex min-w-[250px]">
                  <a class="mr-[10px]">{{ item.title }}</a>
                  <Tag v-if="item.type === 1" color="orange">收</Tag>
                  <Tag v-else color="green">发</Tag>
                </div>

                <div style="color: rgb(50 54 57 / 45%)">
                  {{ item.time }}
                </div>
              </div>
            </template>
          </ListItemMeta>
        </ListItem>
      </template>
    </List>
  </div>
</template>
<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';

import { List, ListItem, ListItemMeta, message, Tag } from 'ant-design-vue';

import { deleteMessageApi, getMessageListApi } from '#/api/core/sms';

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
  onChange: (page: number, pageSize: number) => {
    pageChange(page, pageSize);
  },
});
function pageChange(page: number, pageSize: number) {
  sendData.value.pageNum = page;
  sendData.value.pageSize = pageSize;
  getList(props.deviceCode);
}
function handleDetail(row) {
  push(
    `/messageDetail?phone=${encodeURIComponent(row.title)}&deviceCode=${row.deviceCode}`,
  );
}
async function getList(deviceCode) {
  const res = await getMessageListApi({
    deviceCode:
      deviceCode.length > 0 && deviceCode[0] ? deviceCode.join(',') : undefined,
    pageNum: sendData.value.pageNum,
    pageSize: sendData.value.pageSize,
    type: 1,
  });
  sendData.value.total = res.total;
  data.value =
    Array.isArray(res.list) && res.list.length > 0
      ? res.list.map((i) => {
          return {
            title: i.phone,
            description: i.lastMessage,
            time: i.lastTime,
            type: i.lastType,
            deviceCode: i.deviceCode,
          };
        })
      : [];
}
async function handleDel(record) {
  const res = await deleteMessageApi({
    deviceId: record,
  });
  if (res == 1) {
    message.success('删除成功');
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
  { immediate: true, deep: true },
);
</script>
