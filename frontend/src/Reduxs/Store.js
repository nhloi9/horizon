import {configureStore} from '@reduxjs/toolkit';
import {authReducer} from './Reducers/authReducer';
import {alertReducer} from './Reducers/alertReducer';

export const store = configureStore({
	reducer: {
		auth: authReducer,
		alert: alertReducer,
	},
});
