import React, { useState, useEffect } from "react";
import axios from "axios";
import Lottie from "lottie-react";
import { Eye, EyeOff, Loader2, X } from "lucide-react";
import loginAnimation from "./assets/animations/login.json";

const Login = ({ onAuthSuccess, setActivePage }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [showForgot, setShowForgot] = useState(false);
  const [forgotStatus, setForgotStatus] = useState("");

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  /* Lock scroll */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "unset");
  }, []);

  /* Remember email */
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberEmail");
    if (savedEmail) {
      setFormData((p) => ({ ...p, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    setApiError("");
  };

  const validate = () => {
    if (!formData.email || !formData.password) {
      setApiError("Email and password are required");
      return false;
    }
    if (!isLogin && !formData.username) {
      setApiError("Username is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      const url = isLogin
        ? `${import.meta.env.VITE_API_URL}/login`
        : `${import.meta.env.VITE_API_URL}/signup`;

      const payload = isLogin
        ? { email: formData.email, password: formData.password }
        : formData;

      const res = await axios.post(url, payload);

      rememberMe
        ? localStorage.setItem("rememberEmail", formData.email)
        : localStorage.removeItem("rememberEmail");

      onAuthSuccess(res.data);
    } catch (err) {
      setApiError(err.response?.data?.msg || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      setForgotStatus("Please enter your email first.");
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/forgot-password`, {
        email: formData.email,
      });
      setForgotStatus("Password reset link sent to your email.");
    } catch {
      setForgotStatus("If this email exists, a reset link has been sent.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-6xl flex items-center justify-between">

        {/* LEFT SECTION */}
        <div className="hidden md:flex flex-col text-white max-w-md">
          <Lottie animationData={loginAnimation} loop className="w-[280px]" />
          <h2 className="text-4xl font-bold mt-6">Welcome to Echo</h2>
          <p className="text-sm opacity-90 mt-2">
            Smart sentiment analysis for helpdesk calls.
          </p>
          <button
            onClick={() => setActivePage("landing")}
            className="mt-3 text-sm opacity-80 hover:opacity-100"
          >
            ← Back to Home
          </button>
        </div>

        {/* FORM */}
        <div
          className="w-full max-w-md
          bg-violet-900/40 backdrop-blur-md
          border border-violet-300/20
          rounded-2xl shadow-2xl
          p-8 text-white"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="text-sm text-white/70 mt-2">
              {isLogin
                ? "Log in to access your dashboard"
                : "Get started with Echo Analytics"}
            </p>
          </div>

          {/* Error */}
          {apiError && (
            <div className="mb-6 text-sm text-red-300 bg-red-900/40 border border-red-400/30 px-3 py-2 rounded-lg">
              {apiError}
            </div>
          )}

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-1">
                <label className="text-xs text-white/70">Username</label>
                <input
                  name="username"
                  onChange={handleChange}
                  placeholder="Enter your username"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-violet-400"
                />
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs text-white/70">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-violet-400"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-white/70">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-violet-400 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-5 text-white/60"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {isLogin && (
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 text-sm text-white/70">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                    className="accent-violet-500"
                  />
                  Remember me
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgot(true)}
                  className="text-sm font-semibold text-violet-300 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mb-4 w-full mt-4 py-3 bg-gradient-to-r from-violet-500 to-purple-600 !rounded-full font-semibold hover:scale-105 transition flex justify-center gap-2"
            >
              {loading && <Loader2 className="animate-spin" />}
              {isLogin ? "Login" : "Create Account"}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-white/70 mt-6">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="font-semibold text-violet-300 hover:underline"
            >
              {isLogin ? "Sign up" : "Log in"}
            </button>
          </p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgot && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-violet-900/80 backdrop-blur-md rounded-xl p-6 w-80 text-white relative">
            <button
              onClick={() => {
                setShowForgot(false);
                setForgotStatus("");
              }}
              className="absolute top-3 right-3"
            >
              <X size={18} />
            </button>
            <h3 className="font-bold mb-2">Reset Password</h3>
            <p className="text-sm text-white/70 mb-4">
              We’ll send a reset link to your email.
            </p>
            <button
              onClick={handleForgotPassword}
              className="w-full py-2 bg-violet-600 rounded-lg"
            >
              Send Reset Link
            </button>
            {forgotStatus && (
              <p className="text-xs text-green-400 mt-3">{forgotStatus}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
