import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Trans } from '@lingui/macro';
import { Redirect } from 'react-router-dom';

class UserDelete extends Component {
  static propTypes = {
    deleteUser: PropTypes.func.isRequired,
    getUserList: PropTypes.func.isRequired,
    isSelf: PropTypes.bool,
    selectedUser: PropTypes.objectOf(PropTypes.any),
    setUserViewMode: PropTypes.func.isRequired,
  };

  static defaultProps = {
    isSelf: false,
    selectedUser: null,
  };

  state = {
    redirectToLogout: false,
  };

  render() {
    // console.log('this.props in UserDelete', this.props);
    // console.log('this.state in UserDelete', this.state);
    const { redirectToLogout } = this.state;
    if (redirectToLogout) return <Redirect to="/logout" push />;
    const {
      deleteUser,
      getUserList,
      isSelf,
      selectedUser,
      setUserViewMode,
    } = this.props;
    if (!selectedUser) return null;
    const { _id: userId, displayName } = selectedUser;
    return (
      <div className="ui segment">
        <h3><Trans>Delete User</Trans></h3>
        <p>
          <Trans>
            Deleting a user removes their details and all of their event records
            including maps. All that is retained is any comments that they have
            made on other users&apos; maps.
          </Trans>
        </p>
        <div className="ui negative message">
        If you are deleting your own user account you will be immediately logged out
        and will have to create a new account if you wish to rejoin in future.
        </div>
        <button
          type="button"
          className="ui red button"
          onClick={() => deleteUser(userId, (successful) => {
            if (successful) {
              getUserList();
              if (isSelf) {
                this.setState({ redirectToLogout: true }, () => {
                  setUserViewMode('none');
                });
              }
            }
          })}
        >
          <Trans>{`Delete ${displayName}?`}</Trans>
        </button>
        <button
          type="button"
          className="ui button right floated"
          onClick={() => setUserViewMode('view')}
        >
          <Trans>Cancel</Trans>
        </button>
      </div>
    );
  }
}

export default UserDelete;
