import React from 'react';
import forestBar from '../graphics/blueForestBarWide.png';

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
      &nbsp;&copy;&nbsp;
      <a href="mailto:mark@markandblanka.com">Mark Collis</a>
      &nbsp;2019
    </div>
  );
};

export default Footer;
