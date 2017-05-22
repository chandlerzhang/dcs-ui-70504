import React from 'react' ;
import {connect} from 'dva' ;
import {Form , Input , Radio , Checkbox ,Row , Col , Button , Select} from 'antd';
const FormItem = Form.Item ;
const RadioGroup = Radio.Group ;
const Option = Select.Option ;

/**
 * 国内候补旅客组件
 *	
 */
class PHoubuInternal extends React.Component {

	constructor (props) {
		super(props);
	}

	handleSubmit = (e) => {
		e.preventDefault();
		let that = this ;
	    this.props.form.validateFieldsAndScroll((err, values) => {
	      if (!err) {
	      		let params = {
	      			cnname:values.pname,
	      			docNum:values.IdCard ,
	      			pasType:values.pmci,
	      			whrElecTicket:values.isElecTicket,
	      			stationDestn:values.target,
	      			elecTicket:values.eticket
	      		};
	    		that.props.dispatch({type:"dcs/addPassenger" , payload:params});
	      }
	    });
	}

	render () {
		const formItemLayout = {
			labelCol:{
				span:6
			},
			wrapperCol:{
				span:12
			} 
		}

		const {getFieldDecorator} = this.props.form ;

		return (
			<Form onSubmit={this.handleSubmit}>
				<h1>国内候补旅客</h1>
				<FormItem label="目的站:" {...formItemLayout}>
					{getFieldDecorator("target" , {
						rules: [{ required: true , message: '请选择目的地!'}],
						})(
						<RadioGroup>
					        <Radio value={'PVG'}>PVG</Radio>
					        <Radio value={'KMG'}>KMG</Radio>
					        <Radio value={'SHA'}>SHA</Radio>
					        <Radio value={'WWW'}>WWW</Radio>
			      		</RadioGroup>
					)}
				</FormItem>
				<FormItem label="旅客姓名:" {...formItemLayout}>
					{getFieldDecorator('pname', {
			            rules: [{ required: true, message: '请输入旅客姓名!' , whitespace:true}],
			          })(
			            <Input placeholder="请输入"/>
			         )}
				</FormItem>
				<FormItem label="旅客性质（M,C,I）:" {...formItemLayout}>
					{getFieldDecorator('pmci', {
			            rules: [{ required: true, message: '请输入旅客性质!', whitespace:true}],
			          })(
			            <Select placeholder="Enter M or C or I">
						    <Option value="M">M</Option>
						    <Option value="C">C</Option>
						    <Option value="I">I</Option>
						</Select>
			         )}
				</FormItem>
				<FormItem label="证件号码:" {...formItemLayout}>
					{getFieldDecorator('IdCard', {
			            rules: [{ required: true, message: '请输入正确的证件号码!', pattern:new RegExp(/^[a-zA-Z0-9]{1,20}$/) , whitespace:true}],
			          })(
			            <Input placeholder="请输入"/>
			         )}
				</FormItem>
				<Row>
					<Col span={6}>
						<FormItem label="电子票:" labelCol={{span:22}} wrapperCol={{span:2}}>
							{getFieldDecorator("isElecTicket" , {
							    valuePropName: 'checked',
            					initialValue: false,
							})(
								<Checkbox></Checkbox>
							)}
						</FormItem>
					</Col>
					<Col span={12}>
					<FormItem >
						{getFieldDecorator('eticket', {
				            rules: [{ required: true, message: '电子票号长度为必须为10', len:10 , whitespace:true}],
				          })(
				            <Input placeholder="请输入"/>
				         )}
				     </FormItem>
					</Col>
				</Row>
				<FormItem wrapperCol={{offset:11}}>
		          <Button type="primary" htmlType="submit" size="large">提交</Button>
		        </FormItem>
			</Form>
		)
	}
}

export default Form.create()(PHoubuInternal)