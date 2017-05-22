import React from "react" ;
import {Form , Input , Button , Row , Col} from 'antd' ;
const FormItem = Form.Item ;

/**
 * 编辑旅客快登机费用
 */
class EditPKDJ extends React.Component {

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
			      	pasLegUid: that.state.uui,
			      	charge: values.charge,
			    };
			    that.props.dispatch({type:'dcs/editFastBording' , payload:params});
	      }
	    });
	}

	render () {

		const {detail} = this.props ;
		const {cna , sea} = detail ;

		const {getFieldDecorator} = this.props.form ;
		
		const fromItemLayout = {
			labelCol:{
				span:12
			},
			wrapperCol:{
				span:8
			}
		}

		return (
			<Form onSubmit={this.handleSubmit}>
				<h1 style={{marginBottom:'20px'}}>旅客-快登机收费</h1>
				<Row>
					<Col span={4}>
						<FormItem 
						 {...fromItemLayout}
						 label="姓名:">
						 	<span>{cna}</span>
						</FormItem>
					</Col>
					<Col span={6}>
						<FormItem 
							{...fromItemLayout} 
							label="座位:">
							 <span>{sea}</span>
						</FormItem>
					</Col>
				</Row>
				<FormItem 
				 labelCol={{span:2}} wrapperCol={{span:6}}
				 label='费用(元):'>
				 	{getFieldDecorator('charge', {
			            rules: [{ required: true, message: '请输入费用'}]
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
export default Form.create()(EditPKDJ);