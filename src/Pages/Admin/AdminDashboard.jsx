import React, { useState } from "react";
import {
  LayoutDashboard,
  ShieldCheck, // For Escrow
  Wallet, // For Blockchain
  Users,
  Activity,
  Search,
  Menu,
  Copy,
  ExternalLink,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-300 font-sans flex overflow-hidden">
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0F172A]/90 backdrop-blur-xl border-r border-slate-700/50 transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:relative lg:translate-x-0`}
      >
        <div className="h-20 flex items-center px-6 border-b border-slate-700/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white font-bold">
              F
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              FarmLink
              <span className="text-xs ml-1 text-slate-500 font-mono">DAO</span>
            </span>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          <SidebarItem
            icon={<LayoutDashboard size={18} />}
            text="Protocol Overview"
            active={activeTab === "overview"}
            onClick={() => setActiveTab("overview")}
          />
          <SidebarItem
            icon={<ShieldCheck size={18} />}
            text="Escrow Manager"
            active={activeTab === "escrow"}
            onClick={() => setActiveTab("escrow")}
          />
          <SidebarItem
            icon={<Wallet size={18} />}
            text="Smart Contracts"
            active={activeTab === "contracts"}
            onClick={() => setActiveTab("contracts")}
          />
          <SidebarItem icon={<Users size={18} />} text="DAO Members" />
        </nav>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-96 bg-green-500/10 blur-[100px] pointer-events-none" />

        <header className="h-20 flex items-center justify-between px-8 z-10 border-b border-slate-700/30">
          <h2 className="text-xl font-semibold text-white">
            {activeTab === "overview"
              ? "Protocol Dashboard"
              : "Escrow Management"}
          </h2>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700 text-sm font-mono text-green-400">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              0xAdmin...892A
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-green-500 to-teal-500 border-2 border-[#0B1120]"></div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Web3StatCard
              title="Total Value Locked (TVL)"
              value="$4.2M"
              sub="12,400 USDC"
              change="+8%"
            />
            <Web3StatCard
              title="Active Escrows"
              value="843"
              sub="Pending Release"
              change="+12%"
            />
            <Web3StatCard
              title="Gas Fees Saved"
              value="1.2 ETH"
              sub="Layer 2 Optimization"
              change="+5%"
            />
            <Web3StatCard
              title="Token Price (FARM)"
              value="$0.85"
              sub="Market Cap: $8M"
              change="-2%"
              isNegative
            />
          </div>

          <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-700/50 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Live Escrow Transactions
                </h3>
                <p className="text-sm text-slate-500">
                  Real-time blockchain settlements
                </p>
              </div>
              <button className="px-4 py-2 bg-green-600/20 text-green-400 text-sm font-medium rounded-lg border border-green-600/50 hover:bg-green-600/30 transition-all">
                View on Etherscan
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-900/50 text-slate-400 uppercase text-xs font-mono">
                  <tr>
                    <th className="px-6 py-4">Tx Hash</th>
                    <th className="px-6 py-4">Buyer (Wallet)</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Smart Contract State</th>
                    <th className="px-6 py-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  <EscrowRow
                    hash="0x3a...9f21"
                    wallet="0x71...B39a"
                    amount="450 USDC"
                    status="LOCKED"
                    time="2 mins ago"
                  />
                  <EscrowRow
                    hash="0x8b...22c9"
                    wallet="0xB2...11x0"
                    amount="1,200 USDC"
                    status="RELEASED"
                    time="15 mins ago"
                  />
                  <EscrowRow
                    hash="0x1c...44a7"
                    wallet="0x99...F22c"
                    amount="85 USDC"
                    status="DISPUTE"
                    time="1 hour ago"
                  />
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

const SidebarItem = ({ icon, text, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
      active
        ? "bg-gradient-to-r from-green-500/20 to-emerald-500/10 text-green-400 border border-green-500/20"
        : "text-slate-400 hover:text-white hover:bg-white/5"
    }`}
  >
    {icon}
    <span className="font-medium">{text}</span>
  </button>
);

const Web3StatCard = ({ title, value, sub, change, isNegative }) => (
  <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 p-6 rounded-2xl relative overflow-hidden group hover:border-slate-600 transition-all">
    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
      <Activity size={40} />
    </div>
    <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">
      {title}
    </p>
    <div className="mt-2 flex items-baseline gap-2">
      <h3 className="text-2xl font-bold text-white">{value}</h3>
      <span
        className={`text-xs font-mono px-1.5 py-0.5 rounded ${
          isNegative
            ? "bg-red-500/10 text-red-400"
            : "bg-green-500/10 text-green-400"
        }`}
      >
        {change}
      </span>
    </div>
    <p className="text-slate-500 text-xs mt-1 font-mono">{sub}</p>
  </div>
);

const EscrowRow = ({ hash, wallet, amount, status, time }) => {
  const getStatusStyle = (s) => {
    if (s === "RELEASED")
      return "text-green-400 bg-green-400/10 border-green-400/20";
    if (s === "LOCKED")
      return "text-blue-400 bg-blue-400/10 border-blue-400/20";
    return "text-red-400 bg-red-400/10 border-red-400/20";
  };

  return (
    <tr className="hover:bg-white/5 transition-colors">
      <td className="px-6 py-4">
        <div className="flex items-center gap-2 text-green-400 font-mono text-xs">
          {hash}{" "}
          <ExternalLink
            size={12}
            className="opacity-50 hover:opacity-100 cursor-pointer"
          />
        </div>
      </td>
      <td className="px-6 py-4 text-slate-300 font-mono text-sm">{wallet}</td>
      <td className="px-6 py-4 text-white font-bold">{amount}</td>
      <td className="px-6 py-4">
        <span
          className={`px-2.5 py-1 rounded-md text-xs font-bold border ${getStatusStyle(
            status
          )}`}
        >
          {status}
        </span>
      </td>
      <td className="px-6 py-4">
        {status === "LOCKED" && (
          <button className="text-xs bg-green-600 hover:bg-green-500 text-white px-3 py-1.5 rounded transition-colors">
            Release Funds
          </button>
        )}
        {status === "DISPUTE" && (
          <button className="text-xs bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded transition-colors">
            Resolve
          </button>
        )}
        {status === "RELEASED" && (
          <span className="flex items-center gap-1 text-xs text-slate-500">
            <CheckCircle size={14} /> Confirmed
          </span>
        )}
      </td>
    </tr>
  );
};

export default AdminDashboard;
