<template>
  <div class="MessageDetail">
    <div>
      <APageHeader title="设备1 18213413413" @back="handleBack" />
    </div>
    <div class="message-content">
      <div v-for="item in messageList" :key="item.id">
        <div class="flex justify-end">
          <div class="flex flex-col items-end">
            <div class="mesage-detail">
              {{ item.equName }} &nbsp; &nbsp;{{ item.time }}
            </div>
            <div class="message-li bg-[#95ec69]">
              {{ item.user }}
            </div>
          </div>
        </div>
        <div class="mt-[20px]">
          <div class="mesage-detail">
            {{ item.equName }} &nbsp; &nbsp;{{ item.phone }} &nbsp; &nbsp;{{
              item.time
            }}
          </div>
          <div class="message-li bg-[#ededed]">
            {{ item.aggent }}
          </div>
        </div>
      </div>
    </div>
    <div class="message-send">
      <ATextarea ref="messageRef" v-model:value="message" />
      <div class="send-button">
        <AButton type="primary">发送</AButton>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import {
  Button as AButton,
  PageHeader as APageHeader,
  Textarea as ATextarea,
} from 'ant-design-vue';

const message = ref('');
const messageRef = ref();
const messageList = ref([
  {
    id: 1,
    user: '你好',
    aggent: '您好，请问有什么可以帮助您的？',
    time: '2024-01-01 12:00:00',
    equName: 'sim1',
    phone: '13800138000',
  },
]);
function handleBack() {
  window.history.back();
}
onMounted(() => {
  if (messageRef.value) {
    messageRef.value.focus();
  }
});
</script>
<style lang="less" scoped>
.MessageDetail {
  height: calc(100% - 100px);
  margin: 50px 200px;
  background: #fff;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  .message-content {
    padding: 30px;
    flex: 1;
    .mesage-detail {
      color: #a9a9ae;
    }
    .message-li {
      border-radius: 10px;
      padding: 10px;
      width: fit-content;
    }
  }
  .message-send {
    height: 200px;
    overflow-y: auto;
    border-radius: 0 0 20px 20px;
    border-top: 1px solid #d5d5d5;
    position: relative;
    .send-button {
      position: absolute;
      right: 20px;
      bottom: 20px;
    }
    :deep .ant-input {
      height: 100%;
      border: none;
      background: transparent;
    }
  }
}
</style>
