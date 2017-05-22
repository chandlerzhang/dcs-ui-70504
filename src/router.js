import { Router, Route } from 'dva/router';
import Main from "./routes/Main";

export default function ({ history }) {
	return (
		<Router history={history}>
	    	<Route path="/" component={Main} />
	  	</Router>
  	)
}
