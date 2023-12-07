import {globalTypes} from '../Types/globalType';
import {upload} from '../../utils/imageUpload';
import {deleteApi, getApi, postApi} from '../../network/api';
import {postTypes} from '../Types/postType';
import {reacts} from '../../Constants';

export const createPostAction =
	({content, photos, access}) =>
	async (dispatch, getState) => {
		try {
			dispatch({
				type: globalTypes.ALERT,
				payload: {
					loading: true,
				},
			});
			// console.log({photos});
			const images = await upload(photos);
			// console.log(content);
			// console.log(images);
			const res = await postApi('/posts', {
				files: images,
				text: content,
				access,
			});
			dispatch({
				type: postTypes.POST_CREATE_SUCCESS,
				// payload: {
				// 	...res?.data?.post,
				// 	user: getState().auth.user,
				// 	likes: [],
				// 	comments: [],
				// },
			});
			dispatch({
				type: globalTypes.ALERT,
				payload: {
					success: res?.msg,
				},
			});
			// const msg = {
			// 	receiver: getState().auth.user.followers.map((user) => user._id),
			// 	target: res.data.post._id,
			// 	module: 'post',
			// 	url: `/post/${res.data.post._id}`,
			// 	text: 'added a new post',
			// 	image: images[0].secure_url,
			// 	content,
			// };
			// dispatch(createNotify(msg));
			// socket.emit(
			// 	'join_post',
			// 	// res.data.posts.map((post) => post._id)
			// 	[res?.data.post._id]
			// );
		} catch (error) {
			dispatch({type: globalTypes.ALERT, payload: {loading: false}});
		}
	};

export const getHomePostsAction = () => async (dispatch, getState) => {
	try {
		// console.log(getState());
		const {
			data: {posts},
		} = await getApi('/posts/home', {
			oldPosts: getState().homePost.posts.map((post) => post.id),
		});
		dispatch({type: postTypes.GET_HOME_POST_SUCCESS, payload: posts});
	} catch (error) {
		console.log(error);
		// dispatch({type: globalTypes.ALERT, payload: {loading: false}});
	}
};

export const reactPost = (postId, reactId) => async (dispatch, getState) => {
	try {
		// console.log(getState());
		await postApi('/posts/' + postId + '/react', {
			reactId,
		});

		const {user} = getState().auth;
		const post = structuredClone(
			getState().homePost.posts.find((item) => item.id === postId)
		);
		post.reacts = post.reacts.filter((react) => react.userId !== user.id);
		const react = reacts.find((react) => react.id === reactId);
		post.reacts.push({
			userId: user.id,
			user,
			reactId,
			react,
		});
		dispatch({
			type: postTypes.HOME_POST,
			payload: post,
		});
	} catch (error) {
		console.log(error);
		// dispatch({type: globalTypes.ALERT, payload: {loading: false}});
	}
};

export const likePost = (postId) => async (dispatch, getState) => {
	try {
		// console.log(getState());
		await postApi('/posts/' + postId + '/react', {
			reactId: 1,
		});
		const {user} = getState().auth;
		const post = structuredClone(
			getState().homePost.posts.find((item) => item.id === postId)
		);
		post.reacts = post.reacts.filter((react) => react.userId !== user.id);
		const react = reacts.find((react) => react.id === 1);
		post.reacts.push({
			userId: user.id,
			user,
			reactId: 1,
			react,
		});
		dispatch({
			type: postTypes.HOME_POST,
			payload: post,
		});
	} catch (error) {
		console.log(error);
		// dispatch({type: globalTypes.ALERT, payload: {loading: false}});
	}
};

export const removeReactPost = (postId) => async (dispatch, getState) => {
	try {
		await deleteApi('/posts/' + postId + '/react');
		const post = structuredClone(
			getState().homePost.posts.find((item) => item.id === postId)
		);
		const {user} = getState().auth;
		post.reacts = post.reacts.filter((react) => react.userId !== user.id);
		dispatch({
			type: postTypes.HOME_POST,
			payload: post,
		});
	} catch (error) {
		console.log(error);
		// dispatch({type: globalTypes.ALERT, payload: {loading: false}});
	}
};

export const createCommentAction =
	(postId, content) => async (dispatch, getState) => {
		try {
			// const {data: comment} = await postApi('/comments', {postId, content});
			// const post = structuredClone(
			// 	getState().homePost.posts.find((item) => item.id === postId)
			// );
			// const {user} = getState().auth;
			// post.reacts = post.reacts.filter((react) => react.userId !== user.id);
			// dispatch({
			// 	type: postTypes.HOME_POST,
			// 	payload: post,
			// });
		} catch (error) {}
	};
