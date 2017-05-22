import React from "react" ;
import {connect} from 'dva';
import styles from '../index.css'
import Bottom from '../components/commons/Bottom.js'
import Header from '../components/commons/Header.js'
import PList from '../components/passenger/PList'
import PSelected from "../components/passenger/PSelected"
import POperation from "../components/passenger/POperation"
import BoardingModel from "../components/passenger/BoardingModel"
import PHoubuInternal from "../components/passenger/PHoubuInternal"
import PHoubuInternational from "../components/passenger/PHoubuInternational"

import EditPPhone from "../components/passenger/EditPPhone"
import EditPJL from "../components/passenger/EditPJL"
import EditPKDJ from "../components/passenger/EditPKDJ"
import EditPZTC from "../components/passenger/EditPZTC"
import EditPApi from "../components/passenger/EditPApi"
import ModifyPService from "../components/passenger/ModifyPService"

class Main extends React.Component {

	constructor (props) {
		super(props);
		this.state = {
			detail:{}
		}
	}

	/**
	 * 查询旅客
	 */
	handleSearch = (value) => {
		this.props.dispatch({type:"dcs/queryByCmd" , payload:value})
	}

	/**
	 * 显示页面
	 */
	showPage = (index , record) => {
		this.setState((preState , props) => ({
			detail:record
		}));
		this.props.dispatch({type:'dcs/showPage' , payload:index})
	}

	/**
	 * 处理菜单点击事件
	 */
	handleMenuItenClick = (item) => {
		if(item.key === "item_2") {
			this.showPage(0);
		}
	}
	
	render () {

		const {selectP , pageIndex , sourceData , selectedData , sourcePaddingRight , selectedPaddingRight} = this.props.dcs ;

		// 旅客相关操作需要的Props
		let POperateaPrams = {
			detail:this.state.detail,
			dispatch:this.props.dispatch
		}

		let modifyServiceParams = {
			uui:this.state.detail.uui ,
			name:this.state.detail.cna ,
			sourceData:sourceData , 
			selectedData:selectedData , 
			sourcePaddingRight:sourcePaddingRight , 
			selectedPaddingRight:selectedPaddingRight,
			dispatch:this.props.dispatch	
		}
		return (
			<div className={styles.main}>
				<Header handleSearch={this.handleSearch} handleMenuItenClick={this.handleMenuItenClick}/>
					<div style={{overflowY:'auto' , height:'650px'}}>
						
						{pageIndex == 0 && <PSelected data={selectP} dispatch={this.props.dispatch} />}
						{pageIndex == 0 && <POperation />}
						{pageIndex == 0 && <BoardingModel />}
						
						{pageIndex == 8 &&  <ModifyPService {...modifyServiceParams} />}
						{pageIndex == 7 &&  <EditPApi detail={this.state.detail} dispatch={this.props.dispatch}/>}
						{pageIndex == 6 &&  <EditPZTC {...POperateaPrams}/>}
						{pageIndex == 5 &&  <EditPKDJ {...POperateaPrams}/>}
						{pageIndex == 4 &&  <EditPJL {...POperateaPrams}/>}
						{pageIndex == 3 &&  <EditPPhone {...POperateaPrams}/>}

						{pageIndex == 2 &&  <PHoubuInternal />}
						{pageIndex == 1 &&  <PHoubuInternational />}
						{pageIndex == 0 &&  <PList {...this.props} handleEvent={this.showPage}/>}
					</div>
				<Bottom />
			</div>
		)
	}
}

function mapStateToProps (state) {
	return {
		dcs:state.dcs ,
		loading:state.loading.global
	}
}

export default connect(mapStateToProps)(Main)