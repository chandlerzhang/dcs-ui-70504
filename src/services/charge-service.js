/**
 * 收费操作接口
 */
import { request } from '../utils/RequestUtil';

/**
 * 添加直通车服务
 * @param params
 * @returns {*} Msg
 */
export async function addThroughTrain(params) {
  return await request('/charge/throughTrain', {
    method: 'post',
    data: params,
  });
}

/**
 * 添加直通车服务
 * @param params
 * @returns {*} Msg
 */
export async function addOverWeight(params) {
  return await request('/charge/overWeight', {
    method: 'post',
    data: params,
  });
}

/**
 * 添加直通车服务
 * @param params
 * @returns {*} Msg
 */
export async function addFastBording(params) {
  return await request('/charge/fastBording', {
    method: 'post',
    data: params,
  });
}

