import React from 'react' 
import {Row , Col} from 'antd'
import styles from './css/pDetail.css'

/**
 *	显示旅客详情的组件
 */
export default class PDetail extends React.Component {

	render () {

	    const passenger = this.props.p ;

		return (
  			<Row className={styles.pDetailRow}>
  				<Col span={6}>
					<Row>
						<Col span={10} className={styles.rowLabel}>姓名 :&nbsp;</Col>
						<Col span={14}>{passenger.cna}</Col>
					</Row>
					<Row>
						<Col span={10} className={styles.rowLabel}>性别 :&nbsp;</Col>
						<Col span={14}>{passenger.dna}</Col>
					</Row>
					<Row>
						<Col span={10} className={styles.rowLabel}>打印次数 :&nbsp;</Col>
						<Col span={14}>{passenger.cfm}</Col>
					</Row>
					<Row>
						<Col span={10} className={styles.rowLabel}>团队号 :&nbsp;</Col>
						<Col span={14}>{passenger.gn}</Col>
					</Row>
					<Row>
						<Col span={10} className={styles.rowLabel}>航程 :&nbsp;</Col>
						<Col span={14}>{passenger.ovy}</Col>
					</Row>
  				</Col>	
  				<Col span={6}>
					<Row>
						<Col span={10} className={styles.rowLabel}>英文名 :&nbsp;</Col>
						<Col span={14}>{passenger.ena}</Col>
					</Row>
					<Row>
						<Col span={10} className={styles.rowLabel}>证件号 :&nbsp;</Col>
						<Col span={14}>4564654654564</Col>
					</Row>
					<Row>
						<Col span={10} className={styles.rowLabel}>电话 :&nbsp;</Col>
						<Col span={14}>{passenger.tel}</Col>
					</Row>
					<Row>
						<Col span={10} className={styles.rowLabel}>机票价 :&nbsp;</Col>
						<Col span={14}>{passenger.otp}</Col>
					</Row>
  				</Col>
  				<Col span={6}>
					<Row>
						<Col span={10} className={styles.rowLabel}>会员号码 :&nbsp;</Col>
						<Col span={14}>{passenger.amn}</Col>
					</Row>
					<Row>
						<Col span={10} className={styles.rowLabel}>电子客标 :&nbsp;</Col>
						<Col span={14}>{passenger.oet}</Col>
					</Row>
					<Row>
						<Col span={10} className={styles.rowLabel}>候补号 :&nbsp;</Col>
						<Col span={14}>{passenger.opn}</Col>
					</Row>
					<Row>
						<Col span={10} className={styles.rowLabel}>目的站/行李号/重量 :&nbsp;</Col>
						<Col span={14}>{passenger.sd},{passenger.bn},{passenger.bw}</Col>
					</Row>
  				</Col>
  				<Col span={6}>
					<Row>
						<Col span={10} className={styles.rowLabel}>收费项目 :&nbsp;</Col>
						<Col span={14}>{passenger.yzsy}</Col>
					</Row>
					<Row>
						<Col span={10} className={styles.rowLabel}>截留备注 :&nbsp;</Col>
						<Col span={14}>{passenger.ifo}</Col>
					</Row>
  				</Col>
  			</Row>
		)
	}
}