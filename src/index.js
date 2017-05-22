import dva from 'dva';
import { useRouterHistory } from 'dva/router';
import { createHashHistory } from 'history';
import createLoading from 'dva-loading';
import { message } from 'antd';
import './index.css';	

const ERROR_MSG_DURATION = 3; // 3 秒

// 1. Initialize
const app = dva({
	history: useRouterHistory(createHashHistory)({ queryKey: false }),
	onError(e) {
    	message.error(e.message || "服务器繁忙！", ERROR_MSG_DURATION);
  	}
});

// 2. Plugins
app.use(createLoading());

// 3. Model
app.model(require('./models/MainModel'));

// 4. Router
app.router(require('./router'));

// 5. Start
app.start('#root');
