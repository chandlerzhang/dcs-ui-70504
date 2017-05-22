/**
 * 用户相关的操作接口
 */

import { request } from '../utils/RequestUtil';
import { queryForList } from '../utils/DbUtil';

/**
 * 用户登录请求（异步）
 * @param params {wid,pwd,tos,fn,fde}
 * @returns {*} Msg
 */
export async function login(params) {
  return await request('/login', {
    method: 'post',
    data: params,
  });
}

/**
 * 用户注销请求（异步）
 * @returns {*} Msg
 */
export async function logout() {
  return await request('/logout', {
    method: 'post',
  });
}

/**
 * 修改密码
 * @param oldPwd 原密码
 * @param newPwd 新密码
 * @param newPwda 重复新密码
 * @return Msg
 */
export async function changePwd(oldPwd, newPwd, newPwda) {
  return await request('/users/changePwd', {
    method: 'post',
    data: {
      oldPwd,
      newPwd,
      newPwda,
    },
  });
}

/**
 * 查询用户列表
 * @param air 所属机场三字码，如：sha，不能为空
 * @param keyword 检索关键词（根据‘工号’，‘姓名’及‘所属机场三字码’进行模糊匹配），可空，为空时默认检索全部
 * @return []
 */
export function query(air, keyword) {
  if (keyword) {
    const k = `%${keyword}%`;
    return queryForList('select * from dcs_user where wde=0 and air=? and (wid like ? or nm like ? or air like ?)', [air, k, k, k]);
  } else {
    return queryForList('select * from dcs_user where wde=0 and air=?', [air]);
  }
}
