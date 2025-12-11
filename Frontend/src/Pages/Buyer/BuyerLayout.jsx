import React from 'react';
import { Outlet } from 'react-router-dom';

const BuyerLayout = () => {
  return (
    <div>
      <h2>Buyer Area</h2>
      <Outlet />
    </div>
  );
};

export default BuyerLayout;
