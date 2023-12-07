import {configureStore} from '@reduxjs/toolkit';
import {authReducer} from './Reducers/authReducer';
import {alertReducer} from './Reducers/alertReducer';
import {themeReducer} from './Reducers/themeReducer';
import {friendReducer} from './Reducers/friendReducer';
import {homePostReducer} from './Reducers/postReducer';
// import {signinReducer} from './Reducers/signinReducer';

export const store = configureStore({
	reducer: {
		auth: authReducer,
		alert: alertReducer,
		theme: themeReducer,
		friend: friendReducer,
		homePost: homePostReducer,
		// signin: signinReducer,
	},
});
// const combinedReducer = combineReducers({
// 	auth: authReducer,
// 	alert: alertReducer,
// 	theme: themeReducer,
// 	friend: friendReducer,
// });

// export const store = configureStore({
// 	reducer: (state, action) => {
// 		if (action.type === authTypes.LOGOUT_SUCCESS) {
// 			// check for action type
// 			state = {};
// 		}
// 		return combinedReducer(state, action);
// 	},
// });
