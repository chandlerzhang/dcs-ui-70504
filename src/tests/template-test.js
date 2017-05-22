// require('babel-register');
import { expect } from 'chai';
import lodash from 'lodash';

describe('Output text', () => {
  it('Should output text', () => {
    const data = { airportType: 'A320'};
    const tpl = (data) => `
    [2016-12-09 10:31:40]
    
    航班机型:${lodash.padEnd(data.airportType, 20, ' ')}座位排数:30    航班布局:180   
    闸口:A7        闸口状态:OP    航班状态:CL    
    初始关闭:2016-12-09 10:31:08
    中间关闭:2016-12-09 10:31:14
    最后关闭:
    
               
    航班号:9C8765  航班日期:07NOV 起飞站:SHA     到达站:SJW     
    登机:1520      起飞:1550      到达:1815      
               
    销售合计:184   成人:180       儿童:4         婴儿:0         
    候补合计:0     成人:0         儿童:0         婴儿:0         
    网上值机:11    成人:11        儿童:0         婴儿:0         
    电子客票:184   成人:180       儿童:4         婴儿:0         
    登机合计:0     成人:0         儿童:0         婴儿:0         
    值机合计:176   成人:172       儿童:4         婴儿:0         
    拉下合计:0     成人:0         儿童:0         婴儿:0         
               
    统计      区域      成人      儿童      婴儿      行李      
              OA        61        3         0       旅客行李:5/69.44
              OB        53        1         0       商务行李:9/118.55
              OC        58        0         0                   
              合计      172       4         0       行李合计:14/187.99
               
    柜台      合计      成人      儿童      婴儿      
    C12       165       161       4         0         
    `;
    console.log(tpl(data));
  })
});
