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
                <!-- <Tag v-if="item.type === 1" color="orange">收</Tag>
                <Tag v-else color="green">发</Tag> -->
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

import { List, ListItem, ListItemMeta } from 'ant-design-vue';

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
  const res = await getMessageGroupListApi({
    deviceCode:
      deviceCode.length > 0 && deviceCode[0] ? deviceCode.join(',') : undefined,
    pageNum: sendData.value.pageNum,
    pageSize: sendData.value.pageSize,
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
