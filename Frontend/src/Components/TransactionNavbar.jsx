import { Link } from 'react-router-dom';
import { Layers, Wallet, Leaf } from 'lucide-react';
import WalletConnect from './WalletConnect';

const Header = ({ currentPath, navigate, walletAddress, connectDemoWallet, disconnectWallet, isConnecting }) => {
  return (
    <nav
      className={`bg-white px-6 py-4 sticky top-0 z-50 border-b 
        ${walletAddress ? 'border-green-300' : 'border-red-300'}
      `}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Left side - Logo & Navigation */}
        <div className="flex items-center gap-6">

          <Link to="/paymenthome" className="flex items-center gap-2">
            <Leaf className="h-8 w-8 text-primary" />
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-2xl font-bold text-transparent">
              FarmLink
            </span>
          </Link>

          <button 
            onClick={() => navigate('/blockchain-explorer')}
            className={`flex items-center gap-2 ${
              currentPath === '/blockchain-explorer' 
                ? 'text-green-600 font-medium' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Layers size={18} />
            Explorer
          </button>
        </div>

        {/* Right side - Wallet Connection */}
            <WalletConnect />
      </div>
    </nav>
  );
};

export default Header;
