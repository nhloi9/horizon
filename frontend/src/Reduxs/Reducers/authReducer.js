import {createReducer} from '@reduxjs/toolkit';
import {authTypes} from '../Types/authType';

const initialState = {};
export const authReducer = createReducer(initialState, (builder) => {
	builder
		.addCase(authTypes.USER, (state, action) => {
			state.isLogin = true;
			state.user = action.payload;
		})
		.addCase(authTypes.UPDATE_AVATAR_SUCCESS, (state, action) => {
			state.user = {...state.user, avatar: action.payload};
		})
		.addCase(authTypes.UPDATE_COVER_IMAGE_SUCCESS, (state, action) => {
			state.user = {
				...state.user,
				detail: {
					...(state.user.detail ?? {}),
					coverImage: action.payload,
				},
			};
		})
		.addCase(authTypes.SET_PASSWORD_SUCCESS, (state, action) => {
			state.user = {
				...state.user,
				password: undefined,
			};
		})
		.addCase(authTypes.LOGOUT_SUCCESS, (state, action) => ({}));
});
