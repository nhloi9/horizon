import {createReducer} from '@reduxjs/toolkit';
import {authTypes} from '../Types/authType';

const initialState = {};
export const authReducer = createReducer(initialState, (builder) => {
	builder.addCase(authTypes.USER, (state, action) => {
		state.isLogin = true;
		state.user = action.payload;
	});
});
