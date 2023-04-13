import React from 'react';
import { ProgressBar } from 'react-loader-spinner';

const PageLoader = () => {
  return (
    <div className="react-loader-n" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <ProgressBar type="TailSpin" color="#00BFFF" height={80} width={80} />
    </div>
  );
};

export default PageLoader;