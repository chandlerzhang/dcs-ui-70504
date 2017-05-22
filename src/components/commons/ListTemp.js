import React from 'react' ;
import {Table} from 'antd' ;
import style from './css/table.css'
/**
 * 列表模板组件
 */
export default class ListTemp extends React.Component {

	render () {
		const scroll = this.props.scroll || {y: 480};
		const pageSize = this.props.pageSize || { pageSize: 15 };
		return (
			<Table 
				rowKey={this.props.rowKey}
				dataSource={this.props.dataSource} 
				columns={this.props.columns}
				rowSelection={this.props.rowSelection}
				bordered
				onRowClick={this.props.onRowClick}
				loading={this.props.loading}
				title={() => (this.props.header)}
				scroll={scroll}
				pagination={false}
				expandedRowRender={this.props.expandedRow}
			/>
		)
	}
}