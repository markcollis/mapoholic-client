import React from 'react';

import forestBar from '../graphics/blueForestBarWide.jpg';
import { MAPOHOLIC_VERSION, MAPOHOLIC_VERSION_YEAR } from '../config';

// The Footer component is always rendered at the bottom of every page
const Footer = () => {
  return (
    <div className="footer">
      <img src={forestBar} alt="separator" />
      <a
        href="https://github.com/markcollis/mapoholic-client"
        target="_blank"
        rel="noopener noreferrer"
      >
        MapOholic
      </a>
      &nbsp;v
      {MAPOHOLIC_VERSION}
      &nbsp;&copy;&nbsp;
      <a href="mailto:mark@markcollis.dev">Mark Collis</a>
      &nbsp;
      {MAPOHOLIC_VERSION_YEAR}
    </div>
  );
};

export default Footer;
