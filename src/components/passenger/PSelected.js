import React from "react" ;
import TabBar from '../../components/commons/TabBar'
import TabBarCloseItem from '../../components/commons/TabBarCloseItem'
import {SELECTED_PASSENGER_LABEL_TEXT} from "../../utils/Const" ;

export default class PSelected extends React.Component {

	removePassenger = (index , e) => {
		this.props.dispatch({type:'dcs/removeSelectedP' , payload:index});
	}


	render () {
		const {data} = this.props ;
		const selectText = [];
	    for (let i = 0 ; i < data.length ; i++) {
			selectText.push(data[i].ena) ;
	    }
		return (
			<TabBar title={SELECTED_PASSENGER_LABEL_TEXT}>
				<TabBarCloseItem tabData = {selectText}  handleClickEvent={this.removePassenger}/>
			</TabBar>
		)
	}
}