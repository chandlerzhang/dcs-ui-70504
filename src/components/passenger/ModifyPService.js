import React from 'react' ;
import {connect} from 'dva';
import {Icon , Row , Col , Checkbox , Button} from 'antd';
import styles from './css/pModifyService.css';
import {remove} from '../../utils/Func' ;
/**
 * 修改旅客服务
 *
 */
export default  class ModifyPService extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			selectAddNum:0,
			selectRemoveNum:0,
			selectedAddList:[],
			selectedRemoveList:[]
		}
	}

	componentDidMount = () => {
		this.props.dispatch({type:'dcs/queryPService' , payload:this.props.uui});
		//this.props.dispatch({type:'dcs/setPaddingRight'});
	}

	/**
	 * 处理需要被添加的选项
	 */
	handleSelectAdd = (item , e) => {
		this.setState((preState , props) => ({
			selectAddNum:e.target.checked ? preState.selectAddNum + 1 : preState.selectAddNum - 1 ,
			selectedAddList:e.target.checked ? preState.selectedAddList.concat([item]) : remove(preState.selectedAddList , item)
		}));
	}

	/**
	 * 处理需要被移除的选项
	 */
	handleSelectRemove = (item  , e) => {
		this.setState((preState , props) => ({
			selectRemoveNum:e.target.checked ? preState.selectRemoveNum + 1 :  preState.selectRemoveNum - 1 ,
			selectedRemoveList:e.target.checked ? preState.selectedRemoveList.concat([item]) : remove(preState.selectedRemoveList , item)
		}));
	}

	/**
	 * 添加操作
	 */
	handleAdd = (e) => {
		if(this.state.selectedAddList.length > 0) {
			this.props.dispatch({type:'dcs/add' , payload:this.state.selectedAddList});
			this.props.dispatch({type:'dcs/setPaddingRight'});
			this.setState((preState , props) => ({
				selectedAddList:[],
				selectAddNum:0
			}))
		}
	}
	/**
	 * 移除操作
	 */
	handleRemove = (e) => {
		if(this.state.selectedRemoveList.length > 0) {
			this.props.dispatch({type:'dcs/remove' , payload:this.state.selectedRemoveList})
			this.props.dispatch({type:'dcs/setPaddingRight'});
			this.setState((preState , props) => ({
				selectedRemoveList:[],
				selectRemoveNum:0
			}))
		}
	}
	/**
	 * 提交
	 */
	handleSubmit = (e) => {
		
	}

	render () {
		const {	
				name , 
				sourceData , 
				selectedData , 
				sourcePaddingRight , 
				selectedPaddingRight
		} = this.props ;
		
		const rows = [] ;
		for(let i = 0 ; i < sourceData.length ; i++) {
			let item = sourceData[i];
			rows.push(
				<Row className={styles.row} key={item.id}>
					<Col span={4} className={styles.col}><Checkbox onChange={this.handleSelectAdd.bind(this , item)}/></Col>
					<Col span={6} className={styles.col}>{item.code}</Col>
					<Col span={6} className={styles.col}>{item.explain}</Col>
					<Col span={8} className={styles.col}>{item.priority}</Col>
				</Row>
			)
		}
		const selectedRows = [] ;
		for(let i = 0 ; i < selectedData.length ; i++) {
			let item =  selectedData[i];
			selectedRows.push(
				<Row className={styles.row} key={item.id}>
					<Col span={4} className={styles.col}><Checkbox  onChange={this.handleSelectRemove.bind(this , item)}/></Col>
					<Col span={6} className={styles.col}>{item.code}</Col>
					<Col span={6} className={styles.col}>{item.explain}</Col>
					<Col span={8} className={styles.col}>{item.priority}</Col>
				</Row>
			)
		}

		return (
			<div className={styles.pmodifyservice}>
				<h1>旅客-修改服务</h1>
				<p>姓名:{name}</p>	
				<div className={styles.totalBox}>
					<p>可选服务(F6):</p>
					<div style={{border:'1px solid #e6e6e6'}}>
						<span className={styles.statuesTitle}>
								<Icon type="exclamation-circle"/>&nbsp;&nbsp;共{sourceData.length}项服务,已选择{this.state.selectAddNum}项</span>
						<Row className={styles.row +' ' +styles.rowHeader} style={{paddingRight:sourcePaddingRight}}>
							<Col span={4} className={styles.col}></Col>
							<Col span={6} className={styles.col}>代码</Col>
							<Col span={6} className={styles.col}>说明</Col>
							<Col span={8} className={styles.col}>优先登机</Col>
						</Row>
						<div className={styles.rowContainer}>
							{rows.length <= 0 ? <p>暂无数据</p> :rows}
						</div>
					</div>
				</div>
				<div className={styles.buttonBox}>
					<Button onClick={this.handleAdd}>&gt;&gt;添加(Enter)</Button>
					<Button onClick={this.handleRemove}>删除(Enter)&lt;&lt;</Button>
					<Button type="primary" size="large" onClick={this.handleSubmit}>提交</Button>
				</div>
				<div className={styles.selectedBox}>
					<p>已选服务(F7):</p>
					<div style={{border:'1px solid #e6e6e6'}}>
						<span className={styles.statuesTitle}>
							<Icon type="exclamation-circle"/>&nbsp;&nbsp;共{selectedData.length}项服务,已选择{this.state.selectRemoveNum}项</span>
						<Row className={styles.row +' ' +styles.rowHeader}  style={{paddingRight:selectedPaddingRight}}>
							<Col span={4} className={styles.col}></Col>
							<Col span={6} className={styles.col}>代码</Col>
							<Col span={6} className={styles.col}>说明</Col>
							<Col span={8} className={styles.col}>优先登机</Col>
						</Row>
						<div className={styles.rowContainer}>
							{selectedRows.length <= 0 ? <p>暂无数据</p> :selectedRows}
						</div>
					</div>
				</div>
			</div>
		)
	}
}

