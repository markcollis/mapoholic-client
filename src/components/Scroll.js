import React from 'react';
import PropTypes from 'prop-types';

// The Scroll component implements a scrolling container for long lists
const Scroll = ({ children }) => {
  return (
    <div style={{ overflowY: 'scroll', border: '1px solid black', height: '500px' }}>
      { children }
    </div>
  );
};

Scroll.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Scroll;
