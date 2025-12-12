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

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    // 1. Use Supabase to sign in
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    });

    if (error) throw error;

    console.log('✅ Supabase login successful:', data.user.email);

    // 2. Get user profile from your users table
    let userProfile = null;
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();
      
      if (profileError) {
        console.warn('⚠️ Profile fetch error:', profileError);
        // Create profile if it doesn't exist
        const { data: newProfile } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            email: data.user.email,
            first_name: data.user.user_metadata?.first_name || '',
            last_name: data.user.user_metadata?.last_name || '',
            role: data.user.user_metadata?.role || 'buyer'
          })
          .select()
          .single();
        
        userProfile = newProfile;
      } else {
        userProfile = profileData;
      }
    } catch (profileErr) {
      console.error('Profile handling error:', profileErr);
      // Create basic profile from session
      userProfile = {
        id: data.user.id,
        email: data.user.email,
        first_name: data.user.user_metadata?.first_name || '',
        last_name: data.user.user_metadata?.last_name || '',
        role: data.user.user_metadata?.role || 'buyer'
      };
    }

    console.log('📋 User profile retrieved:', userProfile);

    // 3. ✅ CRITICAL: Call your AuthContext login function
    login({
      user: data.user,          // Supabase auth user
      profile: userProfile,     // Your custom profile
      session: data.session     // Supabase session
    });

    console.log('🎯 AuthContext login called successfully');

    // 4. Redirect to dashboard
    setTimeout(() => {
      // Navigate based on role if you want
      const role = userProfile?.role || data.user.user_metadata?.role;
      if (role === 'farmer') {
        navigate('/farmer/dashboard');
      } else {
        navigate('/buyer-dashboard');
      }
    }, 500);

  } catch (err) {
    console.error('❌ Login error:', err);
    alert('Login failed: ' + err.message);
  } finally {
    setEmail('');
    setPassword('');
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

