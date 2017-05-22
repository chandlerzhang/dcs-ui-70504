import React from 'react' 
import style from './css/pList.css'
import {Row , Col , Checkbox , Icon} from 'antd'
import PDetail from './PDetail'
import List from '../commons/ListTemp'

export default class PList extends React.Component {

	constructor (props) {
		super(props);
		this.state = {
			record:{},
		}
	}

	componentDidMount = () => {
		this.props.dispatch({type:'dcs/queryByCmd' , payload:"/na"})
		this.props.dispatch({type:'dcs/calcContentHeight'})
		window.addEventListener ("keydown" , (e) => {
			
			if(e.altKey && e.code == "KeyB") {         // 候补国内旅客
				this.props.handleEvent(2);
			} else if(e.ctrlKey && e.code == "KeyY") { // 候补国际旅客
				this.props.handleEvent(1);
			}

			if(this.props.dcs.selectP.length == 1) {
				if(e.altKey && e.code == "Comma") {        // 修改旅客电话
					this.props.handleEvent(3 , this.state.record);
				} else if(e.altKey && e.code == "KeyP") {  // 修改旅客截留
					this.props.handleEvent(4 , this.state.record);
				} else if(e.altKey && e.code == "KeyN") {  // 修改快登机收费
					this.props.handleEvent(5 , this.state.record);
				} else if(e.altKey && e.code == "KeyX") {  // 修改直通车收费
					this.props.handleEvent(6 , this.state.record);
				} else if(e.altKey && e.code == "F3") {    // 修改旅客api信息
					this.props.handleEvent(7 , this.state.record);
				} else if(e.altKey && e.code == "KeyZ") {  // 修改旅客服务
					this.props.handleEvent(8 , this.state.record);
				}
			}
		})
	}

	onHandleSelectAll = (selected , selectedRows , changeRows) => {
		this.props.dispatch({type:'dcs/setSelectedP' , payload:selectedRows});
	}

	onHandleSelect = (record , selected , selectedRows) => {
		this.props.dispatch({type:'dcs/setSelectedP' , payload:selectedRows});
		if(selected) {
			this.setState({record:record});
		}
	}

	onHandleSelectChange = (selectedRowKeys) => {
		this.props.dispatch({type:'dcs/setSelectedRowKeys' , payload:selectedRowKeys});
	}

	render () {
		
		const { contentHeight , data , selectP , selectedRowKeys} = this.props.dcs ;
		
		const columns = [{
			title:'状态',
			dataIndex:'wc',
			width:80
		},{
			title:'序号',
			dataIndex:'cs',
			width:80
		},{
			title:'姓名',
			dataIndex:'ena',
			width:150
		},{
			title:'性质',
			dataIndex:'pty',
			width:80
		},{
			title:'订单号',
			dataIndex:'orn'
		},{
			title:'座位',
			dataIndex:'sea',
			width:80
		},{
			title:'目的地',
			dataIndex:'sd',
			width:80
		},{
			title:'免额行李',
			dataIndex:'bfw',
			width:80
		},{
			title:'行李/重量',
			dataIndex:'bw',
			width:80
		},{
			title:'服务',
			dataIndex:'pst',
			width:80
		}]

		const rowSelection = {
			  selectedRowKeys,
 			  onSelect: this.onHandleSelect,
			  onSelectAll:this.onHandleSelectAll,
			  onChange:this.onHandleSelectChange
		}
		const header = <span><Icon type="exclamation-circle" />共&nbsp;<span style={{color:'#108EE9'}}>{data.length}</span>&nbsp;条旅客，已选择&nbsp;<span style={{color:'#108EE9'}}>{selectP.length}</span>&nbsp;名旅客</span> ;
		return (
			<div className={style.pList}>
				<List 
					rowKey="id"
					dataSource={data}
					columns={columns}
					rowSelection={rowSelection}	
					bordered
					loading={this.props.loading}
					header={header} 
					expandedRow={record => <PDetail p={record} />}
					scroll={{y:contentHeight}}
				/>
			</div>
		) 
	}
}