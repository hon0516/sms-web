<template>
  <div class="mt-[20px]">
    <ATable
      :row-key="(record) => record.id"
      :pagination="sendData"
      @change="sendData.onChange"
      :columns="columns"
      :data-source="data"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'status'">
          <Tag v-if="record.status === 1" color="green">已读</Tag>
          <Tag v-else color="red">未读</Tag>
        </template>
        <template v-if="column.key === 'phone'">
          <a style="color: #1677ff" @click="handleDetail(record)">{{
            record.phone
          }}</a>
        </template>
        <template v-else-if="column.key === 'action'">
          <a style="color: #1677ff" @click="handleEdit(record)">备注</a>
        </template>
      </template>
    </ATable>
    <AModal v-model:open="visible" :footer="null" title="备注">
      <div>
        <AForm
          :model="messageInfo"
          name="basic"
          :label-col="{ span: 4 }"
          :wrapper-col="{ span: 20 }"
          @finish="submitBind"
          autocomplete="off"
        >
          <AFormItem label="备注" name="remark">
            <ATextarea
              :rows="2"
              placeholder="输入备注"
              v-model:value="messageInfo.remark"
            />
          </AFormItem>
          <AFormItem :wrapper-col="{ span: 14, offset: 4 }">
            <AButton
              style="margin-right: 10px"
              type="primary"
              html-type="submit"
            >
              确认
            </AButton>
            <AButton @click="visible = false"> 取消 </AButton>
          </AFormItem>
        </AForm>
      </div>
    </AModal>
  </div>
</template>
<script lang="ts" setup>
import { onActivated, ref, watch } from 'vue';
import { onBeforeRouteLeave, useRouter } from 'vue-router';

import { useIntervalFn } from '@vueuse/core';
import {
  Button as AButton,
  Form as AForm,
  FormItem as AFormItem,
  Modal as AModal,
  Table as ATable,
  Textarea as ATextarea,
  message,
  Tag,
} from 'ant-design-vue';

import { addReplyRemarkApi, getMessageListApi } from '#/api/core/sms';

const props = defineProps({
  deviceCode: {
    type: Array,
    default: [],
  },
  typeValue: {
    type: Number,
    default: undefined,
  },
});
const visible = ref(false);
const messageInfo = ref({
  id: '',
  remark: '',
});
const columns = [
  {
    title: '操作',
    key: 'action',
    width: 60,
  },
  {
    title: '手机号码',
    dataIndex: 'phone',
    key: 'phone',
    width: 140,
  },
  {
    title: '短信内容',
    dataIndex: 'lastMessage',
    width: 300,
  },
  {
    title: '跟进备注',
    dataIndex: 'remark',
    width: 140,
  },
  {
    title: '时间',
    dataIndex: 'lastTime',
    width: 200,
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 120,
  },
];
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
  onChange: (pagination) => {
    if (typeof pagination === 'object') {
      pageChange(pagination.current, pagination.pageSize);
    }
  },
});
function pageChange(page: number, pageSize: number) {
  sendData.value.pageNum = page;
  sendData.value.pageSize = pageSize;
  getList(props.deviceCode);
}
function handleDetail(row) {
  push(
    `/messageDetail?phone=${encodeURIComponent(row.phone)}&deviceCode=${row.deviceCode}`,
  );
}
async function getList(deviceCode) {
  const res = await getMessageListApi({
    deviceCode:
      deviceCode.length > 0 && deviceCode[0] ? deviceCode.join(',') : undefined,
    type: 1,
    pageNum: sendData.value.pageNum,
    pageSize: sendData.value.pageSize,
  });
  sendData.value.total = res.total;
  data.value =
    Array.isArray(res.list) && res.list.length > 0
      ? res.list.map((item) => {
          return {
            ...item,
          };
        })
      : [];
}
function handleEdit(row) {
  messageInfo.value = {
    id: row.id,
    remark: row.remark,
  };
  visible.value = true;
}
async function submitBind() {
  const res = await addReplyRemarkApi(messageInfo.value);
  if (res === 1) {
    message.success('操作成功');
    getList(props.deviceCode);
    visible.value = false;
  } else {
    message.error(res);
  }
}
// 定时器
const { pause, resume } = useIntervalFn(() => {
  getList(props.deviceCode);
}, 60 * 1000);
onActivated(() => {
  resume();
  getList(props.deviceCode);
});
onBeforeRouteLeave(() => pause());

watch(
  () => props.deviceCode,
  (newVal) => {
    getList(newVal);
  },
  { immediate: true },
);
watch(
  () => props.typeValue,
  () => {
    getList(props.deviceCode);
  },
);
</script>
