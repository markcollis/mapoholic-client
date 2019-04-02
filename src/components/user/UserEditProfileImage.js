import React from 'react';
import PropTypes from 'prop-types';
// import { withFormik, Form, Field } from 'formik';
// import * as Yup from 'yup';

const UserEditProfileImage = ({
  hide,
  selectedUser,
  // postProfileImage,
  // deleteProfileImage,
  // values,
  // errors,
  // touched,
}) => {
  return (
    <div>
      <h3 className="header">UserEditProfileImage component</h3>
      <button
        type="button"
        className="ui button"
        onClick={() => hide()}
      >
      Cancel
      </button>
    </div>
  );
};

UserEditProfileImage.propTypes = {
  hide: PropTypes.func.isRequired,
};

export default UserEditProfileImage;
