import React from "react" 
import TabBar from '../../components/commons/TabBar'
import TabBarButtonItem from '../../components/commons/TabBarButtonItem'
import {PASSENGER_OPERATION_LABEL_TEXT} from "../../utils/Const" ;

export default class POperation extends React.Component {

	render () {
		return (
			<TabBar title={PASSENGER_OPERATION_LABEL_TEXT}>
				<TabBarButtonItem tabData = {['值机','候补','座位图']} />
			</TabBar>
		)
	}
}