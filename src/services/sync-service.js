/**
 * 同步服务接口
 */

import Ctx from '../utils/Context';
import { request } from '../utils/RequestUtil';

/**
 * 同步 js数据库与 server数据库
 * @param flu 航段uui
 * @returns {*} 增量数据
 */
export async function syncServerData(flu) {
  const params = await genSyncParams(flu);

  return await request('/version/check', {
    method: 'get',
    data: params,
  });
}

/**
 * 生成 数据同步请求的 请求参数，包括 全局数据集、机场数据集、航段数据集
 * @param flu
 * @returns {{flightSet: *, airSet: string, globalSet}}
 */
export function genSyncParams(flu) {
  return request('http://localhost:9999/local/db/params', {
    method: 'get',
    absoluteUrl: true,
    data: {
      appId: Ctx.appId,
      airport: Ctx.getApp().airport,
      flu,
    },
  });
}

/**
 * 将差异数据更新到本地数据库
 * @param syncData 服务端返回的差异数据
 */
export function mergeSyncData(syncData) {
  const r = Ctx.getDB().sync(syncData);

  console.log('sync result:::', r);

  return r;
}
