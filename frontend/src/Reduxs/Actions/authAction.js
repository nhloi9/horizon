// import i18next from 'i18next';

import {getApi, postApi} from '../../network/api';
import {authTypes} from '../Types/authType';
import {globleTypes} from '../Types/globleType';

export const checkAuthAction = () => async (dispatch, getState) => {
	try {
		dispatch({type: globleTypes.ALERT, payload: {loading: true}});
		const {
			data: {user},
		} = await getApi('/users');
		dispatch({type: globleTypes.ALERT, payload: {loading: false}});
		dispatch({type: authTypes.USER, payload: user});
	} catch (error) {
		dispatch({type: globleTypes.ALERT, payload: {loading: false}});
	}
};

export const siginAction =
	({email, password}) =>
	async (dispatch, getState) => {
		try {
			dispatch({type: globleTypes.ALERT, payload: {loading: true}});

			const {
				data: {user},
			} = await postApi('/users/login', {email, password});
			dispatch({type: authTypes.USER, payload: user});
			dispatch({
				type: globleTypes.ALERT,
				payload: {loading: false, success: 'Welcome back!' + user?.fullname},
			});
		} catch (error) {
			dispatch({
				type: globleTypes.ALERT,
				payload: {loading: false, error},
			});
		}
	};

export const signupAction =
	({email, password, firstname, lastname}) =>
	async (dispatch, getState) => {
		try {
			dispatch({type: globleTypes.ALERT, payload: {loading: true}});

			const {msg} = await postApi('/users/register', {
				email,
				password,
				firstname,
				lastname,
			});
			dispatch({
				type: globleTypes.ALERT,
				payload: {loading: false, success: msg},
			});
		} catch (error) {
			dispatch({
				type: globleTypes.ALERT,
				payload: {loading: false, error},
			});
		}
	};

export const activeAcountAction = (token) => async (dispatch, getState) => {
	try {
		const {msg} = await getApi(`users/active-acount/${token}`);
		dispatch({
			type: globleTypes.ALERT,
			payload: {success: msg},
		});
	} catch (error) {
		console.log(error);

		dispatch({
			type: globleTypes.ALERT,
			payload: {error},
		});
	}
};
