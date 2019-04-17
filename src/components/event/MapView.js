import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class MapView extends Component {
  static propTypes = {
    // club: PropTypes.objectOf(PropTypes.any).isRequired,
    // user: PropTypes.objectOf(PropTypes.any).isRequired,
    oevent: PropTypes.objectOf(PropTypes.any).isRequired,
  }

  state = { temp: 'temp' }

  render() {
    const { oevent } = this.props;
    const { selectedEventDetails, selectedEventDisplay, selectedRunner } = oevent;
    return (
      <div className="ui segment">
        <h3>MapView component</h3>
        <p>{`Selected Event (details): ${selectedEventDetails}`}</p>
        <p>{`Selected Event (display): ${selectedEventDisplay}`}</p>
        <p>{`Selected Runner: ${selectedRunner}`}</p>
      </div>
    );
  }
}

const mapStateToProps = ({ club, user, oevent }) => {
  return { club, user, oevent };
};
const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(MapView);
