import React from "react" ;
import {Form , Input , Button , Row , Col} from 'antd' ;
const FormItem = Form.Item ;

/**
 * 编辑旅客截留
 */
class EditPJL extends React.Component {

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
	  				info:values.jl, 
	  				uniqueId:that.state.uui
	      		};
				that.props.dispatch({type:"dcs/editGatePas" , payload:params});
	      }
	    });
	}

	render () {

		const {detail} = this.props ;
		const {cna} = detail ;

		const {getFieldDecorator} = this.props.form ;
		
		return (
			<Form onSubmit={this.handleSubmit}>
				<h1 style={{marginBottom:'20px'}}>旅客-修改截留</h1>
				<FormItem 
					 labelCol={{span:2}} wrapperCol={{span:6}}
					 label="姓名:">
					 <span>{cna}</span>
				</FormItem>
				<FormItem 
				 labelCol={{span:2}} wrapperCol={{span:6}}
				 label='截留:'>
				 	{getFieldDecorator('jl', {
			            rules: [{ required: true, message: '请输入截留原因'}]
					})(
					   	<Input placeholder="请输入"/>
					)}
				</FormItem>
				<FormItem wrapperCol={{offset:4}}>
					<Button type="primary" htmlType="submit" size="large">提交</Button>
				</FormItem>
			</Form>
		)
	}
}
export default Form.create()(EditPJL);