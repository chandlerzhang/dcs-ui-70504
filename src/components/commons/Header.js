import React from 'react' ;
import {Icon , Input , Button , Breadcrumb , Dropdown} from 'antd';
import styles from './css/header.css';
import V9Menu from "./Menu.js";
import Marquee from './Marquee';
export default class Header extends React.Component {
	
	constructor(props){
		super(props);
		this.state={
			menuShow:false
		}
	}

	onEnter = (e) => {
		if(e.keyCode == 13) {
			this.props.handleSearch(e.target.value);
		}
	}

	render () {
		return (
			<div className={styles.topWrapper}>
				<div className={styles.topHelp}>
					<Dropdown overlay={<V9Menu handleMenuItenClick={this.props.handleMenuItenClick}/>} trigger={['click']}>
						<Icon type="bars" className={styles.iconbars} />
					</Dropdown>
					<span className={styles.title}>(F1)春秋航空-离港系统</span>
					<div className={styles.topSearch}>
						<Icon type='right' className={styles.searchArrow}/>
						<input type='text' placeholder='请输入命令或搜索内容, 按 Enter 执行. 按 Esc 回到这里' onKeyDown={this.onEnter}/>
					</div>
					<Button type="primary">执行</Button>
					<div className={styles.headerMenu}>
						<a><Icon type="wifi"  className={styles.iconwifi}/>108ms</a>
						<a><Icon type="question-circle-o"  className={styles.iconquestion} />帮助</a>
						<a><Icon type="user"  className={styles.iconuser}/>00001</a>
					</div>
				</div>
				<div className={styles.topNotice}>
					<Breadcrumb className={styles.breadcrumb}>
						<Breadcrumb.Item><a href="#">旅客</a></Breadcrumb.Item>
						<Breadcrumb.Item><a href="#">值机</a></Breadcrumb.Item>
						<Breadcrumb.Item><a href="#">添加行李</a></Breadcrumb.Item>
					</Breadcrumb>
					<div className={styles.notificationBox}>
						<Icon type="notification"/>
						<b>通知</b>
						<Marquee>
							If you're just interested in playing around with React, you can use CodePen. Try starting from this Hello World example code. You don't need to install anything; you can just modify the code and see if it works!
						</Marquee>
					</div>
				</div>
			</div>
		)
	}
}

