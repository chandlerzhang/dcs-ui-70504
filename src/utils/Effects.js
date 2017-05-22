import * as S from '../services/MainService'
import * as F from '../utils/Func'
import * as C from '../utils/Const'
import Evt from '../utils/event-fn'

export default {
  *menuClick({item}, {call, put, select}){

    let navObj;
    if (item == '用户') {

      const users = S.queryUsers()
      navObj = {
        data: users,
        first: users && users.length > 0 ? users[0].id : null,
        pageName: C.PAGE_USER_LIST
      }
    }

    if (navObj) {
      yield put({type: 'main/menuNav', ...navObj})
    }
  },
  *doLogin(params, {call, put, select}){

    const r = yield call(S.login, params);
    if (r && r.success) {
      yield put({type: 'updateToken', token: r.obj})
    }
  },
  *loadDatabase({}, {call, put, select}){
    //1,加载数据库
    const r = yield call(S.loadDb)
    if (r.success) {
      window.DB = r.db;
    } else {
      F.showMessage(r.msg)
      throw r.msg
    }
    //2,获取差异数据
    // const syncData = yield call(S.syncServerData)

    //3,将差异数据更新到本地
    // F.mergeSyncData(syncData);
  },
  // *doSetMOrC({pl}, {call, put, select}){
  //
  //   const r = yield call(S.setMorC, {pl})
  //   try {
  //     if (!r || !r.success) {
  //       console.error('doSetMOrC error')
  //       return
  //     }
  //     yield put({type: 'updateAfterSetMOrC', pl})
  //   } finally {
  //     yield put({type: 'closeConfirm'})
  //   }
  // },
  // *doCancelCheckin({pls}, {call, put, select}){
  //
  //   const r = yield call(S.cancelCheckin, {pls})
  //   try {
  //     if (!r || !r.success) {
  //       console.error('doCancelCheckin error')
  //       return
  //     }
  //     yield put({type: 'updateAfterCancelCheckin', pls})
  //   } finally {
  //     yield put({type: 'closeConfirm'})
  //   }
  // },
  // *doBindingInf({ps, cb, bind}, {call, put, select}){
  //
  //   let r;
  //   if (bind) {
  //     r = yield call(S.bindInf, {ps})
  //   } else {
  //     r = yield call(S.unBindInf, {ps})
  //   }
  //   if (typeof cb === 'function') {
  //     cb(r, ps, bind)
  //   }
  //   yield put({type: 'updateBindingInf', result: r, ps, bind})
  // },
  *asyncEventHandler({handler}, {call, put, select}){

    const {fn, event} = handler
    const f = Evt[fn]

    if (typeof f === 'function') {
      yield f(yield select(s=>s.main), {call, put, select}, event)
    } else {
      console.error(`event func[${fn}] not found!`)
    }
  },
  // *doSetEt({isEt, pl}, {call, put}){
  //
  //   const setResult = yield call(S.setEt, {isEt, pl})
  //
  //   console.log('setResult', setResult)
  //   if (setResult.success) {
  //
  //     yield put({type: 'executeSetEt', isEt, pl})
  //     yield put({type: 'closeConfirm'})
  //   }
  // },
  // *queryUser({payload}, {call, put, select}){
  //   yield put({type: 'showLoading'})
  //   const data = F.upperCase(yield call(S.queryUser, null))
  //   console.log('*queryUser', data, arguments, yield select(s=>s))
  //
  //   if (data) {
  //     const pls = F.upperCase(yield call(S.fetch, null))
  //     yield put({type: 'initContext', token: data, pls: pls})
  //   }
  // },
}
