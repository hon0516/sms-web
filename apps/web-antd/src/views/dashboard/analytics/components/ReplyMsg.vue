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
              <div class="flex">
                <a class="mr-[10px]" @click="handleDetail(item)">{{
                  item.title
                }}</a>
                <Tag v-if="item.type === 1" color="orange">收</Tag>
                <Tag v-else color="green">发</Tag>
              </div>
            </template>
          </ListItemMeta>
          <template #extra>
            <div>
              {{ item.time }}
            </div>
          </template>
        </ListItem>
      </template>
    </List>
  </div>
</template>
<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';

import { List, ListItem, ListItemMeta, Tag } from 'ant-design-vue';

import { getMessageListApi } from '#/api/core/sms';

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
  onChange: (page: number) => {
    pageChange(page);
  },
});
function pageChange(page: number) {
  sendData.value.pageNum = page;
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

watch(
  () => props.deviceCode,
  (newVal) => {
    getList(newVal);
  },
  { immediate: true, deep: true },
);
</script>
