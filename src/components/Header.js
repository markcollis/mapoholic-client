import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { getCurrentUserAction } from '../actions';

const Header = ({
  location,
  auth,
  currentUser,
  getCurrentUser,
}) => {
  if (!currentUser) { // check here because Header is always rendered
    // console.log('no current user!');
    getCurrentUser();
  }
  const userDetails = (currentUser)
    ? `logged in as: ${currentUser.displayName}`
    : '...';
  if (auth) {
    return (
      <div className="app-header ui menu">
        <Link to="/" className="active item">OMapFolder</Link>
        <Link to="/logout" className={(location.pathname === '/logout') ? 'active blue item' : 'item'}>Log Out</Link>
        <Link to="/feature" className={(location.pathname === '/feature') ? 'active blue item' : 'item'}>Feature</Link>
        <Link to="/profile" className={(location.pathname === '/profile') ? 'active blue item' : 'item'}>User Profile</Link>
        <div className="item right">{userDetails}</div>
      </div>
    );
  }
  return (
    <div className="app-header ui menu">
      <Link to="/" className="active item">OMapFolder</Link>
      <Link to="/signup" className={(location.pathname === '/signup') ? 'active blue item' : 'item'}>Sign Up</Link>
      <Link to="/login" className={(location.pathname === '/login') ? 'active blue item' : 'item'}>Log In</Link>
      <Link to="/profile" className={(location.pathname === '/profile') ? 'active blue item' : 'item'}>User Profile?</Link>
    </div>
  );
};

Header.propTypes = {
  auth: PropTypes.string,
  location: PropTypes.objectOf(PropTypes.any).isRequired,
  currentUser: PropTypes.objectOf(PropTypes.any),
  getCurrentUser: PropTypes.func.isRequired,
};
Header.defaultProps = {
  auth: '',
  currentUser: null,
};

const mapStateToProps = ({ auth, user }) => {
  return { auth: auth.authenticated, currentUser: user.current };
};

export default connect(mapStateToProps, { getCurrentUser: getCurrentUserAction })(Header);
