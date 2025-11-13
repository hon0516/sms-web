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
  return requestClient.post('/device/bindUsers', data);
}
export async function updateDeviceApi(data) {
  return requestClient.post('/device/update', data);
}
export async function getTaskListApi(params) {
  return requestClient.get('/sms/getTaskList', params);
}
export async function updateIntervalApi(params) {
  return requestClient.post(
    `/sms/updateInterval?taskId=${params.taskId}&newIntervalMinutes=${params.newIntervalMinutes}`,
  );
}

export async function getUserListApi(params) {
  return requestClient.get('/user/list', params);
}
export async function delDeviceApi(params) {
  return requestClient.post(`/device/delete?deviceId=${params.deviceId}`);
}
export async function getDeviceCodeByPhoneApi(params) {
  return requestClient.get('/message/getDeviceCodeByPhone', params);
}

export async function getTaskDeatilApi(params) {
  return requestClient.get('/sms/getTaskDetail', params);
}

export async function pauseTaskApi(params) {
  return requestClient.post(`/sms/pause/${params.batchId}`);
}
export async function resumeTaskApi(params) {
  return requestClient.post(`/sms/resume/${params.batchId}`);
}
export async function delTaskApi(params) {
  return requestClient.post(`/sms/delete/${params.batchId}`);
}
export async function getUnReadCountApi() {
  return requestClient.get('/message/getUnReadCount');
}

export async function deleteMessageApi(data) {
  return requestClient.post('/message/deleteMessage', data);
}
export async function getDeviceCodeByIdApi(params) {
  return requestClient.get('/message/getDeviceCodeById', params);
}
export async function addReplyRemarkApi(data) {
  return requestClient.post('/message/addReplyRemark', data);
}
