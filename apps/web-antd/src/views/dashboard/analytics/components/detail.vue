<template>
  <section class="MessageDetail">
    <APageHeader style="border: 1px solid rgb(235 237 240)" @back="handleBack">
      <template #title>
        <!-- {{ query.deviceCode }}  -->
        <ASelect
          v-model:value="currentDevice"
          style="width: 160px; margin-right: 10px"
          :allow-clear="false"
          :options="deviceOptions"
          @change="handleDeviceChange"
        />
        {{ query.phone }}
      </template>

      <template #extra>
        <AButton type="primary" @click="getMessageRecord">刷新消息</AButton>
      </template>
    </APageHeader>
    <div class="message-content" ref="scrollContainer">
      <div v-for="item in messageList" :key="item.id">
        <div class="mb-[10px] flex justify-end" v-if="item.type === 0">
          <div class="flex flex-col items-end">
            <div class="mesage-detail">
              {{ item.simSlot === 0 ? 'SIM1' : 'SIM2' }} &nbsp;{{
                dayjs(item.smsTime).format('YYYY-MM-DD HH:mm:ss')
              }}
            </div>
            <div class="flex items-center">
              <SvgLoadingIcon
                class="mr-[10px] size-5"
                v-if="item.status === 'sending'"
              />
              <img
                v-if="item.status === 'failed'"
                class="mr-[10px] h-[20px] w-[20px]"
                src="/static/fail.png"
                alt=""
              />
              <div class="message-li bg-[#95ec69]">
                {{ item.content }}
              </div>
            </div>
          </div>
        </div>
        <div class="mt-[20px]" v-else>
          <div class="mesage-detail">
            {{ item.simSlot === 0 ? 'SIM1' : 'SIM2' }} &nbsp;{{
              dayjs(item.smsTime).format('YYYY-MM-DD HH:mm:ss')
            }}
          </div>
          <div class="flex items-center">
            <div class="message-li bg-[#ededed]">
              {{ item.content }}
            </div>
            <SvgLoadingIcon
              class="ml-[10px] size-5"
              v-if="item.status === 'sending'"
            />
            <img
              v-if="item.status === 'failed'"
              class="ml-[10px] h-[20px] w-[20px]"
              src="/static/fail.png"
              alt=""
            />
          </div>
        </div>
      </div>
    </div>
    <div class="message-send">
      <ATextarea
        ref="messageRef"
        @keyup.enter="sendMessage"
        v-model:value="message"
      />
    </div>
    <div class="send-button">
      <AButton type="primary" @click="sendMessage">发送</AButton>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { nextTick, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import { SvgLoadingIcon } from '@vben/icons';

import {
  Button as AButton,
  message as AMessage,
  PageHeader as APageHeader,
  Select as ASelect,
  Textarea as ATextarea,
} from 'ant-design-vue';
import dayjs from 'dayjs';

import {
  getDeviceCodeByPhoneApi,
  getMessageRecordApi,
  sendMessageApi,
} from '#/api/core/sms';
const currentDevice = ref('');
const { query } = useRoute();
const scrollContainer = ref();
const message = ref('');
const messageRef = ref();
const messageList = ref([]);
const deviceOptions = ref([]);
function handleBack() {
  window.history.back();
}
// 滚动到底部的函数
const scrollToBottom = () => {
  // message-content
  const el = document.querySelector('.message-content');
  el.scrollTop = el.scrollHeight;
};
async function getMessageRecord() {
  const res = await getMessageRecordApi({
    phone: query.phone,
    deviceCode: currentDevice.value,
  });
  messageList.value = res;
}
async function sendMessage() {
  const smsSlot = messageList.value[0].simSlot;
  messageList.value.push({
    id: Date.now(),
    type: 0,
    status: 'sending',
    content: message.value,
    simSlot: 0,
    smsTime: Date.now(),
  });
  const res = await sendMessageApi({
    phone: query.phone,
    deviceCode: currentDevice.value,
    content: message.value,
    smsSlot,
  });
  message.value = '';

  if (res == 1) {
    messageList.value[messageList.value.length - 1].status = 'success';
  } else {
    AMessage.error(res);
  }

  // getMessageRecord();
}
function handleDeviceChange(data) {
  console.log(data);
  currentDevice.value = data;
  getMessageRecord();
}
async function getDeviceCodeByPhone() {
  const res = await getDeviceCodeByPhoneApi({
    phone: query.phone,
  });
  deviceOptions.value = res.map((item) => {
    return {
      label: item,
      value: item,
    };
  });
}
onMounted(() => {
  currentDevice.value = query.deviceCode;
  if (messageRef.value) {
    messageRef.value.focus();
  }
  nextTick(() => {
    scrollToBottom();
  });
  getDeviceCodeByPhone();
  getMessageRecord();
});
</script>
<style lang="less" scoped>
.MessageDetail {
  height: 100%;
  position: relative;
  // margin: 50px 200px;
  background: #fff;
  // border-radius: 20px;
  display: flex;
  flex-direction: column;
  .header {
    height: 50px;
    border-bottom: 1px solid #d5d5d5;
  }
  .message-content {
    padding: 30px;
    height: 545px;
    // flex: 1;
    overflow-y: auto;
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

    :deep .ant-input {
      height: 100%;
      border: none;
      background: transparent;
    }
  }
  .send-button {
    position: absolute;
    right: 20px;
    bottom: 20px;
  }
}
</style>
