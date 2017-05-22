import * as PS from '../services/passenger-service';
import {addDomesticPassenger  , addInternationalPassenger , updateInterPas , updatePhone , updateGatePas} from "../services/edit-passenger"
import {addFastBording , addThroughTrain} from "../services/charge-service"
import {passQueryServer} from "../services/passengerserver-service"
import { routerRedux } from 'dva/router';
import {message} from "antd" ;

export default {
  namespace:"dcs",
  state: {
    contentHeight: '0px',
    data: [],
    selectedRowKeys:[],
    detail:{},
    selectP:[],     // 已选旅客
    selectFlight:[], // 已选航班
    pageIndex:0,
    // 旅客服务相关
    sourceData:[],
    selectedData:[],
    sourcePaddingRight:'0px',
    selectedPaddingRight:'0px'
  },
  effects: {
    /**
     * 通过输入的命令执行相关查询
     */
    *queryByCmd ({ payload: cmd } , {call , put}) {
        const result = yield call(PS.queryPassenger , cmd , '6268272105503068364');
        yield put({
            type: 'showPassenger',
            payload: result
        });
    },

    /**
     * 发送路由，进行页面跳转
     */
    *sendRouter ({payload} , {call , put}) {

        yield put(routerRedux.push(payload.pathname));

        yield put({
            type: 'setDetail',
            payload:payload.index
        });
    },

    /**
     * 新增国内候补旅客
     */
    *addPassenger ({ payload: params } , {call , put}) {
       const result = yield call(addDomesticPassenger , params) ;
       message.info(result.success ? "操作成功！": result.errmsg) ;
       if(result.success) {
             yield put({
                type: 'showPage',
                payload:0
            })
        }
    },

    /**
     * 新增国际候补旅客
     */
    *addInternationalPassenger ({ payload: params } , {call , put}) {
        const result = yield call(addInternationalPassenger , params) ;
        message.info(result.success ? "操作成功！": result.errmsg) ;
        if(result.success) {
             yield put({
                type: 'showPage',
                payload:0
            })
        }
    },
    /**
     * 修改旅客api
     */
    *editPApi ({ payload: params } , {call , put}) {
        const result = yield call(updateInterPas , params) ;
        message.info(result.success ? "操作成功！": result.errmsg) ;
        if(result.success) {
             yield put({
                type: 'showPage',
                payload:0
            })
        }
    },
    /**
     * 编辑手机号码
     */
    *editPhone ({ payload: params } , {call , put}) {
        const result = yield call(updatePhone , params) ;
        message.info(result.success ? "操作成功！": result.errmsg) ;
        if(result.success) {
             yield put({
                type: 'showPage',
                payload:0
            })
        }
    },
    /**
     * 编辑截留
     */
    *editGatePas ({ payload: params } , {call , put}) {
        const result = yield call(updateGatePas , params) ;
        message.info(result.success ? "操作成功！": result.errmsg) ;
        if(result.success) {
             yield put({
                type: 'showPage',
                payload:0
            })
        }
    },
    /**
     * 快登机
     */
    *editFastBording ({ payload: params } , {call , put}) {
        const result = yield call(addFastBording , params) ;
        message.info(result.success ? "操作成功！": result.errmsg) ;
        if(result.success) {
             yield put({
                type: 'showPage',
                payload:0
            })
        }
    },

    /**
     * 直通车
     */
    *editThroughTrain ({ payload: params } , {call , put}) {
        const result = yield call(addThroughTrain , params) ;
        message.info(result.success ? "操作成功！": result.errmsg) ;
        if(result.success) {
             yield put({
                type: 'showPage',
                payload:0
            })
        }
    },
    /**
     * 查询旅客服务列表
     */
    *queryPService ({ payload: uui } , {call , put}) {
        const result = yield call(passQueryServer , uui) ;
        console.log(result)
        // yield put({
        //    type: 'showPService',
        //    payload:result
        // })
    },

  },

  reducers: {

    showPassenger(state, { payload: data }) {
        return { ...state , data };
    },

    calcContentHeight(state, { payload: isShow }) {
        let contentHeight = window.innerHeight - 520;
        contentHeight = isShow ? `${window.innerHeight - 540}px` : `${window.innerHeight - 420}px`;
        return { ...state , contentHeight };
    },
    /**
     * 显示页面
     */
    showPage (state , {payload:pageIndex}) {
        return { ...state , pageIndex };
    },

    /**
     * 设置详情数据
     */
    setDetail (state, { payload: index }) {
        let detail = {} ;
        if(index >= 0) detail = state.data[index] ;
        return { ...state , detail };
    },

    /**
     * 保存选择的旅客
     */
    setSelectedP (state, { payload: selectP }) {
        return {...state , selectP};
    },

    /**
     * 移除选择行的key
     */
    removeSelectedP (state, { payload: index }) {
        let selectedRowKeys = state.selectedRowKeys ;
        let selectP = state.selectP ;
        let id = selectP[index].id ;
        selectedRowKeys.splice(selectedRowKeys.indexOf(id) , 1);
        selectP.splice(index , 1) ;
        return {...state , selectedRowKeys , selectP};
    },

    /**
     * 保存被选择行的key
     */
    setSelectedRowKeys (state, { payload: selectedRowKeys }) {
        return {...state , selectedRowKeys};
    },
    /**
     * 显示服务列表
     */
    showPService(state, { payload: sourceData }) {
        return { ...state , sourceData };
    },
    /**
     *  添加服务
     */
    add (state , {payload:addList}) {
        const selectedData = state.selectedData.concat(addList);
        const sourceData = state.sourceData.filter(function (el) {
            return addList.indexOf(el) == -1 ;
        });
        return {...state , sourceData , selectedData}
    },
    /**
     * 移除服务
     */
    remove (state , {payload:removeList}) {
        const sourceData = state.sourceData.concat(removeList);
        const selectedData = state.selectedData.filter(function (el) {
            return removeList.indexOf(el) == -1 ;
        });
        return {...state , sourceData , selectedData}
    },

    setPaddingRight (state) {
          let sourcePaddingRight = state.sourceData.length * 40 > 500 ? '17px' : '0px' ;
          let selectedPaddingRight = state.selectedData.length * 40 > 500 ? '17px' : '0px' ;
          return {...state , sourcePaddingRight , selectedPaddingRight };
    },
  },
}
