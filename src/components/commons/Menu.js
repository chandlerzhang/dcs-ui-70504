import React from "react"
import {Icon , Menu } from 'antd'
const SubMenu=Menu.SubMenu

export default class V9Menu extends React.Component {

	handleMenuItemClick = (item , key , keyPath) => {
		this.props.handleMenuItenClick(item) ;
	}

	render() {
		return (
			<Menu mode="inline" style={{width:220 , border:'1px solid #e6e6e6'}} onClick={this.handleMenuItemClick}>
				<Menu.Item>航段</Menu.Item>
				<Menu.Item>座位</Menu.Item>
				<Menu.Item>旅客</Menu.Item>
				<Menu.Item>通知</Menu.Item>
				<SubMenu title={<span>设置</span>} mode="vertical">
					<Menu.Item >修改密码</Menu.Item>
					<Menu.Item >设置</Menu.Item>
					<Menu.Item >网络</Menu.Item>
				</SubMenu>
				<Menu.Item>注销</Menu.Item>
				<Menu.Item>退出</Menu.Item>
			</Menu>
		)
	}
}