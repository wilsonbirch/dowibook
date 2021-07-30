import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

//Private Route component will allow for certain routes to only be accesible through authentication, it takes in a component and if its loading or authenticated
const PrivateRoute = ({
	component: Component,
	auth: { isAuthenticated, loading },
	...rest
	//It will use a route like in app.js, render prop checks if the user is not authenticated, if they are authenticated the component will load
}) => (
	<Route
		{...rest}
		render={(props) =>
			!isAuthenticated && !loading ? (
				<Redirect to='/login' />
			) : (
				<Component {...props} />
			)
		}
	/>
);

PrivateRoute.propTypes = {
	auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
	auth: state.auth,
});

export default connect(mapStateToProps)(PrivateRoute);
