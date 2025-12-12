import React, { createContext, useContext, useState } from 'react';
import { useWeb3 } from './Web3Context';

const EscrowContext = createContext();

export const EscrowProvider = ({ children }) => {
  const [escrows, setEscrows] = useState([]);
  const { addTransaction } = useWeb3();

  // Create new escrow
  const createEscrow = (productId, amount, seller, buyer) => {
    const escrow = {
      id: 'ESC' + Date.now(),
      productId,
      amount,
      seller,
      buyer,
      status: 'pending', // pending → verified → released
      createdAt: Date.now(),
    };

    // Add to blockchain
    const tx = addTransaction({
      type: 'escrow_created',
      escrowId: escrow.id,
      amount,
      from: buyer,
      to: seller,
      status: 'pending'
    });

    const escrowWithTx = { ...escrow, transactionHash: tx.hash };
    setEscrows(prev => [escrowWithTx, ...prev]);
    return escrowWithTx;
  };

  // Verify escrow (product received)
  const verifyEscrow = (escrowId) => {
    setEscrows(prev => prev.map(e => 
      e.id === escrowId ? { ...e, status: 'verified', verifiedAt: Date.now() } : e
    ));

    const escrow = escrows.find(e => e.id === escrowId);
    if (escrow) {
      addTransaction({
        type: 'escrow_verified',
        escrowId,
        amount: escrow.amount,
        from: escrow.buyer,
        to: escrow.seller,
        status: 'verified'
      });
    }
  };

  // Release escrow funds
  const releaseEscrow = (escrowId) => {
    setEscrows(prev => prev.map(e => 
      e.id === escrowId ? { ...e, status: 'released', releasedAt: Date.now() } : e
    ));

    const escrow = escrows.find(e => e.id === escrowId);
    if (escrow) {
      addTransaction({
        type: 'escrow_released',
        escrowId,
        amount: escrow.amount,
        from: escrow.buyer,
        to: escrow.seller,
        status: 'completed'
      });
    }
  };

  return (
    <EscrowContext.Provider value={{
      escrows,
      createEscrow,
      verifyEscrow,
      releaseEscrow
    }}>
      {children}
    </EscrowContext.Provider>
  );
};

export const useEscrow = () => useContext(EscrowContext);