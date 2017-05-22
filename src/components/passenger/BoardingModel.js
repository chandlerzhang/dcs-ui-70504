import React from "react" 
import TabBar from '../../components/commons/TabBar'
import TabBarTextItem from '../../components/commons/TabBarTextItem'
import {BOARDING_MODEL_LABEL_TEXT} from "../../utils/Const" ;

export default class BoardingModel extends React.Component {

	render () {
		return (
			<TabBar title={BOARDING_MODEL_LABEL_TEXT}>
				<TabBarTextItem tabData = {['普通登机','优先登机','取消登机','查询模式']} />
			</TabBar>
		)
	}
}