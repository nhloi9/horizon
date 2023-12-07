import {createReducer} from '@reduxjs/toolkit';
import {postTypes} from '../Types/postType';
import {addOrUpdateToArray, updateToArray} from '../Types/globalType';

export const homePostReducer = createReducer(
	{posts: [], activePost: null},
	(builder) => {
		builder
			.addCase(postTypes.GET_HOME_POST_SUCCESS, (state, action) => {
				state.posts = [...state.posts, ...action.payload];
			})
			.addCase(postTypes.HOME_POST, (state, action) => {
				state.posts = updateToArray(state.posts, action.payload);
			})
			.addCase(postTypes.ACTIVE_POST, (state, action) => {
				state.activePost = action.payload;
			});
	}
);

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
