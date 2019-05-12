import React from 'react';
import requireAuth from './requireAuth';
import TestMap from './TestMap';

const Feature = () => {
  return (
    <div className="feature ui segment">
      <h3 className="header">Special Feature for Registered Users only</h3>
      <p>Template for registered user pages in real app...</p>
      <TestMap />
    </div>
  );
};

export default requireAuth(Feature);
