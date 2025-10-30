<template>
  <div class="mt-[20px]">
    <List item-layout="horizontal" :data-source="data" bordered>
      <template #renderItem="{ item }">
        <ListItem>
          <ListItemMeta :description="item.description">
            <template #title>
              <a>{{ item.title }}</a>
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
import { List, ListItem, ListItemMeta } from 'ant-design-vue';

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
  },
  {
    title: '18341344214',
    description: '您的验证码是789012，有效期10分钟，请勿泄露给他人。',
    time: '2024-01-01 12:00:00',
  },
];
</script>
