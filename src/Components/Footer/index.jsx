import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Leaf } from "lucide-react";

export function Footer() {
  const { t } = useTranslation("common");

  return (
    <footer className="bg-base-200 text-muted-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Column 1: Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <Leaf className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold text-foreground">
                FarmLink
              </span>
            </Link>
            <p className="text-sm">
              Connecting farmers, buyers, and technology to build a more
              sustainable future for African agriculture.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#features" className="hover:text-primary">
                  {t("navbar.features")}
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-primary">
                  {t("navbar.howItWorks")}
                </a>
              </li>
              <li>
                <Link to="/market-prices" className="hover:text-primary">
                  {t("navbar.marketPrices")}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-3">Get Started</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/login" className="hover:text-primary">
                  {t("navbar.signIn")}
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-primary">
                  {t("navbar.createAccount")}
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-primary">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-8 text-center text-sm">
          <p>
            &copy; {new Date().getFullYear()} FarmLink. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
