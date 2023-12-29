import {globalTypes, updateToArray} from '../Types/globalType';
import {upload} from '../../utils/imageUpload';
import {deleteApi, getApi, postApi, putApi} from '../../network/api';
import {postTypes} from '../Types/postType';
import {reacts} from '../../Constants';
import toast from 'react-hot-toast';

export const createPostAction =
	({content, photos, privacy, sentisment, location, tags, groupId}) =>
	async (dispatch, getState) => {
		console.log(content);
		try {
			dispatch({
				type: globalTypes.ALERT,
				payload: {
					loading: true,
				},
			});
			// console.log({photos});
			const thumbnailFiles = photos
				.filter((item) => item.thumbnailFile)
				.map((photo) => photo.thumbnailFile);

			const thumbnails = await upload(thumbnailFiles);

			const images = await upload(photos.map((photo) => photo.file));

			const res = await postApi('/posts', {
				files: images.map((image) => ({
					...image,
					thumbnail: thumbnails.find(
						(thumbnail) => image?.name?.slice(0, 4) === thumbnail?.name?.slice(0, 4)
					)?.url,
				})),
				text: content,
				privacy,
				feel: sentisment,
				tags,
				location,
				groupId,
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
			console.log(error);
			dispatch({type: globalTypes.ALERT, payload: {loading: false}});
		}
	};

export const updatePostAction =
	({content, photos, privacy, sentisment, location, tags, postId}) =>
	async (dispatch, getState) => {
		try {
			dispatch({
				type: globalTypes.ALERT,
				payload: {
					loading: true,
				},
			});
			console.log({photos});
			const newFiles = photos.filter((photo) => photo.file);
			const oldFiles = photos.filter((photo) => !photo.file);

			const thumbnailFiles = newFiles
				.filter((item) => item.thumbnailFile)
				.map((photo) => photo.thumbnailFile);

			const thumbnails = await upload(thumbnailFiles);

			const images = await upload(newFiles.map((photo) => photo.file));
			// console.log({
			// 	newFiles,
			// 	oldFiles,
			// 	thumbnailFiles,
			// 	files: [
			// 		...oldFiles,
			// 		...images.map((image) => ({
			// 			...image,
			// 			thumbnail: thumbnails.find(
			// 				(thumbnail) => image?.name?.slice(0, 4) === thumbnail?.name?.slice(0, 4)
			// 			)?.url,
			// 		})),
			// 	],
			// });

			const {
				data: {post},
			} = await putApi('/posts/' + postId, {
				files: [
					...oldFiles,
					...images.map((image) => ({
						...image,
						thumbnail: thumbnails.find(
							(thumbnail) => image?.name?.slice(0, 4) === thumbnail?.name?.slice(0, 4)
						)?.url,
					})),
				],
				text: content,
				privacy,
				feel: sentisment,
				tags,
				location,
			});
			dispatch({
				type: postTypes.POST,
				payload: post,
			});
			dispatch({
				type: globalTypes.ALERT,
				payload: {
					success: 'Updated successfully',
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
			console.log(error);
			dispatch({type: globalTypes.ALERT, payload: {loading: false}});
		}
	};

export const getHomePostsAction = () => async (dispatch, getState) => {
	try {
		console.log('get posts action');
		// console.log(getState());
		const {
			data: {posts},
		} = await getApi('/posts/home', {
			oldPosts: getState().post?.posts?.map((post) => post?.id),
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
			getState().post.posts.find((item) => item.id === postId)
		);
		post.reacts = post.reacts.filter((react) => react.userId !== user.id);
		const react = reacts.find((react) => react.id === reactId);
		post.reacts.push({
			userId: user.id,
			user,
			reactId,
			react,
			postId,
		});
		dispatch({
			type: postTypes.POST,
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
			getState().post?.posts.find((item) => item.id === postId)
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
			type: postTypes.POST,
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
			getState().post.posts.find((item) => item.id === postId)
		);
		const {user} = getState().auth;
		post.reacts = post.reacts.filter((react) => react.userId !== user.id);
		dispatch({
			type: postTypes.POST,
			payload: post,
		});
	} catch (error) {
		console.log(error);
		// dispatch({type: globalTypes.ALERT, payload: {loading: false}});
	}
};

export const createCommentAction =
	({postId, content, parentId, receiverId}) =>
	async (dispatch, getState) => {
		try {
			const {
				data: {comment},
			} = await postApi('/comments', {postId, content, parentId, receiverId});
			const post = structuredClone(
				getState().post.posts.find((item) => item.id === postId)
			);
			post.comments.push(comment);
			dispatch({
				type: postTypes.POST,
				payload: post,
			});
		} catch (error) {}
	};

// export const likeComment = (comment, post) => async (dispatch, getState) => {
// 	try {
// 		await putDataAPI(`/comment/${comment._id}/like`);
// 		const newComment = {
// 			...comment,
// 			likes: [...comment.likes, getState().auth.user],
// 		};
// 		const newPost = {
// 			...post,
// 			comments: updateArray(post.comments, newComment),
// 		};

// 		dispatch({
// 			type: POST_TYPES.UPDATE_POST,
// 			payload: newPost,
// 		});
// 	} catch (err) {
// 		console.log(err);
// 	}
// };
// export const unlikeComment = (comment, post) => async (dispatch, getState) => {
// 	try {
// 		await putDataAPI(`/comment/${comment._id}/unlike`);
// 		const newComment = {
// 			...comment,
// 			likes: removeFromArray(comment.likes, getState().auth.user),
// 		};
// 		const newPost = {
// 			...post,
// 			comments: updateArray(post.comments, newComment),
// 		};

// 		dispatch({
// 			type: POST_TYPES.UPDATE_POST,
// 			payload: newPost,
// 		});
// 	} catch (err) {
// 		console.log(err);
// 	}
// };

export const updateComment =
	({commentId, postId, content}) =>
	async (dispatch, getState) => {
		try {
			// const newComment = {
			// 	...comment,
			// 	content: content,
			// };
			// let newPost = {
			// 	...post,
			// 	comments: updateArray(post.comments, {...newComment, updating: true}),
			// };

			// dispatch({
			// 	type: POST_TYPES.UPDATE_POST,
			// 	payload: newPost,
			// });

			const {
				data: {comment},
			} = await putApi(`/comments/${commentId}`, {
				content,
			});

			const post = structuredClone(
				getState().post?.posts?.find((item) => item.id === postId)
			);

			if (post) {
				const newPost = {
					...post,
					comments: updateToArray(post.comments, comment),
				};
				dispatch({
					type: postTypes.POST,
					payload: newPost,
				});
			}
		} catch (err) {
			toast.error(err);
		}
	};
