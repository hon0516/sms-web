<template>
  <div class="m-[20px]">
    <ATable :pagination="false" :columns="columns" :data-source="tableData">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'createTime'">
          <span>
            {{
              record.createTime
                ? dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss')
                : '-'
            }}
          </span>
        </template>
        <template v-if="column.key === 'lastOnlineTime'">
          <span>
            {{
              record.lastOnlineTime
                ? dayjs(record.lastOnlineTime).format('YYYY-MM-DD HH:mm:ss')
                : '-'
            }}
          </span>
        </template>
        <template v-else-if="column.key === 'isOnline'">
          <Tag v-if="record.isOnline === 1" color="green">在线</Tag>
          <Tag v-else color="red">离线</Tag>
        </template>
        <template v-else-if="column.key === 'action'">
          <span>
            <a
              v-if="userStore.userInfo.account === 'admin'"
              style="color: #1677ff"
              @click="handleBind(record)"
              >分配用户</a>
            <ADivider
              type="vertical"
              v-if="userStore.userInfo.account === 'admin'"
            />
            <a style="color: #1677ff" @click="handleEdit(record)">编辑</a>
            <ADivider type="vertical" />
            <APopconfirm
              title="是否确认删除?"
              ok-text="是"
              cancel-text="否"
              @confirm="handleDel(record)"
            >
              <a style="color: #ff4848">删除</a>
            </APopconfirm>
          </span>
        </template>
      </template>
    </ATable>
    <AModal v-model:open="visible" :footer="null" title="编辑">
      <div>
        <AForm
          :model="messageInfo"
          name="basic"
          :label-col="{ span: 4 }"
          :wrapper-col="{ span: 20 }"
          @finish="handleOk"
          autocomplete="off"
        >
          <AFormItem label="设备编号">
            <span>{{ messageInfo.deviceCode }}</span>
          </AFormItem>
          <AFormItem label="设备备注" name="remark">
            <ATextarea
              :rows="2"
              placeholder="输入备注"
              v-model:value="messageInfo.remark"
            />
          </AFormItem>
          <AFormItem label="发送间隔" name="defaultInterval">
            <ASelect
              v-model:value="messageInfo.defaultInterval"
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
          <AFormItem :wrapper-col="{ span: 14, offset: 4 }">
            <AButton
              style="margin-right: 10px"
              type="primary"
              :loading="loading"
              html-type="submit"
            >
              确认
            </AButton>
            <AButton @click="visible = false"> 取消 </AButton>
          </AFormItem>
        </AForm>
      </div>
    </AModal>
    <AModal v-model:open="visible1" :footer="null" title="分配用户">
      <div>
        <AForm
          :model="userInfo"
          name="basic"
          :label-col="{ span: 4 }"
          :wrapper-col="{ span: 20 }"
          @finish="submitBind"
          autocomplete="off"
        >
          <AFormItem label="选择用户">
            <ASelect
              v-model:value="userInfo.userIds"
              style="width: 100%"
              mode="tags"
              show-search
              placeholder="选择用户"
              :options="usersOptions"
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
            <AButton @click="visible1 = false"> 取消 </AButton>
          </AFormItem>
        </AForm>
      </div>
    </AModal>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import { useUserStore } from '@vben/stores';

import {
  Button as AButton,
  Divider as ADivider,
  Form as AForm,
  FormItem as AFormItem,
  Modal as AModal,
  Popconfirm as APopconfirm,
  Select as ASelect,
  Table as ATable,
  Textarea as ATextarea,
  message,
  Tag,
} from 'ant-design-vue';
import dayjs from 'dayjs';

import {
  bindDeviceApi,
  delDeviceApi,
  getDeviceListApi,
  getUserListApi,
  updateDeviceApi,
} from '#/api/core/sms';

const columns = [
  {
    title: '操作',
    key: 'action',
    width: 180,
  },
  {
    title: '设备编号',
    dataIndex: 'deviceCode',
  },
  {
    title: '设备备注',
    dataIndex: 'remark',
  },
  {
    title: '发送间隔',
    dataIndex: 'defaultInterval',
  },
  {
    title: '在线状态',
    dataIndex: 'isOnline',
    key: 'isOnline',
  },
  {
    title: '最后更新时间',
    dataIndex: 'lastOnlineTime',
    key: 'lastOnlineTime',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
  },
];
const loading = ref(false);
const userStore = useUserStore();
const tableData = ref([]);
const visible = ref(false);
const messageInfo = ref({});
const visible1 = ref(false);
const userInfo = ref({
  userIds: [],
  deviceId: '',
  deviceCode: '',
});
const usersOptions = ref([]);

async function getDeviceList() {
  const res = await getDeviceListApi();
  tableData.value = Array.isArray(res) && res.length > 0 ? res : [];
}
function handleEdit(record) {
  messageInfo.value = JSON.parse(JSON.stringify(record));
  visible.value = true;
}
async function handleDel(record) {
  const res = await delDeviceApi({
    deviceId: record.deviceId,
  });
  if (res == 1) {
    message.success('删除成功');
    getDeviceList();
  } else {
    message.error(res);
  }
}
async function handleOk() {
  loading.value = true;
  const res = await updateDeviceApi(messageInfo.value);
  if (res === 1) {
    message.success('修改成功');
    visible.value = false;
    getDeviceList();
  } else {
    message.error(res);
  }
  setTimeout(() => {
    loading.value = false;
  }, 300);
}
function handleBind(record) {
  userInfo.value.deviceId = record.deviceId;
  userInfo.value.deviceCode = record.deviceCode;
  getUserList();
  visible1.value = true;
}
async function submitBind() {
  const array = userInfo.value.userIds;
  const res = await bindDeviceApi({
    userIds: array.map((item) => item).join(','),
    deviceId: userInfo.value.deviceId,
    deviceCode: userInfo.value.deviceCode,
  });
  if (res == 1) {
    message.success('操作成功');
    visible1.value = false;
  } else {
    message.error(res);
  }
}
async function getUserList() {
  const res = await getUserListApi({
    deviceId: userInfo.value.deviceId,
  });
  userInfo.value.userIds =
    Array.isArray(res) && res.length > 0
      ? res.filter((i) => i.isBind === 1).map((item) => item.userId)
      : [];
  usersOptions.value =
    Array.isArray(res) && res.length > 0
      ? res.map((item) => ({
          value: item.userId,
          label: item.account,
        }))
      : [];
}
onMounted(() => {
  getDeviceList();
});
</script>
