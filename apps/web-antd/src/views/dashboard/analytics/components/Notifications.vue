<template>
  <div class="mt-[20px]">
    <List item-layout="horizontal" :data-source="data" bordered>
      <template #renderItem="{ item }">
        <ListItem>
          <ListItemMeta :description="item.description">
            <template #title>
              <div class="flex">
                <a class="mr-[10px]" @click="handleDetail">{{ item.title }}</a>
                <Tag v-if="item.type === 0" color="orange">收</Tag>
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
import { useRouter } from 'vue-router';

import { List, ListItem, ListItemMeta, Tag } from 'ant-design-vue';

const { push } = useRouter();
interface DataItem {
  title: string;
  description: string;
  time: string;
}
const data: DataItem[] = [
  {
    title: '192354515506',
    description:
      '您的快递已到达，请前往取件。快递公司：顺丰速运，取件码：123456',
    time: '2024-01-01 12:00:00',
    type: 1,
  },
  {
    title: '18341344214',
    description: '您的验证码是789012，有效期10分钟，请勿泄露给他人。',
    time: '2024-01-01 12:00:00',
    type: 0,
  },
];
function handleDetail() {
  push('/messageDetail');
}
</script>
