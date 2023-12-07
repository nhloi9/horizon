import {BrowserRouter, Routes, Route} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {Toaster} from 'react-hot-toast';

import './i18n';

import {AiOutlineGlobal} from 'react-icons/ai';

import NoPage from './Pages/NoPage';
import Signin from './Pages/Signin';
import {Suspense, useEffect, useReducer} from 'react';
import {checkAuthAction} from './Reduxs/Actions/authAction';
import Alert from './Components/Alert/Alert';
import Protected from './Components/Protect/Protected';
import HomePage from './Pages/HomePage';
import Signup from './Pages/SignUp';
import ActivationPage from './Pages/ActivationPage';
import {ConfigProvider, theme} from 'antd';
import ProfilePage from './Pages/ProfilePage';
import {
	getAllFriendsAction,
	getReceiveRequestsAction,
	getSendRequestsAction,
} from './Reduxs/Actions/friendAction';
import {getHomePostsAction} from './Reduxs/Actions/postAction';
import PhotoPage from './Pages/PhotoPage';
import ForgetPasswordPage from './Pages/ForgetPasswordPage';
// import PostModal from './Components/PostCard/PostModal';
function App() {
	const dispatch = useDispatch();
	const {darkAlgorithm, defaultAlgorithm} = theme;
	const themeApp = useSelector((state) => state.theme);
	const {user} = useSelector((state) => state.auth);
	const {activePost} = useSelector((state) => state.homePost);

	useEffect(() => {
		dispatch(checkAuthAction());
	}, [dispatch]);

	useEffect(() => {
		if (themeApp === 'dark') {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	}, [themeApp]);

	useEffect(() => {
		if (user?.id) {
			dispatch(getAllFriendsAction());
			dispatch(getSendRequestsAction());
			dispatch(getReceiveRequestsAction());
			dispatch(getHomePostsAction());
		}
	}, [dispatch, user?.id]);
	return (
		<div className="min-h-screen dark:bg-dark-200">
			<Suspense>
				<ConfigProvider
					theme={{
						algorithm: themeApp === 'dark' ? darkAlgorithm : defaultAlgorithm,
					}}
				>
					<BrowserRouter>
						<Alert />
						<div className="fixed left-0 bottom-[100px] w-min h-min p-2 bg-[#00000076]">
							<AiOutlineGlobal
								size={'18px'}
								color="white"
								className="cursor-pointer"
							/>
						</div>

						{/* {activePost && <PostModal />} */}

						<Routes>
							<Route
								path="/"
								element={
									<Protected>
										<HomePage />
									</Protected>
								}
							/>
							<Route
								path="/profile/:id"
								element={
									<Protected>
										<ProfilePage />
									</Protected>
								}
							/>

							<Route
								path="/photo"
								element={
									<Protected>
										<PhotoPage />
									</Protected>
								}
							/>
							<Route
								path="/signin"
								element={<Signin />}
							/>
							<Route
								path="/forget-password"
								element={<ForgetPasswordPage />}
							/>
							<Route
								path="/signup"
								element={<Signup />}
							/>
							<Route
								path="/active-email/:token"
								element={<ActivationPage />}
							/>
							<Route
								path="*"
								element={<NoPage />}
							/>
						</Routes>
						<Toaster />
					</BrowserRouter>
				</ConfigProvider>
			</Suspense>
		</div>
	);
}

export default App;
