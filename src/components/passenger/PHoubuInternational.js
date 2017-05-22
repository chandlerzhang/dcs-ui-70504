import React from 'react' ;
import {Form , Input , Radio , Row , Col , Button , DatePicker , Select} from 'antd';
import moment from 'moment';
import {connect} from 'dva' ;
const FormItem = Form.Item ;
const RadioGroup = Radio.Group ;
const Option = Select.Option;
/**
 * 国际候补旅客组件
 *	
 */
class PHoubuInternational extends React.Component {

	constructor (props) {
		super(props);
	}

	handleSubmit = (e) => {
		let that = this ;
		e.preventDefault();
		 this.props.form.validateFieldsAndScroll((err, values) => {
		      if (!err) {
					let params = {
						 docLastName: values.lastname,       // 姓
					     docFirstName: values.firstname,     // 名
					     docNature: values.sex,              // 证件性别
					     docBirthday:values.birth.format("YYYY-MM-DD HH:mm:ss"),// 出生日期
					     docIssue: values.passportCountry,   // 证件签发国家三字码
					     docPasType: values.idtype,          // 证件类型
					     docCountry: values.nationality,     // 证件国籍三字码
					     docNum: values.idnumber , 		     // 证件号码
					     docExpire:values.expiryDate.format("YYYY-MM-DD HH:mm:ss"),// 证件到期时间
					     pasType:  values.mci,               // 旅客性质
					     whrElecTicket: 'false',             // 是否电子票
					     elecTicket: values.ticketNumber,    // 客票标识
					     stationDestn:values.target         // 目的站
					}
					that.props.dispatch({type:"dcs/addInternationalPassenger" , payload:params});
		      }
	    });
	}



	render () {
		const formItemLayout = {
			labelCol:{
				span:8
			},
			wrapperCol:{
				span:12
			} 
		}

		const {getFieldDecorator} = this.props.form ;

		return (
			<Form onSubmit={this.handleSubmit}>
				<h1>国际候补旅客</h1>
				<Row>
					<Col span={12}>
						<FormItem label="目的站:" {...formItemLayout}>
							{getFieldDecorator("target" , {
								rules: [{ required: true , message: '请选择目的地!'}],
								})(
								<RadioGroup>
							        <Radio value='pvg'>PVG</Radio>
							        <Radio value='kmg'>KMG</Radio>
							        <Radio value='sha'>SHA</Radio>
							        <Radio value='www'>WWW</Radio>
					      		</RadioGroup>
							)}
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span={12}>
						<FormItem label="旅客姓氏:" {...formItemLayout}>
							{getFieldDecorator('lastname', {
					            rules: [{ required: true, message: '请输入旅客姓氏!' , whitespace:true}],
					          })(
					            <Input placeholder="请输入内容"/>
					         )}
						</FormItem>
					</Col>
					<Col span={12}>
						<FormItem label="旅客名字:" {...formItemLayout}>
							{getFieldDecorator('firstname', {
					            rules: [{ required: true, message: '请输入旅客名字!' , whitespace:true}],
					          })(
					            <Input placeholder="请输入内容"/>
					         )}
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span={12}>
						<FormItem label="旅客性别:" {...formItemLayout}>
							{getFieldDecorator('sex', {
					            rules: [{ required: true, message: '请输入旅客性别!'}],
					          })(
								<Select placeholder="Select M or F or U">
								    <Option value="m">M</Option>
								    <Option value="f">F</Option>
								    <Option value="u">U</Option>
								</Select>
					         )}
						</FormItem>
					</Col>
					<Col span={12}>
						<FormItem label="出生日期:" {...formItemLayout}>
							{getFieldDecorator('birth', {
					            rules: [{ required: true , message: '请输入出生日期!' }],
					          })(
					            <DatePicker />
					         )}
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span={12}>
						<FormItem label="旅客国籍:" {...formItemLayout}>
							{getFieldDecorator('nationality', {
					            rules: [{ required: true, message: '请输入旅客国籍!' , whitespace:true}],
					          })(
					            <Input placeholder="请输入内容"/>
					         )}
						</FormItem>
					</Col>
					<Col span={12}>
						<FormItem label="证件签发国:" {...formItemLayout}>
							{getFieldDecorator('passportCountry', {
					            rules: [{ required: true, message: '请输入证件签发国!' , whitespace:true}],
					          })(
					            <Input placeholder="请输入内容"/>
					         )}
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span={12}>
						<FormItem label="ID-Type:" {...formItemLayout}>
							{getFieldDecorator('idtype', {
					            rules: [{ required: true, message: '请输入ID类型!' , whitespace:true}],
					          })(
					            <Input placeholder="请输入内容"/>
					         )}
						</FormItem>
					</Col>
					<Col span={12}>
						<FormItem label="ID-Number:" {...formItemLayout}>
							{getFieldDecorator('idnumber', {
					            rules: [{ required: true, message: '请输入ID!' , whitespace:true}],
					          })(
					            <Input placeholder="请输入内容"/>
					         )}
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span={12}>
						<FormItem label="证件失效日期:" {...formItemLayout}>
							{getFieldDecorator('expiryDate', {
					            rules: [{ required: true, message: '请输入证件失效日期!'}],
					          })(
					             <DatePicker />
					         )}
						</FormItem>
					</Col>
					<Col span={12}>
						<FormItem label="旅客性质:" {...formItemLayout}>
							{getFieldDecorator('mci', {
					            rules: [{ required: true, message: '请输入旅客性质!' }],
					          })(
					            <Select placeholder="Enter adu or chd or inf">
								    <Option value="adu">adu</Option>
								    <Option value="chd">chd</Option>
								    <Option value="inf">inf</Option>
								</Select>
					         )}
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span={12}>
						<FormItem label="客票类型:" {...formItemLayout}>
							{getFieldDecorator('ticket-type', {
					            rules: [{ required: true, message: '请输入客票类型!' , whitespace:true}],
					          })(
					            <Input placeholder="请输入内容"/>
					         )}
						</FormItem>
					</Col>
					<Col span={12}>
						<FormItem label="客票号码:" {...formItemLayout}>
							{getFieldDecorator('ticketNumber', {
					            rules: [{ required: true, message: '请输入客票号码!' , whitespace:true}],
					          })(
					            <Input placeholder="请输入内容"/>
					         )}
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col>
						<FormItem label="护照识别（F1手工识别）:" labelCol={{span:4}} wrapperCol={{span:18}}>
							{getFieldDecorator('remarks', {
					            rules: [{ required: true, message: '请输入备注!' , whitespace:true}],
					          })(
					            <Input placeholder="请输入备注" type="textarea" rows={4}/>
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

export default Form.create()(PHoubuInternational);
