import React from 'react' ;
import {Button} from 'antd' ;
export default class TabBarButtonItem extends React.Component {
	
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
				<Button onClick={this.handleClickEvent.bind(this , i)} key={i}>{tabText}</Button>
			)
		}
		return (
			<div style={{display:'inline-block'}}>
				{tabs}
			</div>
		)
	}
}