import React from 'react' ;
import {Icon} from 'antd';
import styles from './css/tabBarCloseItem.css'

export default class TabBarCloseItem extends React.Component {
	
	constructor(props){
		super(props);
	}
	
	handleClickEvent = (index , e) => {
		if(this.props.handleClickEvent) {
			this.props.handleClickEvent(index , e);
		}
	}
	render () {
		const tabs = [] ;
		for(let i = 0 ; i < this.props.tabData.length ; i++) {
			let tabText = this.props.tabData[i] ;
			tabs.push(
				<a key={i} tabIndex={i} onClick={this.handleClickEvent.bind(this , i)}>{tabText}<Icon type="close" className={styles.closeCircleO}/></a>
			)
		}
		return (
			<div className={styles.fligtMenu}>
				{tabs}
			</div>
		)
	}
}