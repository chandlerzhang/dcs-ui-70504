import { request } from './RequestUtil';
/**
 * 上下文环境
 */
export default {
  dev: {
    registerDevices() {
    },
    updateDeviceConfig() {
    },
    getFormat() {
    },
    send() {
    },
  },
  serverMode: 'center', // 服务模式 site or center
  siteUrl: null, // 外站服务地址
  centerUrl: 'https://127.0.0.1:8888/api', // 中心服务地址
  loginSchema: 'cki', // 系统模式，cki/bcs
  dbfile: 'dcs-terminal.db', // sqlite数据库文件，for test
  appId: '4', // 应用标识
  counterId: '401', // 柜台标识
  airportCode: 'zha', // 机场三字码
  // getApp() { // 获取应用对象
  //   return {
  //     airport: 'zha', // 当前机场三字码
  //   };
  // },
  getCounter() { // 获取柜台对象
    return {
      nodeNum: '12', // 当前柜台节点ID
      barNum: 'C01', // 当前柜台号
    };
  },
  getCfg() { // 获取服务端配置信息
    return {
      atbMaxPrintTimes: 20, //登机牌最大打印次数
    };
  },
  getDB() { // 操作本地数据库
    return {
      async sync(syncData) {
        return await request('http://127.0.0.1:9999/local/db/sync', {
          method: 'post',
          absoluteUrl: true,
          data: { data: JSON.stringify(syncData) },
        });
      },
    };
  },
  isNode() {
    return typeof window === 'undefined' || !window || typeof window.XMLHttpRequest === 'undefined';
  },
};
