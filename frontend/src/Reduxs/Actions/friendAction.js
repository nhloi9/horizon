// import i18next from 'i18next';

import {deleteApi, getApi, postApi, putApi} from '../../network/api';
import {friendTypes} from '../Types/friendType';
import {globalTypes} from '../Types/globalType';

export const getAllFriendsAction = () => async (dispatch, getState) => {
	try {
		const {
			data: {friends},
		} = await getApi('/friend-requests/friends');
		dispatch({type: friendTypes.FRIEND_GET_ALL_SUCCESS, payload: friends});
	} catch (error) {
		// dispatch({type: globleTypes.ALERT, payload: {loading: false}});
	}
};

export const getSendRequestsAction = () => async (dispatch, getState) => {
	try {
		const {
			data: {friends},
		} = await getApi('/friend-requests/send');
		dispatch({
			type: friendTypes.FRIEND_GET_SEND_REQUESTS_SUCCESS,
			payload: friends,
		});
	} catch (error) {
		// dispatch({type: globleTypes.ALERT, payload: {loading: false}});
	}
};
export const getReceiveRequestsAction = () => async (dispatch, getState) => {
	try {
		const {
			data: {friends},
		} = await getApi('/friend-requests/receive');
		dispatch({
			type: friendTypes.FRIEND_GET_RECEIVE_REQUESTS_SUCCESS,
			payload: friends,
		});
	} catch (error) {
		// dispatch({type: globleTypes.ALERT, payload: {loading: false}});
	}
};

export const addFriendAction = (friendInfo) => async (dispatch, getState) => {
	try {
		dispatch({type: friendTypes.FRIEND_BUTTON_LOADING, payload: true});
		await postApi('/friend-requests/' + friendInfo.id);
		dispatch({type: friendTypes.FRIEND_ADD_SUCCESS, payload: friendInfo});
		dispatch({type: friendTypes.FRIEND_BUTTON_LOADING, payload: false});
	} catch (error) {
		dispatch({type: globalTypes.ALERT, payload: {error}});
		dispatch({type: friendTypes.FRIEND_BUTTON_LOADING, payload: false});
	}
};

export const cancelFriendRequestAction =
	(friendId) => async (dispatch, getState) => {
		try {
			dispatch({type: friendTypes.FRIEND_BUTTON_LOADING, payload: true});
			await deleteApi('/friend-requests/' + friendId);
			dispatch({type: friendTypes.FRIEND_CANCEL_SUCCESS, payload: friendId});
			dispatch({type: friendTypes.FRIEND_BUTTON_LOADING, payload: false});
		} catch (error) {
			dispatch({type: globalTypes.ALERT, payload: {error}});
			dispatch({type: friendTypes.FRIEND_BUTTON_LOADING, payload: false});
		}
	};

export const acceptFriendAction =
	(friendInfo) => async (dispatch, getState) => {
		try {
			dispatch({type: friendTypes.FRIEND_BUTTON_LOADING, payload: true});
			await putApi('/friend-requests/' + friendInfo.id);
			dispatch({type: friendTypes.FRIEND_ACCEPT_SUCCESS, payload: friendInfo});
			dispatch({type: friendTypes.FRIEND_BUTTON_LOADING, payload: false});
		} catch (error) {
			dispatch({type: globalTypes.ALERT, payload: {error}});
			dispatch({type: friendTypes.FRIEND_BUTTON_LOADING, payload: false});
		}
	};

export const rejectFriendAction = (friendId) => async (dispatch, getState) => {
	try {
		dispatch({type: friendTypes.FRIEND_BUTTON_LOADING, payload: true});
		await deleteApi('/friend-requests/' + friendId);
		dispatch({type: friendTypes.FRIEND_REJECT_SUCCESS, payload: friendId});
		dispatch({type: friendTypes.FRIEND_BUTTON_LOADING, payload: false});
	} catch (error) {
		dispatch({type: globalTypes.ALERT, payload: {error}});
		dispatch({type: friendTypes.FRIEND_BUTTON_LOADING, payload: false});
	}
};
