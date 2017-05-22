import React from 'react' ;
import {Radio} from 'antd' ;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

export default class TabBarTextItem extends React.Component {
	
	constructor(props){
		super(props);
	}
	
	handleClickEvent = (e) => {
		if(this.props.handleClickEvent) {
			this.props.handleClickEvent(e);
		}
	}

	render () {
		const tabs = [] ;
		for(let i = 0 ; i < this.props.tabData.length ; i++) {
			let tabText = this.props.tabData[i] ;
			tabs.push(
				<RadioButton key={i} value={i}>{tabText}</RadioButton>
			)
		}
		return (
			<RadioGroup size="large" onChange={this.handleClickEvent}>
				{tabs}
			</RadioGroup>
		)
	}
}