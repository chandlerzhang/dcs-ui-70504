import * as F from './Func'
import * as C from './Const'
import * as S from '../services/MainService'
import {message} from 'antd'
import Main from '../routes/Main'

export default {
  *spaceFn(state, {call, put, select}, event) {

    const active = $('.dcs-active')
    if (active.length > 0) {
      if (active.is('input')) {
        active.focus()
      } else {
        active.click()
      }
    }
  },
  // *altUFn(state, {call, put, select}, event) {
  //   const {selectPls} = state
  //   if (selectPls.length !== 1) {
  //     message.error('请选择一个旅客')
  //     return
  //   }
  //
  //   const fees = F.upperCase(yield call(S.fetchFees, {pl: selectPls[0]}))
  //   // if (!fees || fees.feeMsg.length == 0) {
  //   //   message.error('该旅客没有行李收费信息')
  //   //   return
  //   // }
  //   yield put({type: 'showPbFeeAdd', fees})
  // },
  *f8Fn(state, {call, put, select}, event) {

    const {selectPls} = state
    if (selectPls.length !== 1) {
      message.error('请选择一个旅客')
      return
    }

    const fees = F.upperCase(yield call(S.fetchFees, {pl: selectPls[0]}))
    if (!fees || fees.feeMsg.length == 0) {
      message.error('该旅客没有行李收费信息')
      return
    }
    yield put({type: 'showCancelFee', fees})
  },
  // *alt3Fn(state, {call, put, select}, event) {
  //   const {selectPls} = state
  //   if (selectPls.length !== 1 || !selectPls[0].wci) {
  //     message.error('请选择一个已值机旅客')
  //     return
  //   }
  //
  //   const pbs = F.upperCase(yield call(S.fetchPbs, {pl: selectPls[0]}))
  //   if (!pbs || pbs.length == 0) {
  //     message.error('该旅客没有行李')
  //     return
  //   }
  //   yield put({type: 'showPbDel', pbs})
  // },
  // *alt1Fn(state, {call, put, select}, event) {
  //
  //   const {selectPls} = state
  //   if (selectPls.length !== 1 || !selectPls[0].wci) {
  //     message.error('请选择一个已值机旅客')
  //     return
  //   }
  //
  //   const pbs = F.upperCase(yield call(S.fetchPbs, {pl: selectPls[0]}))
  //   yield put({type: 'showPbAdd', pbs})
  // },
  // *alt0Fn(state, {call, put, select}, event) {
  //
  //   const {selectPls} = state
  //   if (selectPls.length == 0) {
  //     message.error('请选择一个或多个旅客')
  //     return
  //   }
  //
  //   const logs = F.upperCase(yield call(S.fetchLogs, {pls: selectPls}))
  //   yield put({type: 'showLogs', logs})
  // },
  *escFn(state, {call, put, select}, event) {

    // const {confirm} = state
    // const isConfirmShow = confirm.show
    //
    // if (isConfirmShow) {
    //   yield put({type: 'closeConfirm'})
    // } else {
    //   yield put({type: 'normalEsc'})
    // }
    yield put({type: 'normalEsc'})
  },
  *alt4Fn(state, {call, put, select}, event) {

    const {selectPls} = state
    if (selectPls.length !== 1 || selectPls[0].sex === 'I') {
      message.error('请选择一个非婴儿旅客')
      return
    }
    const pl = selectPls[0]
    if ($.trim(pl.riu) !== '') {
      message.error('该旅客已经绑定婴儿，无法操作')
      return
    }
    const isM = pl.sex === 'M'
    const tips = `您确认要将该旅客变更为${isM ? `儿童` : `成人`}吗？`
    yield put({
      type: 'showConfirm', content: tips, onOk(dispatch){
        dispatch({type: 'content/doSetMOrC', pl: pl})
      }, onCancel(dispatch){
        dispatch({type: 'content/closeConfirm'})
      }
    })

  },
  *ctrl2Fn(state, {call, put, select}, event) {

    const {selectPls} = state
    const validPls = selectPls.filter(pl=>pl.wci)
    if (validPls.length == 0) {
      message.error('请选择一个或多个已值机的旅客')
      return
    }
    yield put({
      type: 'showConfirm', content: `您确认取消这${validPls.length}位旅客的值机吗？`, onOk(dispatch){
        dispatch({type: 'content/doCancelCheckin', pls: validPls})
      }, onCancel(dispatch){
        dispatch({type: 'content/closeConfirm'})
      }
    })
  },
  *alt7Fn(state, {call, put, select}, event) {

    let {pls, selectPls} = state
    if (selectPls.length == 0 || selectPls[0].sex !== 'M') {
      message.error('请选择一个成人旅客');
      return
    }
    const infs = F.upperCase(yield call(S.queryInfs, {uui: selectPls[0].uui}))

    yield put({type: 'showBindingInf', infs: infs || []})
  },
  f3Fn(state) {

    // const newComps = [C.FSTATUS_SHOWDETAIL_KEY]
    // const comps = {
    //   ...state.comps,
    //   [C.FLIGHT_STATUS_BLOCK]: newComps
    // }
    //
    // return {
    //   ...state,
    //   currBlock: C.FLIGHT_STATUS_BLOCK,
    //   currActive: newComps[0],
    //   comps
    // }

    return {
      ...state,
      currBlock: C.FLIGHT_STATUS_BLOCK
    }
  },
  ctrlUFn(state, event) {

    return {
      ...state,
      pageName: C.PAGE_CANCEL_FEE
    }
  },
  altUFn(state, event) {

    return {
      ...state,
      pageName: C.PAGE_BAGAGE_FEE
    }
  },
  alt3Fn(state, event) {

    return {
      ...state,
      pageName: C.PAGE_DELETE_BAGAGE
    }
  },
  alt0Fn(state, event) {

    return {
      ...state,
      pageName: C.PAGE_PL_LOG
    }
  },
  alt1Fn(state, event) {

    return {
      ...state,
      pageName: C.PAGE_ADD_BAGAGE
    }
  },
  altF3Fn(state, event) {

    const {selectPls} = state
    if (selectPls.length == 0) {
      message.error('请选择一个旅客')
      return state
    }
    const newComps = [C.MAPI_LNAME_KEY, C.MAPI_FNAME_KEY, C.MAPI_SEX_KEY, C.MAPI_DB_KEY,
      C.MAPI_DNA_KEY, C.MAPI_COUNTRY_KEY, C.MAPI_ITYPE_KEY, C.MAPI_INUMBER_KEY, C.MAPI_DISABLE_KEY, C.MAPI_STYLE_KEY, C.MAPI_TTYPE_KEY, C.MAPI_TNUMBER_KEY,
      C.MAPI_PASSPORT_KEY, C.SUBMIT_BTN_KEY]
    const comps = {
      ...state.comps,
      [C.MAIN_BLOCK]: newComps
    }

    return {
      ...state,
      pageName: C.PAGE_MODIFY_API,
      currBlock: C.MAIN_BLOCK,
      currActive: newComps[0],
      comps
    }
  },
  ctrl5Fn(state, event) {

    // const {selectPls} = state
    //
    // if (selectPls.length == 0) {
    //   message.error('请选择一个或多个旅客')
    //   return state
    // }
    //
    // const newComps = [C.MPROTECT_FN_KEY, C.MPROTECT_FD_KEY, C.SUBMIT_BTN_KEY]
    // const comps = {
    //   ...state.comps,
    //   [C.MAIN_BLOCK]: newComps
    // }
    //
    // return {
    //   ...state,
    //   currBlock: C.MAIN_BLOCK,
    //   currActive: newComps[0],
    //   comps,
    //   pageName: C.PAGE_MANUAL_PROTECT
    // }
    return {
      ...state,
      pageName: C.PAGE_MANUAL_PROTECT
    }
  },
  altOFn(state, event) {

    const {selectPls, pageName, currBlock} = state

    const canResponse = pageName === C.PAGE_PASSENGER_LIST
    if (canResponse) {
      if (selectPls.length != 1) {
        message.error('请选择一个旅客')
        return state
      } else {
        const isEt = selectPls[0].wet

        const confirmTips = isEt ? '您确认要取消ET票吗？' : '您确认要设置ET票吗？'

        const newComps = [C.OK_BTN_KEY, C.CANCEL_BTN_KEY]
        const comps = {
          ...state.comps,
          [C.CONFIRM_BLOCK]: newComps
        }
        return {
          ...state,
          comps,
          currBlock: C.CONFIRM_BLOCK,
          currActive: newComps[0],
          confirm: {
            show: true,
            content: confirmTips,
            onOk(dispatch){
              dispatch({type: 'content/doSetEt', isEt: isEt, pl: selectPls[0]})
            },
            onCancel(dispatch){
              dispatch({type: 'content/closeConfirm'})
            }
          }
        }
      }
    }

    return state
  },
  enterFn(state, event) {

    const {currActive, currBlock, pageName, selectPls, comps} = state

    const canCheckin = pageName === C.PAGE_PASSENGER_LIST && currBlock === C.MAIN_BLOCK && selectPls.some(pl=>!pl.wci) && currActive !== C.CMD_INPUT

    if (canCheckin) {

      if (event) {
        F.stopEvent(event)
      }

      const newComps = [C.CHECKIN_FROM_KEY, C.CHECKIN_TO_KEY, C.CHECKIN_NOPRINT_KEY, C.SUBMIT_BTN_KEY]
      const comps = {
        ...state.comps,
        [C.MAIN_BLOCK]: newComps
      }
      return {
        ...state,
        pageName: C.PAGE_CHECKIN,
        comps,
        currActive: newComps[0]
      }
    }

    return state
  },
  altDFn(state, event) {

    const newComps = [C.CMD_INPUT]
    const comps = {
      ...state.comps,
      [C.MAIN_BLOCK]: newComps
    }
    return {
      ...state,
      pageName: C.PAGE_SEATMAP,
      comps,
      currActive: newComps[0],
      currBlock: C.MAIN_BLOCK,
    }
  },
  altF9Fn(state, event) {

    return {
      ...state,
      pageName: C.PAGE_FLIGHTNAME_CHANGE
    }
  },
  altPFn(state, event) {

    // const {selectPls} = state
    // if (selectPls.length == 0) {
    //   message.error('请选择一个或多个旅客');
    //   return state
    // }
    // const newComps = [C.PSTOP_NOTE_KEY, C.SUBMIT_BTN_KEY]
    // const comps = {
    //   ...state.comps,
    //   [C.MAIN_BLOCK]: newComps
    // }
    // return {
    //   ...state,
    //   pageName: C.PAGE_STOP_PASSENGER,
    //   comps,
    //   currActive: newComps[0],
    //   currBlock: C.MAIN_BLOCK,
    // }
    return {
      ...state,
      pageName: C.PAGE_STOP_PASSENGER
    }
  },
  altCommaFn(state, event) {

    const {selectPls} = state
    if (selectPls.length != 1) {
      message.error('请选择一个旅客');
      return state
    }
    const newComps = [C.MPHONE_TE_KEY, C.SUBMIT_BTN_KEY]
    const comps = {
      ...state.comps,
      [C.MAIN_BLOCK]: newComps
    }
    return {
      ...state,
      pageName: C.PAGE_MODIFY_PHONE,
      comps,
      currActive: newComps[0],
      currBlock: C.MAIN_BLOCK,
    }
  },
  altBFn(state, event) {

    return {
      ...state,
      pageName: C.PAGE_ADDPASSENGER_EXTERNAL
    }
  },
  ctrlBFn(state, event) {

    return {
      ...state,
      pageName: C.PAGE_ADDPASSENGER_INTERNAL
    }
  },
  f6Fn(state, event) {

    const currBlock = C.BDSTATUS_BLOCK
    const comps = Main.COMPS[currBlock]
    if (comps && comps.length > 0) {

      return {
        ...state,
        currBlock,
        currActive: comps[0]
      }
    }
    return state
  },
  f5Fn(state, event) {

    const currBlock = C.OPERATION_BLOCK
    const comps = Main.COMPS[currBlock]
    if (comps && comps.length > 0) {

      return {
        ...state,
        currBlock,
        currActive: comps[0]
      }
    }
    return state
    // const btns = F.getOperationBtns(state)
    // if (!btns || btns.length == 0) {
    //   message.error('没有可选的组件')
    //   return state
    // }
    // const pageNum = state.passengerOperationPageNum
    // const currPage = state.passengerOperationCurrPage
    // const allNum = btns.length
    // const allPage = allNum % pageNum == 0 ? allNum / pageNum : Math.floor(allNum / pageNum) + 1
    // let comps = []
    // for (let i = 0; i < allNum; i++) {
    //   const st = (currPage - 1) * pageNum
    //   const ed = currPage * pageNum
    //   if (i >= st && i < ed) {
    //     comps.push(F.genSelectKey(C.PSELECT_TYPE_BUTTON, i))
    //   }
    // }
    //
    // if (currPage > 1) {
    //   comps = [C.PREV_BTN_KEY, ...comps]
    // }
    // if (currPage < allPage) {
    //   comps.push(C.NEXT_BTN_KEY)
    // }
    // const currActive = comps[0]
    // comps = {
    //   ...state.comps,
    //   [C.OPERATION_BLOCK]: comps
    // }
    //
    // return {
    //   ...state,
    //   currBlock: C.OPERATION_BLOCK,
    //   comps,
    //   currActive
    // }
  },
  f4Fn(state, event) {

    const currBlock = C.PSELECT_BLOCK
    const comps = Main.COMPS[currBlock]
    if (comps && comps.length > 0) {

      return {
        ...state,
        currBlock,
        currActive: comps[0]
      }
    }
    return state
    // const pls = state.selectPls
    // if (pls.length == 0) {
    //   message.error('没有可选的对象！');
    //   return
    // }
    //
    // const pageNum = state.passengerSelectPageNum
    // const currPage = state.passengerSelectCurrPage
    // const allNum = pls.length
    // const allPage = allNum % pageNum == 0 ? allNum / pageNum : Math.floor(allNum / pageNum) + 1
    // let comps = []
    // for (let i = 0; i < allNum; i++) {
    //   const st = (currPage - 1) * pageNum
    //   const ed = currPage * pageNum
    //   if (i >= st && i < ed) {
    //     comps.push(F.genSelectKey(C.PSELECT_TYPE_PASSENGER, i))
    //   }
    // }
    //
    // if (currPage > 1) {
    //   comps = [C.PREV_BTN_KEY, ...comps]
    // }
    // if (currPage < allPage) {
    //   comps.push(C.NEXT_BTN_KEY)
    // }
    // const currActive = comps[0]
    // comps = {
    //   ...state.comps,
    //   [C.PSELECT_BLOCK]: comps
    // }
    //
    // return {
    //   ...state,
    //   currBlock: C.PSELECT_BLOCK,
    //   comps,
    //   currActive
    // }

  },
  f2Fn(state, event) {

    const currBlock = C.FLIGHTSWITCH_BLOCK
    const comps = Main.COMPS[currBlock]
    if (comps && comps.length > 0) {

      return {
        ...state,
        currBlock,
        currActive: comps[0]
      }
    }
    return state
  },
  altF1Fn(state, event) {

    return {
      ...state,
      pageName: C.PAGE_SET_FLIGHT
    }
  },
  f1Fn(state, event) {

    const currBlock = C.TOPMENU_BLOCK
    const comps = Main.COMPS[currBlock]
    if (comps && comps.length > 0) {

      return {
        ...state,
        currBlock,
        currActive: comps[0]
      }
    }
    return state
  },
  ctrl4Fn(state, event) {

    return {
      ...state,
      pageName: C.PAGE_ADD_FLIGHT
    }
  },
  ctrl1Fn(state, event) {

    return {
      ...state,
      pageName: C.PAGE_MODIFY_PASSWORD
    }
  },
  ctrlAFn(state, event) {
    const {pls, selectPls, pageName, currBlock, currActive} = state
    if (pageName != C.PAGE_PASSENGER_LIST) {
      return state
    }
    const newSelectPls = pls.length == selectPls.length ? [] : pls
    const isInPSelectBlock = currBlock === C.PSELECT_BLOCK
    const isEmpty = newSelectPls.length == 0
    const newBlock = isInPSelectBlock && isEmpty ? C.MAIN_BLOCK : currBlock
    const newActive = isInPSelectBlock && isEmpty ? C.CMD_INPUT : currActive

    return {
      selectPls: newSelectPls,
      currBlock: newBlock,
      currActive: newActive
    }
  },
  downFn(state, event) {

    return F.activeMoveTo(1, state)
  },
  upFn(state, event) {

    return F.activeMoveTo(-1, state)
  }
}
