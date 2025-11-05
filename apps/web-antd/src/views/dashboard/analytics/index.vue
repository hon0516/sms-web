<template>
  <div class="analytics-box m-[20px]">
    <ATabs v-model:active-key="activeKey">
      <a-tab-pane key="1" tab="消息分组" />
      <a-tab-pane key="2" tab="消息记录" />
    </ATabs>
    <ASelect
      v-model:value="selectValue"
      placeholder="选择设备"
      mode="tags"
      style="width: 200px"
      :allow-clear="true"
      :options="options"
      @change="handleChange"
    />

    <component :is="componentsMap[activeKey]" :device-code="selectValue" />
    <div>
      <img
        @click="showModal"
        class="fixed bottom-[80px] right-[20px] h-[40px] w-[40px] cursor-pointer"
        src="/static/add.png"
        alt=""
      />
    </div>
    <AModal v-model:open="visible" :footer="null" title="短信下发">
      <div>
        <AForm
          :model="messageInfo"
          name="basic"
          :label-col="{ span: 4 }"
          :wrapper-col="{ span: 20 }"
          @finish="handleOk"
          autocomplete="off"
        >
          <AFormItem
            label="设备编号"
            name="codes"
            :rules="[{ required: true, message: '请选择设备!' }]"
          >
            <ASelect
              v-model:value="messageInfo.codes"
              style="width: 100%"
              mode="tags"
              placeholder="选择设备"
              :options="options"
              @change="handleChange"
            />
          </AFormItem>
          <AFormItem
            label="收件人"
            name="phones"
            :rules="[{ required: true, message: '输入收件人!' }]"
          >
            <ATextarea
              :rows="6"
              placeholder="输入收件人"
              v-model:value="messageInfo.phones"
            />
            <!-- <ImportExcel @success="loadDataSuccess">
              <AButton class="mt-[10px]" type="primary">导入</AButton>
            </ImportExcel> -->
          </AFormItem>
          <AFormItem label="发送间隔" name="intervalMinutes">
            <ASelect
              v-model:value="messageInfo.intervalMinutes"
              style="width: 100%"
              placeholder="选择发送间隔"
              :options="[
                { value: 1, label: '1分钟' },
                { value: 2, label: '2分钟' },
                { value: 3, label: '3分钟' },
                { value: 5, label: '5分钟' },
                { value: 10, label: '10分钟' },
              ]"
            />
          </AFormItem>
          <AFormItem
            :rules="[{ required: true, message: '输入短信内容!' }]"
            label="短信内容"
            name="content"
          >
            <ATextarea
              :rows="10"
              placeholder="编辑短信内容"
              v-model:value="messageInfo.content"
            />
          </AFormItem>
          <AFormItem :wrapper-col="{ span: 14, offset: 4 }">
            <AButton :loading="loading" type="primary" html-type="submit">
              确认下发
            </AButton>
          </AFormItem>
        </AForm>
      </div>
    </AModal>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue';

import {
  Button as AButton,
  Form as AForm,
  FormItem as AFormItem,
  Modal as AModal,
  Select as ASelect,
  Tabs as ATabs,
  Textarea as ATextarea,
  message,
} from 'ant-design-vue';

import { createMessageBatchApi, getDeviceListApi } from '#/api/core/sms';
// import ImportExcel from '#/components/ImportExcel/ImportExcel.vue';

import MessageRecord from './components/MessageRecord.vue';
import Notifications from './components/Notifications.vue';

const visible = ref(false);
const loading = ref(false);
const activeKey = ref('1');
const componentsMap = {
  '1': Notifications,
  '2': MessageRecord,
};
const selectValue = ref([]);
const messageInfo = reactive({
  codes: [],
  deviceCodes: '',
  phones: '',
  content: '',
  intervalMinutes: 5,
  deviceIds: '',
});
const options = ref([]);
function handleChange(data, option) {
  console.log(option);
  if (Array.isArray(data) && data.length > 0) {
    messageInfo.deviceIds = option.map((item) => item.id).join(',');
    messageInfo.intervalMinutes = option[0].defaultInterval;
  } else {
    messageInfo.deviceIds = '';
    messageInfo.intervalMinutes = 5;
  }
}
async function getDeviceList() {
  const res = await getDeviceListApi();
  if (Array.isArray(res) && res.length > 0) {
    options.value = res.map((item) => ({
      value: item.deviceCode,
      label: item.deviceCode,
      defaultInterval: item.defaultInterval,
      id: item.deviceId,
    }));
    // options.value.unshift({
    //   value: '',
    //   label: '全部',
    //   defaultInterval: 5,
    // });
  }
}
const showModal = () => {
  visible.value = true;
};
const handleOk = async () => {
  // visible.value = false;
  if (messageInfo.codes && messageInfo.codes.length > 0) {
    messageInfo.deviceCodes = messageInfo.codes.join(',');
  }
  loading.value = true;
  const res = await createMessageBatchApi(messageInfo);
  if (res && res.includes('成功') > -1) {
    message.success(res);
    visible.value = false;
    messageInfo.codes = [];
    messageInfo.phones = '';
    messageInfo.content = '';
    messageInfo.deviceIds = '';
    messageInfo.deviceCodes = '';
    messageInfo.intervalMinutes = 5;
  } else {
    message.error('下发失败');
  }
  setTimeout(() => {
    loading.value = false;
  }, 300);
};
function loadDataSuccess(excelDataList) {
  console.log(excelDataList);
}
onMounted(() => {
  getDeviceList();
});
</script>

<style lang="less" scoped>
.analytics-box {
  background: #fff;
  padding: 20px;
  padding-top: 10px;
  border-radius: 10px;
  // height: 100%;
}
</style>
