import * as C from './Const'
import $ from 'jquery'
import Main from '../routes/Main'
import Ctx from './Context'
import Req from 'superagent'

/**
 * 文字走马灯效果
 */
export function textAutoScroll(parent, inner, speed) {
  if (inner.scrollWidth > parent.offsetWidth) {
    inner.innerHTML += inner.innerHTML;
    return setInterval(function () {
      if (inner.scrollLeft <= inner.scrollWidth - parent.offsetWidth) {
        inner.scrollLeft++;
        if (inner.scrollLeft >= inner.scrollWidth / 2) {
          inner.scrollLeft = 0;
        }
      }
    }, speed);
  }
}
/**
 * 节流函数（避免某一个函数执行频率过高而导致性能问题）
 * 例如 windows.onresize 方法
 * @param method 被执行的方法
 * @context method执行的环境，若为空，则为全局环境
 */
export function throttle(method, context) {
  clearTimeout(method.tId);
  method.tId = setTimeout(function () {
    method.call(context);
  }, 100);
}

/**
 * 移除数组中指定的元素，并返回新的数组对象
 * @param item : 要被移除的数组元素
 */
export function remove(array, item) {
  let index = array.indexOf(item);
  if (index != -1) {
    array.splice(index, 1);
  }
  return array;
}

/**
 * 将对象或者数组内的所有字符串字段转换成大写
 * @param list  对象或者数组
 * @returns {*} 转换后的对象
 */
export function upperCase(list) {
  if (!list) return list
  const objUpper = pl=> {
    for (const k in pl) {

      const v = pl[k]
      if (pl.hasOwnProperty(k) && v) {
        if (typeof v === 'string') {
          pl[k] = v.toLocaleUpperCase()
        } else if (typeof v === 'object') {
          pl[k] = objUpper(v)
        }
      }
    }
    return pl
  }

  if (list instanceof Array) {
    for (const pl of list) {
      objUpper(pl)
    }

    return list
  } else {
    return objUpper(list)
  }
}


function randomString(len) {
  let alphabat = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_';
  let r = '';
  for (let i = 0; i < len; i++) {
    r += alphabat.charAt(Math.floor(Math.random() * alphabat.length))
  }
  return r;
}

function timeout(ms, flag) {
  return new Promise((resolve, reject) => {
    let f = flag != null ? flag : (+new Date() % 2 > 0);
    if (f) {
      setTimeout(resolve, ms, 'success msg ' + randomString(10));
    } else {
      setTimeout(reject, ms, 'error msg ' + randomString(10));
    }
  })
}

/**
 * 获取active样式
 * @param isActive
 * @param originCls
 * @param ele
 * @returns {*}
 */
export function getActiveCls(isActive, originCls, ele) {

  originCls = originCls || ''
  if (isActive) return ' dcs-active ' + originCls
  else return originCls
}

export function indexOf(arr, obj) {

  return arr.indexOf(obj)
}

export function stopEvent(e) {
  e.preventDefault()
  e.stopImmediatePropagation()
}

/**
 * 将焦点置于active元素
 */
export function focusActive() {
  const active = $('.dcs-active')
  const selector = 'input,a,button'
  const activeIsInput = active.is(selector)
  if (activeIsInput) {
    active.focus()
  } else {
    $(selector, active).first().focus()
  }
}

export function genPlKey(pl) {
  return 'pl-list-' + pl.uui
}


export function getPageInfoField(type) {
  let pageInfo;

  switch (type) {

    case C.PSELECT_TYPE_FLIGHT:
      pageInfo = {
        currPageField: 'flightSwitchCurrPage',
        pageNumField: 'flightSwitchPageNum'
      }
      break
    case C.PSELECT_TYPE_BUTTON:
      pageInfo = {
        currPageField: 'passengerOperationCurrPage',
        pageNumField: 'passengerOperationPageNum'
      }
      break
    case C.PSELECT_TYPE_PASSENGER:
      pageInfo = {
        currPageField: 'passengerSelectCurrPage',
        pageNumField: 'passengerSelectPageNum'
      }
      break
    default:
      throw new Error(`unsupported type ${type}`)
  }

  return pageInfo
}

export function getOperationBtns(state, dispatch) {

  let btns = []

  const {pageName, selectPls} = state

  switch (pageName) {

    case C.PAGE_PASSENGER_LIST:
      btns = [{
        text: '值机',
        enable: selectPls.some(pl=>!pl.wci),
        errmsg: '所选的旅客中必须包含未值机的旅客',
        onClick(){
          dispatch({type: 'content/checkin'})
        }
      }, {
        text: '取消值机',
        enable: selectPls.some(pl=>pl.wci),
        errmsg: '所选的旅客中必须包含已值机的旅客',
        onClick(){
          dispatch({type: 'content/asyncEventHandler', handler: {fn: 'ctrl2Fn'}})
        }
      }, {
        text: '候补',
        enable: true,
        onClick(){
          dispatch({type: 'content/addPassenger'})
        }
      }, {
        text: '电子客票',
        enable: selectPls.length == 1,
        errmsg: '请选择一个旅客',
        onClick(){
          dispatch({type: 'content/showSetEt'})
        }
      }, {
        text: '修改电话',
        enable: selectPls.length == 1,
        errmsg: '请选择一个旅客',
        onClick(){
          dispatch({type: 'content/modifyPhone'})
        }
      }, {
        text: '修改服务',
        enable: selectPls.length == 1,
        errmsg: '请选择一个旅客',
        onClick(){
        }
      }, {
        text: '截留',
        enable: selectPls.length > 0,
        errmsg: '请选择一个或多个旅客',
        onClick(){
          dispatch({type: 'content/stopPassenger'})
        }
      }, {
        text: '设置成人/儿童',
        enable: selectPls.length == 1 && selectPls[0].sex !== 'I',
        errmsg: '请选择一个非婴儿旅客',
        onClick(){
          dispatch({type: 'content/asyncEventHandler', handler: {fn: 'alt4Fn'}})
        }
      }, {
        text: '绑定婴儿',
        enable: selectPls.length == 1 && selectPls[0].sex === 'M',
        errmsg: '请选择一个成人旅客',
        onClick(){
          dispatch({type: 'content/asyncEventHandler', handler: {fn: 'alt7Fn'}})
        }
      }, {
        text: '重打登机牌',
        enable: selectPls.some(pl=>pl.wci),
        errmsg: '所选的旅客中必须包含已值机的旅客',
        onClick(){
        }
      }, {
        text: '重打行李牌',
        enable: selectPls.some(pl=>pl.wci),
        errmsg: '所选的旅客中必须包含已值机的旅客',
        onClick(){
        }
      }, {
        text: '手工保护',
        enable: selectPls.length > 0,
        errmsg: '请选择一个或多个旅客',
        onClick(){
          dispatch({type: 'content/manualProtect'})
        }
      }, {
        text: '编辑API',
        enable: selectPls.length == 1,
        errmsg: '请选择一个旅客',
        onClick(){
          dispatch({type: 'content/eventHandler', handler: {fn: 'altF3Fn'}})
        }
      }]
      btns.sort((b1, b2)=>b2.enable - b1.enable)
      break;
  }

  return btns
}

export function confirm(tips, okFunc, cancelFunc) {

  const emptyFunc = ()=> {
  }
  Modal.confirm({
    title: '提示',
    content: tips || '',
    onOk: okFunc || emptyFunc,
    onCancel: cancelFunc || emptyFunc
  })
}

/**
 * 计算当前页
 * @param index
 * @param pagenum
 * @returns {number}
 */
export function calculateCurrPage(index, pagenum) {

  index++
  return index % pagenum == 0 ? index / pagenum : Math.floor(index / pagenum) + 1
}

/**
 * 是否是分页表格
 * @param currBlock
 * @param pageName
 * @returns {boolean}
 */
export function isPaginationTable(currBlock, pageName) {
  return currBlock === C.MAIN_BLOCK && (pageName === C.PAGE_PASSENGER_LIST || pageName === C.PAGE_LOG_LIST)
}

/**
 * 焦点移动
 * @param offset 偏移量
 * @param state 状态
 * @returns {*}
 */
export function activeMoveTo(offset, state) {
  const {currActive, currBlock, pageName, plPageNum} = state

  const comps = Main.COMPS[currBlock] || []
  if (comps.length == 0) {
    console.error('comps is empty~~')
    return state
  }
  const pageNumField = pageName === C.PAGE_PASSENGER_LIST ? 'plPageNum' : 'otherPageNum'
  const currPageField = pageName === C.PAGE_PASSENGER_LIST ? 'plCurrPage' : 'otherCurrPage'

  //如果当前焦点在命令框上，按上下方向键则直接定位到第一个元素
  if (currActive === C.CMD_INPUT) {
    return {
      ...state,
      currActive: comps[0],
      [currPageField]: 1
    }
  }
  let index = indexOf(comps, currActive)
  if (index < 0) {
    return {
      ...state,
      currActive: comps[0],
      plCurrPage: 1
    }
  } else {
    index += offset
    if (index >= comps.length) {
      index = 0
    } else if (index < 0) {
      index = comps.length - 1
    }

    //如果当前是分页表格，则根据当前焦点计算当前页码
    if (isPaginationTable(currBlock, pageName)) {

      const currPage = calculateCurrPage(index, state[pageNumField])
      return {
        ...state,
        currActive: comps[index],
        [currPageField]: currPage
      }
    }

    return {
      ...state,
      currActive: comps[index]
    }
  }
}

/**
 * 获取可被绑定的婴儿
 * @param selectPls
 */
export function getSelectableInfs(selectPls) {

  const allInfs = selectPls.filter(pl=>pl.sex === 'I')
  const bindedInfs = selectPls.filter(pl=>$.trim(pl.riu) != '').map(pl=>pl.riu)

  return allInfs.filter(pl=>!bindedInfs.some(k=>k === pl.uui))
}

export function genBindingInfPlKey(pl) {
  return `binding-inf-${pl.uui}`
}

export function genLogKey(log) {

  return genKey(log, 'log')
}

export function genPbKey(pb) {

  return genKey(pb, 'pb')
}

export function genKey(obj, t) {

  return `${t}-key-${obj.id}`
}

export function getBlockBySelectorId(selectorId) {

  switch (selectorId) {
    case C.SELECTEDPLSSELECTOR_ID :
      return C.PSELECT_BLOCK;
    case C.PLOPERATIONSELECTOR_ID :
      return C.OPERATION_BLOCK;
    case C.BDSTATUSOPERATIONSELECTOR_ID :
      return C.BDSTATUS_BLOCK;
    default:
      throw `unsopported selectorId ${selectorId}`
  }
}


/**
 * 是否显示 已选择旅客 块
 */
export function showPlSelector(pageName, selectedPls) {

  return selectedPls && selectedPls.length > 0
    && (pageName == C.PAGE_PASSENGER_LIST)
}
