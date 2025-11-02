<template>
  <div class="m-[20px]">
    <ATabs v-model:active-key="activeKey">
      <a-tab-pane key="1" tab="消息分组" />
      <a-tab-pane key="2" tab="消息记录" />
    </ATabs>
    <ASelect
      v-model:value="selectValue"
      mode="tags"
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
    <AModal
      v-model:visible="visible"
      title="短信下发"
      @ok="handleOk"
      ok-text="确认下发"
    >
      <div>
        <div>
          <ASelect
            v-model:value="messageInfo.equ"
            mode="tags"
            style="width: 100%"
            placeholder="选择设备"
            :options="options"
            @change="handleChange"
          />
        </div>
        <div class="mt-[20px]">
          <ATextarea
            :rows="6"
            show-search
            placeholder="输入收件人信息"
            v-model:value="messageInfo.person"
          />
        </div>
        <div class="mt-[20px]">
          <ATextarea
            :rows="10"
            show-search
            placeholder="编辑短信内容"
            ref="messageRef"
            v-model:value="messageInfo.content"
          />
        </div>
      </div>
    </AModal>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import {
  Modal as AModal,
  Select as ASelect,
  Tabs as ATabs,
  Textarea as ATextarea,
} from 'ant-design-vue';

import { getDeviceListApi } from '#/api/core/user';

import MessageRecord from './components/MessageRecord.vue';
import Notifications from './components/Notifications.vue';

const visible = ref(false);
const activeKey = ref('1');
const messageRef = ref();
const componentsMap = {
  '1': MessageRecord,
  '2': Notifications,
};
const selectValue = ref(undefined);
const messageInfo = ref({
  equ: undefined,
  person: '',
  content: '',
});
const options = ref([
  {
    value: '1',
    label: '全部',
  },
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
async function getDeviceList() {
  const res = await getDeviceListApi();
  if (Array.isArray(res) && res.length > 0) {
    options.value = res.map((item) => ({
      value: item.id,
      label: item.deviceCode,
    }));
    options.value.unshift({
      value: undefined,
      label: '全部',
    });
  }
}
const showModal = () => {
  visible.value = true;
};

const handleOk = (e: MouseEvent) => {
  visible.value = false;
};
onMounted(() => {
  getDeviceList();
});
</script>
