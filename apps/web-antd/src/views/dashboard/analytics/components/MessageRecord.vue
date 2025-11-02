<template>
  <div class="mt-[20px]">
    <List item-layout="horizontal" :data-source="data" bordered>
      <template #renderItem="{ item }">
        <ListItem>
          <ListItemMeta :description="item.description">
            <template #title>
              <a @click="handleDetail">{{ item.title }}</a>
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

import { List, ListItem, ListItemMeta } from 'ant-design-vue';

const { push } = useRouter();
interface DataItem {
  title: string;
  description: string;
  time: string;
}

const data: DataItem[] = [
  {
    title: '中国电信',
    description: '余额不足提醒...请及时充值',
    time: '2024-01-01 12:00:00',
  },
  {
    title: '中国电信',
    description: '余额不足提醒...请及时充值',
    time: '2024-01-01 12:00:00',
  },
  {
    title: '中国移动',
    description: '余额不足提醒...请及时充值',
    time: '2024-01-01 12:00:00',
  },
  {
    title: '小红书',
    description: '您的验证码是2124951，有效期10分钟，请勿泄露给他人。',
    time: '2024-01-01 12:00:00',
  },
];
function handleDetail() {
  push('/messageDetail');
}
</script>
