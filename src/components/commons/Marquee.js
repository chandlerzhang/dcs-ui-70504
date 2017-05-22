import React from 'react' ;
import style from './css/marquee.css';
/**
 * 跑马灯组件
 */
export default class Marquee extends React.Component {
	
	componentDidMount = () => {
		this.timerID = this.textAutoScroll(this.refs.wrapper , this.refs.inner , 30);
	}

	/**
	 * 文字走马灯效果
	 */
	textAutoScroll = (parent, inner, speed) =>  {
	  if (inner.scrollWidth > parent.offsetWidth) {
	    inner.innerHTML += inner.innerHTML;
	    return setInterval(function () {
	      if (inner.scrollLeft <= inner.scrollWidth - parent.offsetWidth) {
	        inner.scrollLeft++;
	        if (inner.scrollLeft >= inner.scrollWidth / 2) {
	          inner.scrollLeft = 0;
	        }
	      }
	    }, speed);
	  }
	}

	componentWillUnmount = () => {
		clearInterval(this.timerID);
	}

	render () {
		return (
			<div ref="wrapper" className={style.marqueeWrapper}>
				<span ref="inner">{this.props.children}</span>
			</div>
		)
	}
} 