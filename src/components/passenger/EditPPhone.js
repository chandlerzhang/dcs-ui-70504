import React from "react" ;
import {Form , Input , Button , Row , Col} from 'antd' ;
const FormItem = Form.Item ;

/**
 * 修改旅客电话
 */
class EditPPhone extends React.Component {

	constructor (props) {
		super(props);
		this.state = {
			uui:this.props.detail.uui
		}
	}

	handleSubmit = (e) => {
		e.preventDefault();
		let that = this ;
	    this.props.form.validateFieldsAndScroll((err, values) => {
	      if (!err) {
	      	 let params = {
		  	 	tel:values.tel, 
		  	 	uniqueId:that.state.uui
		     };
	    	that.props.dispatch({type:"dcs/editPhone" , payload:params});
	      }
	    });
	}

	render () {

		const {detail} = this.props ;
		const {cna} = detail ;

		const {getFieldDecorator} = this.props.form ;

		return (
			<Form onSubmit={this.handleSubmit}>
				<h1 style={{marginBottom:'20px'}}>旅客-修改电话</h1>
				<FormItem 
					 labelCol={{span:2}} wrapperCol={{span:6}}
					 label="姓名:">
					 <span>{cna}</span>
				</FormItem>
				<FormItem 
				 labelCol={{span:2}} wrapperCol={{span:6}}
				 label='旅客电话:'>
				 	{getFieldDecorator('tel', {
			            rules: [{ required: true, message: '请输入电话号码'}]
					})(
					   	<Input placeholder="多个电话使用“ ，”分隔"/>
					)}
				</FormItem>
				<FormItem wrapperCol={{offset:4}}>
					<Button type="primary" htmlType="submit" size="large">提交</Button>
				</FormItem>
			</Form>
		)
	}
}
export default Form.create()(EditPPhone);