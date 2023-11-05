import Axios from 'axios';
import qs from 'qs';

const axios = Axios.create({
	baseURL: 'http://localhost:3333',
	timeout: 5000,
	withCredentials: true,
});

export const getApi = (url, params) => {
	return axios
		.get(params ? url + '?' + qs.stringify(params) : url)
		.then((response) => response.data)
		.catch((error) => {
			if (error.response) return Promise.reject(error.response.data?.msg || '');
			return Promise.reject(error.message);
		});
};

export const postApi = (url, data) => {
	return axios.post(url, data).then((response) => response.data);
};
