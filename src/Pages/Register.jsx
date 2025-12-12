import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../Context/AuthContext";
import {
  Sprout,
  Mail,
  Lock,
  User,
  Phone,
  MapPin,
  ArrowRight,
  Tractor,
  ShoppingCart,
  Loader2,
  Wallet,
  FileText,
  Upload,
} from "lucide-react";
import Button from "../Components/Button/index.jsx";
import Card from "../Components/Card/index.jsx";
import Input from "../Components/Input/index.jsx";
import { registerUser } from "../Services/api.js";

export default function RegisterPage() {
  const { t } = useTranslation("auth");
  const { login } = useAuth();
  const navigate = useNavigate();

  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    password: "",
    confirmPassword: "",
    walletAddress: "",
    idNumber: "",
  });

  const [idCardFile, setIdCardFile] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setIdCardFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      alert(t("register.passwordMismatch"));
      setLoading(false);
      return;
    }

    try {
      const data = new FormData();
      data.append("firstName", formData.firstName);
      data.append("lastName", formData.lastName);
      data.append("email", formData.email);
      data.append("phone", formData.phone);
      data.append("location", formData.location);
      data.append("password", formData.password);
      data.append("role", userType);
      data.append("walletAddress", formData.walletAddress);

      if (userType === "farmer") {
        data.append("idNumber", formData.idNumber);
        if (idCardFile) {
          data.append("idCard", idCardFile);
        }
      }

      const registeredUser = await registerUser(data);

      login(registeredUser);

      if (userType === "farmer") {
        navigate("/farmer-dashboard");
      } else {
        navigate("/browse");
      }
    } catch (error) {
      console.log("Registration failed:", error);
      alert("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!userType) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-base-200 p-4 py-12">
        <Card className="w-full max-w-2xl p-8 shadow-2xl bg-white">
          <div className="mb-8 text-center">
            <Link to="/" className="mb-6 inline-flex items-center gap-2">
              <div className="rounded-xl bg-primary p-2">
                <Sprout className="h-6 w-6 text-white" />
              </div>
              <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-2xl font-bold text-transparent">
                FarmLink
              </span>
            </Link>
            <h1 className="mb-2 text-3xl font-bold text-neutral">
              {t("register.title")}
            </h1>
            <p className="text-muted-foreground">{t("register.subtitle")}</p>
          </div>

          <div className="space-y-4">
            <p className="mb-6 text-center font-medium text-neutral">
              {t("register.rolePrompt")}
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <button
                onClick={() => setUserType("farmer")}
                className="group rounded-xl border-2 border-border p-6 text-left transition-all hover:border-primary hover:bg-muted"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary">
                  <Tractor className="h-6 w-6 text-primary transition-colors group-hover:text-white" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-neutral">
                  {t("register.farmer")}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t("register.farmerDesc")}
                </p>
              </button>

              <button
                onClick={() => setUserType("buyer")}
                className="group rounded-xl border-2 border-border p-6 text-left transition-all hover:border-secondary hover:bg-muted"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10 transition-colors group-hover:bg-secondary">
                  <ShoppingCart className="h-6 w-6 text-secondary transition-colors group-hover:text-white" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-neutral">
                  {t("register.buyer")}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t("register.buyerDesc")}
                </p>
              </button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-base-200 p-4 py-12">
      <Card className="w-full max-w-2xl p-8 shadow-2xl bg-white">
        <div className="mb-8 text-center">
          <Link to="/" className="mb-6 inline-flex items-center gap-2">
            <div className="rounded-xl bg-primary p-2">
              <Sprout className="h-6 w-6 text-white" />
            </div>
            <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-2xl font-bold text-transparent">
              FarmLink
            </span>
          </Link>
          <h1 className="mb-2 text-3xl font-bold text-neutral">
            {t("register.title")}
          </h1>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Role Indicator */}
          <div className="rounded-xl border border-border bg-muted p-4">
            <p className="text-sm text-neutral">
              {t("register.registeringAs")}{" "}
              <span className="font-bold capitalize text-primary">
                {userType}
              </span>
              <button
                type="button"
                onClick={() => setUserType(null)}
                className="ml-2 text-xs text-primary underline hover:text-primary-dark"
              >
                {t("register.changeRole")}
              </button>
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Input
              id="firstName"
              name="firstName"
              label={t("register.firstNameLabel")}
              placeholder="John"
              icon={User}
              onChange={handleChange}
              value={formData.firstName}
              required
            />
            <Input
              id="lastName"
              name="lastName"
              label={t("register.lastNameLabel")}
              placeholder="Doe"
              icon={User}
              onChange={handleChange}
              value={formData.lastName}
              required
            />
          </div>

          <Input
            id="email"
            name="email"
            type="email"
            label={t("register.emailLabel")}
            placeholder="john@example.com"
            icon={Mail}
            onChange={handleChange}
            value={formData.email}
            required
          />

          <div className="grid gap-4 md:grid-cols-2">
            <Input
              id="phone"
              name="phone"
              type="tel"
              label={t("register.phoneLabel")}
              placeholder="+234..."
              icon={Phone}
              onChange={handleChange}
              value={formData.phone}
            />
            <Input
              id="location"
              name="location"
              label={t("register.locationLabel")}
              placeholder="Lagos, Nigeria"
              icon={MapPin}
              onChange={handleChange}
              value={formData.location}
            />
          </div>

          <Input
            id="walletAddress"
            name="walletAddress"
            label="Crypto Wallet Address (Optional)"
            placeholder="0x..."
            icon={Wallet}
            onChange={handleChange}
            value={formData.walletAddress}
          />

          {userType === "farmer" && (
            <div className="p-4 bg-green-50 rounded-lg border border-green-100 space-y-4">
              <Input
                id="idNumber"
                name="idNumber"
                label="National ID Number (NIN)"
                placeholder="Enter your ID Number"
                icon={FileText}
                onChange={handleChange}
                value={formData.idNumber}
                required
              />
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Upload Valid ID Card
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-100 file:text-green-700 hover:file:bg-green-200"
                  />
                  <Upload className="absolute right-3 top-2 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <Input
              id="password"
              name="password"
              type="password"
              label={t("register.passwordLabel")}
              placeholder="••••••••"
              icon={Lock}
              onChange={handleChange}
              value={formData.password}
              required
            />
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              label={t("register.confirmPasswordLabel")}
              placeholder="••••••••"
              icon={Lock}
              onChange={handleChange}
              value={formData.confirmPassword}
              required
            />
          </div>

          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="terms"
              className="mt-1 rounded border-border text-primary focus:ring-primary"
              required
            />
            <label htmlFor="terms" className="text-sm text-muted-foreground">
              {t("register.termsAgree")}{" "}
              <Link
                to="/terms"
                className="font-medium text-primary hover:underline"
              >
                {t("register.terms")}
              </Link>{" "}
              &{" "}
              <Link
                to="/privacy"
                className="font-medium text-primary hover:underline"
              >
                {t("register.privacy")}
              </Link>
            </label>
          </div>

          <Button
            type="submit"
            disabled={loading}
            btnClassName={`group flex w-full h-12 items-center justify-center gap-2 rounded-xl text-base font-medium text-white shadow-lg transition-all ${
              loading
                ? "bg-primary/70 cursor-not-allowed"
                : "bg-primary hover:bg-primary-dark hover:shadow-xl hover:-translate-y-0.5"
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Creating Account...
              </>
            ) : (
              <>
                {t("register.button")}
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-muted-foreground">
            {t("register.hasAccount")}{" "}
            <Link
              to="/login"
              className="font-semibold text-primary hover:text-primary-dark"
            >
              {t("register.signIn")}
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}
