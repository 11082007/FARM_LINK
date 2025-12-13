import React from "react";
import { Outlet, Link, NavLink } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext.jsx";
import Button from "../Button/index.jsx";
import {
  LayoutDashboard,
  Package,
  MessageSquare,
  TrendingUp,
  Settings,
  LogOut,
  Leaf,
  ShoppingCart,
  Menu,
  X,
} from "lucide-react";
import { LanguageSelector } from "../LanguageSelector/index.jsx";
import { useState } from "react";

const DashboardHeader = ({ user, onLogout, onToggleMenu }) => (
  <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-card px-4 md:px-8">
    <button
      onClick={onToggleMenu}
      className="md:hidden"
      aria-label="Toggle navigation"
    >
      <Menu className="h-6 w-6" />
    </button>

    <div className="hidden md:flex"></div>

    <div className="flex items-center gap-4">
      <LanguageSelector />
      <span className="text-sm font-medium text-neutral">
        Hello, {user?.name || "User"}!
      </span>
      <Button
        btnClassName="bg-destructive text-destructive-foreground hover:bg-red-700 p-2"
        onClick={onLogout}
      >
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  </header>
);

const DashboardNav = ({ role }) => {
  const farmerLinks = [
    { to: "/farmer/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/farmer/market-prices", label: "Market Prices", icon: TrendingUp },
    { to: "/farmer/inquiries", label: "Inquiries", icon: MessageSquare },
  ];

  const buyerLinks = [
    { to: "/browse", label: "Browse Produce", icon: ShoppingCart },
    { to: "/my-inquiries", label: "My Inquiries", icon: MessageSquare },
  ];

  const links = role === "farmer" ? farmerLinks : buyerLinks;

  return (
    <nav className="flex flex-col gap-2 p-4">
      <Link to="/" className="mb-4 flex items-center gap-2 px-2">
        <Leaf className="h-6 w-6 text-primary" />
        <span className="text-xl font-bold text-foreground">FarmLink</span>
      </Link>

      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.to === "/farmer/dashboard" || link.to === "/browse"}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-3 py-2 text-neutral transition-all hover:bg-muted ${
              isActive ? "bg-muted text-primary" : ""
            }`
          }
        >
          <link.icon className="h-4 w-4" />
          {link.label}
        </NavLink>
      ))}

      <NavLink
        to="/settings"
        className={({ isActive }) =>
          `mt-auto flex items-center gap-3 rounded-lg px-3 py-2 text-neutral transition-all hover:bg-muted ${
            isActive ? "bg-muted text-primary" : ""
          }`
        }
      >
        <Settings className="h-4 w-4" />
        Settings
      </NavLink>
    </nav>
  );
};

export default function AuthLayout() {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="grid h-screen w-full md:grid-cols-[260px_1fr]">
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      <div
        className={`fixed top-0 z-50 h-full w-72 border-r bg-card shadow-lg transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <DashboardNav role={user?.role} />
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className="absolute right-4 top-4"
          aria-label="Close menu"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      <div className="hidden border-r bg-card md:block">
        <DashboardNav role={user?.role} />
      </div>

      <div className="flex flex-col">
        <DashboardHeader
          user={user}
          onLogout={logout}
          onToggleMenu={() => setIsMobileMenuOpen(true)}
        />
        <main className="flex-1 overflow-y-auto bg-base-200">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
