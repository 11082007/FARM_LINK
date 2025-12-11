const express = require('express');
const router = express.Router();
const { Ledger, User } = require('../models');
const { Sequelize, Op } = require('sequelize');
const crypto = require('crypto');

// Helper function to calculate hash - DEBUGGED VERSION
const calculateHash = (transactionData) => {
  console.log('=== CALCULATE HASH START ===');
  console.log('Input transactionData:', transactionData);
  console.log('Type of transactionData:', typeof transactionData);
  
  try {
    // Ensure all values are primitives
    const sanitizedData = {
      transactionId: String(transactionData.transactionId || ''),
      fromUserId: Number(transactionData.fromUserId) || 0,
      toUserId: Number(transactionData.toUserId) || 0,
      amount: Number(transactionData.amount) || 0,
      description: String(transactionData.description || ''),
      metadata: JSON.stringify(transactionData.metadata || {}),
      prevHash: String(transactionData.prevHash || ''),
      timestamp: String(transactionData.timestamp || '')
    };
    
    console.log('Sanitized data:', sanitizedData);
    
    // Create a deterministic string
    const dataString = 
      `transactionId:${sanitizedData.transactionId}|` +
      `fromUserId:${sanitizedData.fromUserId}|` +
      `toUserId:${sanitizedData.toUserId}|` +
      `amount:${sanitizedData.amount}|` +
      `description:${sanitizedData.description}|` +
      `metadata:${sanitizedData.metadata}|` +
      `prevHash:${sanitizedData.prevHash}|` +
      `timestamp:${sanitizedData.timestamp}`;
    
    console.log('Data string to hash:', dataString);
    
    // Calculate hash
    const hash = crypto.createHash('sha256').update(dataString).toString('hex');
    
    console.log('Generated hash:', hash);
    console.log('Hash length:', hash.length);
    console.log('Hash type:', typeof hash);
    console.log('=== CALCULATE HASH END ===');
    
    return hash;
  } catch (error) {
    console.error('Hash calculation error:', error);
    // Emergency fallback
    return crypto.createHash('sha256')
      .update(Date.now().toString())
      .toString('hex');
  }
};

// Helper to get previous hash - DEBUGGED
const getPreviousHash = async () => {
  try {
    const lastTransaction = await Ledger.findOne({
      order: [['createdAt', 'DESC']],
      attributes: ['hash']
    });
    
    console.log('=== GET PREVIOUS HASH ===');
    console.log('Last transaction found:', lastTransaction ? 'Yes' : 'No');
    
    if (lastTransaction) {
      console.log('Last transaction hash:', lastTransaction.hash);
      console.log('Hash type:', typeof lastTransaction.hash);
      console.log('Returning existing hash');
      return String(lastTransaction.hash || '0'.repeat(64));
    }
    
    console.log('No previous transactions, returning genesis hash');
    const genesisHash = '0'.repeat(64);
    console.log('Genesis hash:', genesisHash);
    console.log('=== GET PREVIOUS HASH END ===');
    
    return genesisHash;
  } catch (error) {
    console.error('Error getting previous hash:', error);
    return '0'.repeat(64);
  }
};

// 1. POST /api/escrow/create - Create blockchain-style transaction
router.post('/create', async (req, res) => {
  console.log('=== CREATE ESCROW START ===');
  console.log('Request body:', req.body);
  
  try {
    const { fromUserId, toUserId, amount, description, metadata } = req.body;
    
    // Validate required fields
    if (!fromUserId || !toUserId || !amount) {
      console.log('Validation failed: Missing required fields');
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get previous hash for chain linking
    console.log('Getting previous hash...');
    const prevHash = await getPreviousHash();
    console.log('Previous hash received:', prevHash);
    console.log('PrevHash type:', typeof prevHash);
    console.log('PrevHash length:', prevHash.length);
    
    // Generate unique transaction ID
    const transactionId = `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    console.log('Generated transactionId:', transactionId);
    
    // Create transaction data for hashing
    const transactionData = {
      transactionId,
      fromUserId: Number(fromUserId),
      toUserId: Number(toUserId),
      amount: Number(amount),
      description: String(description || ''),
      metadata: metadata || {},
      prevHash: String(prevHash), // Ensure it's a string
      timestamp: new Date().toISOString()
    };
    
    console.log('Transaction data for hashing:', transactionData);
    
    // Calculate hash
    console.log('Calculating hash...');
    const hash = calculateHash(transactionData);
    console.log('Final hash to save:', hash);
    
    // Create ledger entry - EXPLICITLY set hash as string
    console.log('Creating ledger entry...');
    const ledgerEntry = await Ledger.create({
      transactionId: String(transactionId),
      fromUserId: Number(fromUserId),
      toUserId: Number(toUserId),
      amount: Number(amount),
      description: String(description || ''),
      metadata: metadata || {},
      prevHash: String(prevHash),
      hash: String(hash), // EXPLICIT string conversion
      status: 'pending',
      onChainTxHash: null
    });
    
    console.log('Ledger entry created. ID:', ledgerEntry.id);
    console.log('Saved hash:', ledgerEntry.hash);
    console.log('Saved hash type:', typeof ledgerEntry.hash);
    console.log('=== CREATE ESCROW END ===');
    
    res.status(201).json({
      message: 'Escrow transaction created successfully',
      transaction: {
        id: ledgerEntry.id,
        transactionId: ledgerEntry.transactionId,
        hash: String(ledgerEntry.hash), // Ensure string in response
        prevHash: String(ledgerEntry.prevHash),
        status: ledgerEntry.status
      }
    });

  } catch (error) {
    console.error('Error creating escrow:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Failed to create escrow transaction',
      details: error.message 
    });
  }
});

// Rest of the routes remain the same...
// [Keep all other routes unchanged from your previous version]
// Only change the calculateHash and getPreviousHash functions above

// 2. POST /api/escrow/:id/release - Release funds
router.post('/:id/release', async (req, res) => {
  try {
    const { id } = req.params;
    const { onChainTxHash, releaseNotes } = req.body;

    // Find the transaction
    const transaction = await Ledger.findByPk(id);
    
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    if (transaction.status !== 'pending') {
      return res.status(400).json({ 
        error: `Transaction status is ${transaction.status}, cannot release` 
      });
    }

    // Update transaction status
    transaction.status = 'released';
    transaction.onChainTxHash = onChainTxHash || transaction.onChainTxHash;
    
    // Add release metadata
    const updatedMetadata = {
      ...transaction.metadata,
      releasedAt: new Date().toISOString(),
      releaseNotes: releaseNotes || ''
    };
    
    transaction.metadata = updatedMetadata;
    await transaction.save();

    res.json({
      message: 'Funds released successfully',
      transaction: {
        id: transaction.id,
        transactionId: transaction.transactionId,
        status: transaction.status,
        onChainTxHash: transaction.onChainTxHash
      }
    });

  } catch (error) {
    console.error('Error releasing funds:', error);
    res.status(500).json({ error: 'Failed to release funds' });
  }
});

// 3. GET /api/escrow/verify/:hash - Verify transaction integrity
router.get('/verify/:hash', async (req, res) => {
  try {
    const { hash } = req.params;
    
    // Find transaction by hash
    const transaction = await Ledger.findOne({ where: { hash } });
    
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    // Recalculate hash to verify integrity
    const transactionData = {
      transactionId: transaction.transactionId,
      fromUserId: transaction.fromUserId,
      toUserId: transaction.toUserId,
      amount: transaction.amount,
      description: transaction.description,
      metadata: transaction.metadata,
      prevHash: transaction.prevHash,
      timestamp: transaction.createdAt.toISOString()
    };

    const recalculatedHash = calculateHash(transactionData);
    const isHashValid = recalculatedHash === hash;

    // Check chain integrity
    const previousTransaction = await Ledger.findOne({
      where: { hash: transaction.prevHash }
    });

    const chainIntegrity = {
      hashValid: isHashValid,
      previousLinkExists: !!previousTransaction || transaction.prevHash === '0'.repeat(64),
      isGenesis: transaction.prevHash === '0'.repeat(64)
    };

    res.json({
      transaction: {
        id: transaction.id,
        transactionId: transaction.transactionId,
        status: transaction.status
      },
      verification: {
        ...chainIntegrity,
        integrityCheck: chainIntegrity.hashValid && chainIntegrity.previousLinkExists,
        lastVerified: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error verifying transaction:', error);
    res.status(500).json({ error: 'Failed to verify transaction' });
  }
});

// 4. GET /api/escrow/chain - View entire ledger chain
router.get('/chain', async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;
    
    const transactions = await Ledger.findAll({
      order: [['createdAt', 'ASC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [
        { 
          model: User, 
          as: 'sender', 
          attributes: ['id', 'firstName', 'lastName', 'walletAddress']
        },
        { 
          model: User, 
          as: 'receiver', 
          attributes: ['id', 'firstName', 'lastName', 'walletAddress']
        }
      ]
    });

    // Calculate chain integrity
    const chainWithIntegrity = await Promise.all(
      transactions.map(async (tx, index) => {
        const prevTx = index > 0 ? transactions[index - 1] : null;
        
        // Verify hash
        const transactionData = {
          transactionId: tx.transactionId,
          fromUserId: tx.fromUserId,
          toUserId: tx.toUserId,
          amount: tx.amount,
          description: tx.description,
          metadata: tx.metadata,
          prevHash: tx.prevHash,
          timestamp: tx.createdAt.toISOString()
        };
        
        const recalculatedHash = calculateHash(transactionData);
        const isHashValid = recalculatedHash === tx.hash;
        const isPrevHashValid = prevTx ? tx.prevHash === prevTx.hash : tx.prevHash === '0'.repeat(64);

        return {
          ...tx.toJSON(),
          verification: {
            hashValid: isHashValid,
            previousLinkValid: isPrevHashValid,
            blockValid: isHashValid && isPrevHashValid
          }
        };
      })
    );

    const chainIntegrity = chainWithIntegrity.every(tx => tx.verification.blockValid);

    res.json({
      chain: chainWithIntegrity,
      metadata: {
        totalBlocks: chainWithIntegrity.length,
        chainIntegrity,
        genesisBlock: chainWithIntegrity[0]?.prevHash === '0'.repeat(64)
      }
    });

  } catch (error) {
    console.error('Error fetching chain:', error);
    res.status(500).json({ error: 'Failed to fetch ledger chain' });
  }
});

// 5. GET /api/escrow/user - Get user's transactions
router.get('/user', async (req, res) => {
  try {
    const { userId, type = 'all', limit = 20, offset = 0 } = req.query;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    let whereClause = {};
    
    if (type === 'sent') {
      whereClause.fromUserId = userId;
    } else if (type === 'received') {
      whereClause.toUserId = userId;
    } else if (type === 'all') {
      whereClause = {
        [Op.or]: [
          { fromUserId: userId },
          { toUserId: userId }
        ]
      };
    }

    const transactions = await Ledger.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [
        { 
          model: User, 
          as: 'sender', 
          attributes: ['id', 'firstName', 'lastName', 'walletAddress'],
          required: type !== 'received'
        },
        { 
          model: User, 
          as: 'receiver', 
          attributes: ['id', 'firstName', 'lastName', 'walletAddress'],
          required: type !== 'sent'
        }
      ]
    });

    const stats = {
      total: transactions.length,
      pending: transactions.filter(t => t.status === 'pending').length,
      released: transactions.filter(t => t.status === 'released').length,
      failed: transactions.filter(t => t.status === 'failed').length
    };

    res.json({
      userId,
      stats,
      transactions
    });

  } catch (error) {
    console.error('Error fetching user transactions:', error);
    res.status(500).json({ error: 'Failed to fetch user transactions' });
  }
});

module.exports = router;