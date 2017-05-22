// import Req from 'superagent';
import Ctx from './Context';

/**
 * 执行ajax请求
 * @param url
 * @param options
 * @returns {*}
 */
export function request(url, options) {
  options = options || {};
  const method = (options.method || 'get').toLocaleLowerCase();
  let data = options.data || {};

  data = {
    ...data,
    counterId: Ctx.counterId,
  };


  const requestUrl = options.absoluteUrl ? url : Ctx.serverUrl + url;
  if (!Ctx.isNode()) { // 浏览器环境
    const $ = require('jquery');

    return new Promise((resolve, reject) => {
      $.ajax({
        url: requestUrl,
        type: method,
        dataType: 'json',
        data,
        crossDomain: true,
        xhrFields: {
          withCredentials: true,
        },
        success(d) {
          resolve(d);
        },
        error(err) {
          reject(err);
        },
      });
    });
    // todo
  } else { // Node环境
    const NodeReq = require('request');
    NodeReq.debug = true;

    let requestConfig = {
      method,
      uri: requestUrl,
      gzip: true,
      headers: {
        Accept: 'application/json',
        Connection: 'keep-alive',
      },
    };
    if (method === 'get') {
      requestConfig = {
        ...requestConfig,
        useQueryString: true,
        qs: data,
      };
    } else {
      requestConfig = {
        ...requestConfig,
        headers: {
          ...requestConfig.headers,
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
        form: data,
      };
    }

    return new Promise((resolve, reject) => {
      NodeReq(requestConfig, (error, response, body) => {
        if (error) {
          reject(error);
        } else {
          resolve(JSON.parse(response.body));
        }
      }).on('error', () => {
        console.error(arguments);
      });
    });
  }
}
