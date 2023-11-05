import {BrowserRouter, Routes, Route} from 'react-router-dom';
import {useDispatch} from 'react-redux';
import {Toaster} from 'react-hot-toast';

import './i18n';

import {AiOutlineGlobal} from 'react-icons/ai';

import NoPage from './Pages/NoPage';
import Signin from './Pages/Signin';
import {Suspense, useEffect} from 'react';
import {checkAuthAction} from './Reduxs/Actions/authAction';
import Alert from './Components/Alert/Alert';
import Protected from './Components/Protect/Protected';
import HomePage from './Pages/HomePage';
import Signup from './Pages/SignUp';
import ActivationPage from './Pages/ActivationPage';
function App() {
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(checkAuthAction());
	}, [dispatch]);
	return (
		<Suspense>
			<BrowserRouter>
				<Alert />
				<div className="fixed left-0 bottom-[100px] w-min h-min p-2 bg-[#00000076]">
					<AiOutlineGlobal
						size={'18px'}
						color="white"
						className="cursor-pointer"
					/>
				</div>
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
						path="/signin"
						element={<Signin />}
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
		</Suspense>
	);
}

export default App;
