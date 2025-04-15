// components/Loader.js
import React from 'react';
import '../css/loader.css';

const Loader = () => {
  return (
    <div className="loader-wrapper">
      <div className="book">
        <div className="inner">
          <div className="left"></div>
          <div className="middle"></div>
          <div className="right"></div>
        </div>
        <ul>
          <li></li><li></li><li></li><li></li><li></li>
          <li></li><li></li><li></li><li></li><li></li>
        </ul>
      </div>
      <p>Loading your dashboard...</p>
    </div>
  );
};

export default Loader;
