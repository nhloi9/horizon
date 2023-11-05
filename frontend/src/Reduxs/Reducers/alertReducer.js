import {createReducer} from '@reduxjs/toolkit';
import {globleTypes} from '../Types/globleType';

const initialState = {loading: true};
export const alertReducer = createReducer(initialState, (builder) => {
	builder.addCase(globleTypes.ALERT, (state, action) => {
		return action.payload;
	});
});
