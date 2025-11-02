import type { UserInfo } from '@vben/types';

import { requestClient } from '#/api/request';

/**
 * 获取用户信息
 */
export async function getUserInfoApi() {
  return requestClient.get<UserInfo>('/user/info');
}
// 设备列表
export async function getDeviceListApi() {
  return requestClient.get('/device/list');
}

// 消息列表
export async function getMessageListApi(params) {
  return requestClient.get('/message/getMessageList', params);
}

export async function getMessageGroupListApi(params) {
  return requestClient.get('/message/getMessageGroup', params);
}

export async function getMessageRecordApi(params) {
  return requestClient.get('/message/getMessageRecord', params);
}

export async function createMessageBatchApi(data) {
  return requestClient.post('/sms/createBatch', data);
}

export async function sendMessageApi(data) {
  return requestClient.post('/sms/sendSms', data);
}

export async function bindDeviceApi(data) {
  return requestClient.post('/device/bindUser', data);
}
