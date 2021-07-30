import axios from 'axios';
import { setAlert } from './alert';
import {
	GET_PROFILE,
	PROFILE_ERROR,
	UPDATE_PROFILE,
	CLEAR_PROFILE,
	ACCOUNT_DELETED,
	GET_PROFILES,
	GET_REPOS,
} from './types';

//Get current users profile
export const getCurrentProfile = () => async (dispatch) => {
	try {
		const res = await axios.get('/api/profile/me');

		dispatch({
			type: GET_PROFILE,
			payload: res.data,
		});
	} catch (err) {
		dispatch({
			type: PROFILE_ERROR,
			payload: { msg: err.response.statusText, status: err.response.status },
		});
	}
};

//Get profiles of all users in the db
export const getProfiles = () => async (dispatch) => {
	dispatch({ type: CLEAR_PROFILE });

	try {
		const res = await axios.get('/api/profile');

		dispatch({
			type: GET_PROFILES,
			payload: res.data,
		});
	} catch (err) {
		dispatch({
			type: PROFILE_ERROR,
			payload: { msg: err.response.statusText, status: err.response.status },
		});
	}
};

//Get the profile of a single user by their ID
export const getProfileById = (userId) => async (dispatch) => {
	try {
		const res = await axios.get(`/api/profile/user/${userId}`);

		dispatch({
			type: GET_PROFILE,
			payload: res.data,
		});
	} catch (err) {
		dispatch({
			type: PROFILE_ERROR,
			payload: { msg: err.response.statusText, status: err.response.status },
		});
	}
};

//Get github repos of a particular user
export const getGithubRepos = (username) => async (dispatch) => {
	try {
		const res = await axios.get(`/api/profile/github/${username}`);

		dispatch({
			type: GET_REPOS,
			payload: res.data,
		});
	} catch (err) {
		dispatch({
			type: PROFILE_ERROR,
			payload: { msg: err.response.statusText, status: err.response.status },
		});
	}
};

//Create or update profile, pass formData for the actual values, history for client redirect, and whether we are editing or creating a new one
export const createProfile = (formData, history, edit = false) => async (
	dispatch
) => {
	try {
		// config object for sending data
		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};

		//api/profile route is used for both creating and updating, we pass our formData and config
		const res = await axios.post('/api/profile', formData, config);

		//re-get the profile, to confirm it has been updating
		dispatch({
			type: GET_PROFILE,
			payload: res.data,
		});

		//send an alert to the user whether profile was updated or created
		dispatch(setAlert(edit ? 'Profile Updated' : 'Profile Created', 'success'));

		//send user to dashboard after submit
		history.push('/dashboard');
	} catch (err) {
		const errors = err.response.data.errors;

		//if there are any errors, these will be shown in an alert
		if (errors) {
			errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
		}

		dispatch({
			type: PROFILE_ERROR,
			payload: { msg: err.response.statusText, status: err.response.status },
		});
	}
};

//Add Experience action, history allows for redirection
export const addExperience = (formData, history) => async (dispatch) => {
	try {
		//api/profile/experience route is used for adding experience to a user, we pass our formData and config
		const res = await axios.put('/api/profile/experience', formData);

		//re-get the profile, to confirm it has been updating
		dispatch({
			type: UPDATE_PROFILE,
			payload: res.data,
		});

		//send an alert to the user if experience added correctly
		dispatch(setAlert('Experience Added', 'success'));

		//send user to dashboard after submit
		history.push('/dashboard');
	} catch (err) {
		const errors = err.response.data.errors;

		//if there are any errors, these will be shown in an alert
		if (errors) {
			errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
		}

		dispatch({
			type: PROFILE_ERROR,
			payload: { msg: err.response.statusText, status: err.response.status },
		});
	}
};

//Add Education action, history allows for redirection
export const addEducation = (formData, history) => async (dispatch) => {
	try {
		// config object for sending data
		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};

		//api/profile/experience route is used for adding experience to a user, we pass our formData and config
		const res = await axios.put('/api/profile/education', formData, config);

		//re-get the profile, to confirm it has been updating
		dispatch({
			type: UPDATE_PROFILE,
			payload: res.data,
		});

		//send an alert to the user if experience added correctly
		dispatch(setAlert('Education Added', 'success'));

		//send user to dashboard after submit
		history.push('/dashboard');
	} catch (err) {
		const errors = err.response.data.errors;

		//if there are any errors, these will be shown in an alert
		if (errors) {
			errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
		}

		dispatch({
			type: PROFILE_ERROR,
			payload: { msg: err.response.statusText, status: err.response.status },
		});
	}
};

// Delete experience
export const deleteExperience = (id) => async (dispatch) => {
	try {
		const res = await axios.delete(`/api/profile/experience/${id}`);

		dispatch({
			type: UPDATE_PROFILE,
			payload: res.data,
		});

		dispatch(setAlert('Experience Removed', 'success'));
	} catch (err) {
		dispatch({
			type: PROFILE_ERROR,
			payload: { msg: err.response.statusText, status: err.response.status },
		});
	}
};

// Delete education
export const deleteEducation = (id) => async (dispatch) => {
	try {
		const res = await axios.delete(`/api/profile/education/${id}`);

		dispatch({
			type: UPDATE_PROFILE,
			payload: res.data,
		});

		dispatch(setAlert('Education Removed', 'success'));
	} catch (err) {
		dispatch({
			type: PROFILE_ERROR,
			payload: { msg: err.response.statusText, status: err.response.status },
		});
	}
};

//Delete account and profile
export const deleteAccount = () => async (dispatch) => {
	if (window.confirm('Are you positive? Account cannot be recovered!'))
		try {
			await axios.delete(`/api/profile/profile`);

			dispatch({ type: CLEAR_PROFILE });
			dispatch({ type: ACCOUNT_DELETED });

			dispatch(setAlert('Your account has been deleted'));
		} catch (err) {
			dispatch({
				type: PROFILE_ERROR,
				payload: { msg: err.response.statusText, status: err.response.status },
			});
		}
};
