/**
 * 网络接口
 * <p>设置外站运行模式，获取当前网络状态</p>
 */

import { request } from '../utils/RequestUtil';

/**
 * 切换外站为离线模式
 * @param airportCode 当前外站机场三字码
 */
export async function turnOffline(airportCode) {
  return await request('/network/turnOffline', {
    method: 'patch',
    data: {
      airportCode,
    },
  });
}

/**
 * 切换外站为在线模式
 * @param airportCode 当前外站机场三字码
 */
export async function turnOnline(airportCode) {
  return await request('/network/turnOnline', {
    method: 'patch',
    data: {
      airportCode,
    },
  });
}
