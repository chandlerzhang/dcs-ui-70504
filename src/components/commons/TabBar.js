import React from 'react' 
import {Icon} from 'antd'
import style from './css/tabbar.css'

class TabBar extends React.Component {

	constructor(props) {
		super(props);
	}

	render () {
		return (
			<div className={style.tabBar}>
				<span className={style.tabBarLabel}>{this.props.title}</span>
				<Icon type="left"/>
					{this.props.children}
				<Icon type="right" className={style.antIconRight}/>
			</div>
		)
	}
}

export default TabBar ;