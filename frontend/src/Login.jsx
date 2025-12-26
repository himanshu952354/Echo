import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Eye, EyeOff, Loader2, ArrowLeft, Mail, Lock, User,
  Sparkles, CheckCircle, X, ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Galaxy from "./components/Galaxy";

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
    <div className="min-h-screen w-full relative bg-[#0a0a0a] flex items-center justify-center font-sans pb-40 overflow-y-auto">

      {/* === GALAXY BACKGROUND === */}
      <Galaxy />

      {/* === MAIN CARD CONTAINER === */}
      <div className="relative z-10 w-full max-w-[1000px] h-full md:h-[600px] grid grid-cols-1 md:grid-cols-2 bg-black/5 backdrop-blur-sm border border-white/5 rounded-3xl overflow-hidden shadow-2xl shadow-purple-900/10 m-4">

        {/* --- LEFT PANEL (Visuals) --- */}
        <div className="hidden md:flex flex-col justify-between p-12 bg-gradient-to-br from-white/5 to-transparent relative overflow-hidden group">
          {/* Background Grid Pattern */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]" />

          <div className="relative z-10">
            <button
              onClick={() => setActivePage("landing")}
              className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors duration-300"
            >
              <ArrowLeft size={16} /> Back
            </button>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-16"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center mb-6 shadow-lg shadow-purple-500/30">
                <Sparkles className="text-white" size={24} />
              </div>
              <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
                Unlock the Power <br /> of <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">Analysis.</span>
              </h1>
              <p className="text-white/50 text-base leading-relaxed max-w-sm">
                Experience the next generation of sentiment tracking. Real-time insights, beautifully visualized.
              </p>
            </motion.div>
          </div>

          {/* Abstract Interactive Element */}
          <div className="relative z-10">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle size={20} className="text-green-400" />
              </div>
              <div>
                <p className="text-white text-sm font-medium">System Operational</p>
                <p className="text-white/40 text-xs">Analysis Engine Ready</p>
              </div>
            </div>
          </div>
        </div>

        {/* --- RIGHT PANEL (Form) --- */}
        <div className="flex flex-col justify-center p-8 md:p-12 bg-transparent">
          <motion.div
            key={isLogin ? 'login' : 'signup'}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-sm mx-auto"
          >
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">
                {isLogin ? "Welcome Back" : "Join the Future"}
              </h2>
              <p className="text-white/50 text-sm">
                {isLogin
                  ? "Enter your credentials to continue"
                  : "Create your account to get started"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

              <AnimatePresence>
                {apiError && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-2"
                  >
                    <X size={14} /> {apiError}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-4">
                {!isLogin && (
                  <div className="group relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User size={18} className="text-white/30 group-focus-within:text-purple-400 transition-colors" />
                    </div>
                    <input
                      name="username"
                      onChange={handleChange}
                      placeholder="Username"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all text-sm"
                    />
                  </div>
                )}

                <div className="group relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail size={18} className="text-white/30 group-focus-within:text-purple-400 transition-colors" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email Address"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all text-sm"
                  />
                </div>

                <div className="group relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock size={18} className="text-white/30 group-focus-within:text-purple-400 transition-colors" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    onChange={handleChange}
                    placeholder="Password"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-11 pr-12 text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/30 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {isLogin && (
                <div className="flex items-center justify-between text-xs">
                  <label className="flex items-center text-white/60 cursor-pointer hover:text-white transition-colors">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={() => setRememberMe(!rememberMe)}
                      className="rounded bg-white/10 border-white/20 text-purple-500 focus:ring-0 focus:ring-offset-0 !mr-2.5"
                    />
                    Remember me
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgot(true)}
                    className="text-purple-400 hover:text-purple-300 font-medium"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white !rounded-lg py-3.5 font-semibold text-sm shadow-lg shadow-purple-900/40 hover:shadow-purple-700/60 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : (
                  <>
                    {isLogin ? "Sign In" : "Create Account"}
                    <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-white/40 text-sm">
                {isLogin ? "Don't have an account? " : "Already have an account?"}
                <button
                  onClick={() => { setIsLogin(!isLogin); setApiError(""); }}
                  className="text-white font-medium hover:text-purple-400 transition-colors ml-2"
                >
                  {isLogin ? "Sign up" : "Log in"}
                </button>
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <AnimatePresence>
        {showForgot && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowForgot(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              onClick={e => e.stopPropagation()}
              className="bg-[#0f0f0f] border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-indigo-500" />

              <h3 className="text-xl font-bold text-white mb-2">Reset Password</h3>
              <p className="text-sm text-white/50 mb-6">
                Enter your email to receive reset instructions.
              </p>

              <div className="space-y-4">
                <input
                  type="email"
                  value={formData.email}
                  readOnly
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white/40 cursor-not-allowed text-sm"
                />

                <button
                  onClick={handleForgotPassword}
                  className="w-full py-3 bg-white text-black font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Send Reset Link
                </button>
              </div>

              {forgotStatus && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm flex items-center gap-2"
                >
                  <CheckCircle size={14} />
                  {forgotStatus}
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Login;
