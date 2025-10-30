<template>
  <div class="m-[20px]">
    <ATabs v-model:active-key="activeKey">
      <a-tab-pane key="1" tab="消息记录" />
      <a-tab-pane key="2" tab="通知" />
    </ATabs>
    <ASelect
      v-model:value="selectValue"
      placeholder="选择设备"
      style="width: 200px"
      :allow-clear="true"
      :options="options"
      @change="handleChange"
    />
    <component :is="componentsMap[activeKey]" />
    <div>
      <img
        @click="showModal"
        class="fixed bottom-[80px] right-[20px] h-[40px] w-[40px] cursor-pointer"
        src="/static/add.png"
        alt=""
      />
    </div>
    <AModal v-model:visible="visible" title="Basic Modal" @ok="handleOk">
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
    </AModal>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';

import {
  Modal as AModal,
  Select as ASelect,
  Tabs as ATabs,
} from 'ant-design-vue';

import MessageRecord from './components/MessageRecord.vue';
import Notifications from './components/Notifications.vue';

const visible = ref(false);
const activeKey = ref('1');
const componentsMap = {
  '1': MessageRecord,
  '2': Notifications,
};
const selectValue = ref(undefined);
const options = ref([
  {
    value: '2',
    label: '设备1',
  },
  {
    value: '3',
    label: '设备2',
  },
]);
function handleChange(data) {}

const showModal = () => {
  visible.value = true;
};

const handleOk = (e: MouseEvent) => {
  console.log(e);
  visible.value = false;
};
</script>
