import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CircleArrowRight, Leaf, Menu, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import Button from "../Button/index.jsx";
// import { LanguageSelector } from "../LanguageSelector/index.jsx";

export default function NavBar() {
  const { t } = useTranslation("common");
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: "/features", label: t("navbar.features") },
    { href: "/how-it-works", label: t("navbar.howItWorks") },
    { href: "/about-us", label: t("navbar.aboutUs") },
    { href: "/market-prices", label: t("navbar.marketPrices") },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Leaf className="h-8 w-8 text-primary" />
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-2xl font-bold text-transparent">
              FarmLink
            </span>
          </Link>

          <div className="hidden items-center gap-6 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-gray-700 transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <p className="text-sm">LangSelector</p>
            {/* <LanguageSelector /> */}
            <Link to="/login">
              <Button
                variant="ghost"
                btnClassName=" text-neutral hover:bg-secondary/10 hover:text-secondary hover:px-2 hover:py-1 hover:rounded-md"
              >
                {t("navbar.signIn")}
              </Button>
            </Link>
            <Link to="/register">
              <Button btnClassName="group flex items-center gap-2 bg-primary px-4 py-2 rounded-md text-white hover:bg-primary-dark">
                {t("navbar.createAccount")}
                <CircleArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          <div className="flex items-center md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="absolute left-0 w-full bg-white shadow-lg md:hidden">
          <div className="flex flex-col space-y-2 p-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            <hr className="my-2" />

            <div className="flex flex-col space-y-3">
              <p className="px-3">LangSelector</p>

              <Link to="/login">
                <Button
                  variant="ghost"
                  btnClassName="w-full justify-start text-neutral hover:bg-secondary/10 hover:text-secondary"
                >
                  {t("navbar.signIn")}
                </Button>
              </Link>
              <Link to="/register">
                <Button btnClassName="group flex w-full justify-center items-center gap-2 bg-primary text-white hover:bg-primary-dark">
                  {t("navbar.createAccount")}
                  <CircleArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
