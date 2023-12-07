// import i18next from 'i18next';

import {getApi, postApi, putApi} from '../../network/api';
import {authTypes} from '../Types/authType';
import {globalTypes} from '../Types/globalType';

export const checkAuthAction = () => async (dispatch, getState) => {
	try {
		dispatch({type: globalTypes.ALERT, payload: {loading: true}});
		const {
			data: {user},
		} = await getApi('/users');
		dispatch({type: globalTypes.ALERT, payload: {loading: false}});
		dispatch({type: authTypes.USER, payload: user});
	} catch (error) {
		dispatch({type: globalTypes.ALERT, payload: {loading: false}});
	}
};

export const siginAction =
	({email, password}) =>
	async (dispatch, getState) => {
		try {
			dispatch({type: globalTypes.ALERT, payload: {loading: true}});

			const {
				data: {user},
			} = await postApi('/users/login', {email, password});
			dispatch({type: authTypes.USER, payload: user});
			dispatch({
				type: globalTypes.ALERT,
				payload: {loading: false, success: 'Welcome back!' + user?.firstname},
			});
		} catch (error) {
			dispatch({
				type: globalTypes.ALERT,
				payload: {loading: false, error},
			});
		}
	};

export const signupAction =
	({email, password, firstname, lastname}) =>
	async (dispatch, getState) => {
		try {
			dispatch({type: globalTypes.ALERT, payload: {loading: true}});

			const {msg} = await postApi('/users/register', {
				email,
				password,
				firstname,
				lastname,
			});
			dispatch({
				type: globalTypes.ALERT,
				payload: {loading: false, success: msg},
			});
		} catch (error) {
			dispatch({
				type: globalTypes.ALERT,
				payload: {loading: false, error},
			});
		}
	};

export const activeAcountAction = (token) => async (dispatch, getState) => {
	try {
		const {msg} = await getApi(`users/active-acount/${token}`);
		dispatch({
			type: globalTypes.ALERT,
			payload: {success: msg},
		});
	} catch (error) {
		console.log(error);

		dispatch({
			type: globalTypes.ALERT,
			payload: {error},
		});
	}
};

export const logoutAction = () => async (dispatch, getState) => {
	try {
		dispatch({type: globalTypes.ALERT, payload: {loading: true}});
		await getApi(`users/logout`);
		dispatch({
			type: authTypes.LOGOUT_SUCCESS,
		});
	} catch (error) {
		dispatch({
			type: globalTypes.ALERT,
			payload: {loading: false, error},
		});
	}
};

export const updateAvatarAction = (avatar) => async (dispatch, getState) => {
	try {
		dispatch({type: globalTypes.ALERT, payload: {loading: true}});
		const {msg} = await putApi(`users/avatar`, avatar);
		dispatch({type: authTypes.UPDATE_AVATAR_SUCCESS, payload: avatar});
		dispatch({type: globalTypes.ALERT, payload: {success: msg}});
	} catch (error) {
		dispatch({
			type: globalTypes.ALERT,
			payload: {loading: false, error},
		});
	}
};

export const updateCoverImageAction = (image) => async (dispatch, getState) => {
	try {
		dispatch({type: globalTypes.ALERT, payload: {loading: true}});
		const {msg} = await putApi(`users/cover-image`, image);
		dispatch({type: authTypes.UPDATE_COVER_IMAGE_SUCCESS, payload: image});
		dispatch({type: globalTypes.ALERT, payload: {success: msg}});
	} catch (error) {
		dispatch({
			type: globalTypes.ALERT,
			payload: {loading: false, error},
		});
	}
};

export const updateProfileAction = (data) => async (dispatch, getState) => {
	console.log(data);
	try {
		dispatch({type: globalTypes.ALERT, payload: {loading: true}});
		const {
			data: {user},
		} = await putApi(`users/profile`, data);
		dispatch({type: authTypes.USER, payload: user});
		dispatch({
			type: globalTypes.ALERT,
			payload: {success: 'Updated profile successfully'},
		});
	} catch (error) {
		dispatch({
			type: globalTypes.ALERT,
			payload: {loading: false, error},
		});
	}
};
