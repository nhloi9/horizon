import {createReducer} from '@reduxjs/toolkit';
import {friendTypes} from '../Types/friendType';
import {authTypes} from '../Types/authType';

const initialState = {
	friends: [],
	sendRequests: [],
	receiveRequests: [],
	isLoading: false,
};
export const friendReducer = createReducer(initialState, (builder) => {
	builder
		.addCase(friendTypes.FRIEND_GET_ALL_SUCCESS, (state, action) => {
			state.friends = action.payload;
		})
		.addCase(friendTypes.FRIEND_GET_RECEIVE_REQUESTS_SUCCESS, (state, action) => {
			state.receiveRequests = action.payload;
		})
		.addCase(friendTypes.FRIEND_GET_SEND_REQUESTS_SUCCESS, (state, action) => {
			state.sendRequests = action.payload;
		})
		.addCase(friendTypes.FRIEND_ADD_SUCCESS, (state, action) => {
			state.sendRequests = [...state.sendRequests, action.payload];
		})
		.addCase(friendTypes.FRIEND_BUTTON_LOADING, (state, action) => {
			state.isLoading = action.payload;
		})
		.addCase(friendTypes.FRIEND_CANCEL_SUCCESS, (state, action) => {
			state.sendRequests = state.sendRequests.filter(
				(friend) => friend.id !== action.payload
			);
		})
		.addCase(friendTypes.FRIEND_ACCEPT_SUCCESS, (state, action) => {
			state.friends = [...state.friends, action.payload];
			state.receiveRequests = state.receiveRequests.filter(
				(friend) => friend.id !== action.payload.id
			);
		})
		.addCase(friendTypes.FRIEND_REJECT_SUCCESS, (state, action) => {
			state.receiveRequests = state.receiveRequests.filter(
				(friend) => friend.id !== action.payload
			);
		})
		.addCase(authTypes.LOGOUT_SUCCESS, (state, action) => ({}));
});

// export const friendAddReducer = createReducer({}, (builder) => {
// 	builder
// 		.addCase(friendTypes.FRIEND_ADD_REQUEST, (state, action) => {
// 			state.isLoading = true;
// 		})
// 		.addCase(friendTypes.FRIEND_ADD_SUCCESS, (state, action) => {
// 			state.isLoading = false;
// 		})
// 		.addCase(friendTypes.FRIEND_ADD_FAIL, (state, action) => {
// 			state.isLoading = false;
// 		});
// });

// export const friendRemoveReducer = createReducer({}, (builder) => {
// 	builder
// 		.addCase(friendTypes.FRIEND_REMOVE_REQUEST, (state, action) => {
// 			state.isLoading = true;
// 		})
// 		.addCase(friendTypes.FRIEND_REMOVE_SUCCESS, (state, action) => {
// 			state.isLoading = false;
// 			state.isSuccess = true;
// 		})
// 		.addCase(friendTypes.FRIEND_REMOVE_FAIL, (state, action) => {
// 			state.isLoading = false;
// 			state.isError = action.payload;
// 		})
// 		.addCase(friendTypes.FRIEND_REMOVE_RESET, (state, action) => {
// 			state.isSuccess = null;
// 			state.isError = null;
// 		});
// });
