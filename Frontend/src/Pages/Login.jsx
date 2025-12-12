import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../Context/AuthContext";
import { Sprout, Mail, Lock, ArrowRight } from "lucide-react";
import Button from "../Components/Button/index.jsx";
import Card from "../Components/Card/index.jsx";
import Input from "../Components/Input/index.jsx";
import { loginUser } from "../Services/api.js";
import { supabase } from "../lib/supabase.js";

export default function LoginPage() {
  const { t } = useTranslation("auth");
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const hardcodedCredentials = [
      {
        email: "farmer@farmlink.com",
        password: "farmerpassword",
        role: "farmer",
      },
      {
        email: "buyer@farmlink.com",
        password: "buyerpassword",
        role: "buyer",
      },
    ];

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    const user = hardcodedCredentials.find(
      (u) => u.email === trimmedEmail && u.password === trimmedPassword
    );

    console.log("Matching user:", user);

    if (!user) {
      alert("Invalid email or password.");
      return;
    }

    const simulatedApiResponse = {
      user: {
        id: "123",
        name: "Test User",
        email: trimmedEmail,
        role: user.role,
      },
      token: "fake-jwt-token",
    };

    login(simulatedApiResponse);

    if (user.role === "farmer") {
      navigate("/farmer/dashboard");
    } else {
      navigate("/buyer-dashboard");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-base-200 p-4">
      <Card className="w-full max-w-md p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <Link to="/" className="mb-6 inline-flex items-center gap-2">
            <div className="rounded-xl bg-primary p-2">
              <Sprout className="h-6 w-6 text-white" />
            </div>
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-2xl font-bold text-transparent">
              FarmLink
            </span>
          </Link>
          <h1 className="mb-2 text-3xl font-bold text-neutral">
            {t("login.title")}
          </h1>
          <p className="text-muted-foreground">{t("login.subtitle")}</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <Input
            id="email"
            name="email"
            type="email"
            label={t("login.emailLabel")}
            placeholder={t("login.emailPlaceholder")}
            icon={Mail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            id="password"
            name="password"
            type="password"
            label={t("login.passwordLabel")}
            placeholder={t("login.passwordPlaceholder")}
            icon={Lock}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="rounded border-border text-primary focus:ring-primary"
              />
              <span className="text-muted-foreground">
                {t("login.rememberMe")}
              </span>
            </label>
            <Link
              to="/forgot-password"
              className="font-medium text-primary hover:text-primary-dark"
            >
              {t("login.forgotPassword")}
            </Link>
          </div>

          <Button
            type="submit"
            btnClassName="group flex w-full h-12 items-center justify-center gap-2 rounded-xl text-base font-medium text-white shadow-lg transition-all bg-primary hover:bg-primary-dark"
          >
            {t("login.button")}
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-muted-foreground">
            {t("login.noAccount")}{" "}
            <Link
              to="/register"
              className="font-semibold text-primary hover:text-primary-dark"
            >
              {t("login.createAccount")}
            </Link>
          </p>
        </div>

        <div className="mt-8 border-t border-border pt-6">
          <p className="text-center text-sm text-muted-foreground">
            {t("login.termsAgree")}{" "}
            <Link to="/terms" className="text-primary hover:underline">
              {t("login.terms")}
            </Link>{" "}
            &{" "}
            <Link to="/privacy" className="text-primary hover:underline">
              {t("login.privacy")}
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}
