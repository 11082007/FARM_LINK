import React from 'react';
import { Outlet } from 'react-router-dom';

const FarmerLayout = () => {
  return (
    <div>
      <h2>Farmer Area</h2>
      <Outlet />
    </div>
  );
};

export default FarmerLayout;
