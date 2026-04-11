import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "motion/react";
import { Mail, Lock, User, Apple, Chrome, Twitter } from "lucide-react";
import { assets } from "../assets/assets";

const Login = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { navigate, setUser, axios, setToken } = useAppContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isFlipped && password !== confirmPassword) {
      return toast.error("Passwords do not match!");
    }

    const url = isFlipped ? "/api/user/register" : "/api/user/login";

    try {
      const { data } = await axios.post(url, { name, email, password });

      if (data.success) {
        setToken(data.token);
        localStorage.setItem("token", data.token);
        setUser(null);
        toast.success(isFlipped ? "Account Created!" : "Login Successful!");
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="h-full w-full flex items-center justify-center font-outfit relative">
      {/* Main Card */}
      <div className="perspective-1000 z-10">
        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
          className="relative w-[380px] sm:w-[420px] h-[640px] preserve-3d"
        >
          {/* Front Side - Login */}
          <div className="absolute inset-0 backface-hidden bg-white/10 dark:bg-black/40 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-white/10 p-8 flex flex-col items-center shadow-2xl">
            <div className="w-16 h-16 bg-white/5 dark:bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 mb-6 relative">
              <img src={assets.logo} alt="Logo" className="w-10 h-10 object-contain" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full blur-[2px]"></div>
            </div>

            <h2 className="text-gray-900 dark:text-white text-3xl font-semibold mb-2">Welcome Back</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-8">
              Don't have an account yet?{" "}
              <button onClick={flipCard} className="text-purple-600 dark:text-purple-400 font-medium hover:underline cursor-pointer">
                Sign up
              </button>
            </p>

            <form onSubmit={handleSubmit} className="w-full space-y-4">
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-purple-500 transition-colors" />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl py-3 pl-12 pr-4 text-gray-900 dark:text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                  required
                />
              </div>

              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-purple-500 transition-colors" />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl py-3 pl-12 pr-4 text-gray-900 dark:text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                  required
                />
              </div>

              <div className="flex justify-end">
                <button type="button" className="text-sm text-purple-600 dark:text-purple-400 hover:underline">
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 rounded-xl shadow-lg shadow-purple-500/20 transition-all active:scale-[0.98]"
              >
                Sign In
              </button>
            </form>

            <div className="w-full my-8 flex items-center gap-4">
              <div className="flex-1 h-[1px] bg-gray-200 dark:bg-white/10"></div>
              <span className="text-gray-500 text-xs font-medium uppercase tracking-wider">Or continue with</span>
              <div className="flex-1 h-[1px] bg-gray-200 dark:bg-white/10"></div>
            </div>

            <div className="flex gap-4 w-full">
              <button className="flex-1 flex items-center justify-center py-2.5 rounded-xl border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
                <Chrome className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <button className="flex-1 flex items-center justify-center py-2.5 rounded-xl border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
                <Apple className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <button className="flex-1 flex items-center justify-center py-2.5 rounded-xl border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
                <Twitter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>

          {/* Back Side - Register */}
          <div className="absolute inset-0 backface-hidden bg-white/10 dark:bg-black/40 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-white/10 p-8 flex flex-col items-center shadow-2xl rotate-y-180">
            <div className="w-16 h-16 bg-white/5 dark:bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 mb-6 relative">
              <img src={assets.logo} alt="Logo" className="w-10 h-10 object-contain" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-purple-500 rounded-full blur-[2px]"></div>
            </div>

            <h2 className="text-gray-900 dark:text-white text-3xl font-semibold mb-2">Create Account</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-8">
              Already have an account?{" "}
              <button onClick={flipCard} className="text-purple-600 dark:text-purple-400 font-medium hover:underline cursor-pointer">
                Sign in
              </button>
            </p>

            <form onSubmit={handleSubmit} className="w-full space-y-4">
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-purple-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl py-3 pl-12 pr-4 text-gray-900 dark:text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                  required
                />
              </div>

              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-purple-500 transition-colors" />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl py-3 pl-12 pr-4 text-gray-900 dark:text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                  required
                />
              </div>

              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-purple-500 transition-colors" />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl py-3 pl-12 pr-4 text-gray-900 dark:text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                  required
                />
              </div>

              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-purple-500 transition-colors" />
                <input
                  type="password"
                  placeholder="Re-enter Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl py-3 pl-12 pr-4 text-gray-900 dark:text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                  required={isFlipped}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 rounded-xl shadow-lg shadow-purple-500/20 transition-all active:scale-[0.98] mt-4"
              >
                Create Account
              </button>
            </form>

            <div className="w-full my-8 flex items-center gap-4">
              <div className="flex-1 h-[1px] bg-gray-200 dark:bg-white/10"></div>
              <span className="text-gray-500 text-xs font-medium uppercase tracking-wider">Or sign up with</span>
              <div className="flex-1 h-[1px] bg-gray-200 dark:bg-white/10"></div>
            </div>

            <div className="flex gap-4 w-full">
              <button className="flex-1 flex items-center justify-center py-2.5 rounded-xl border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
                <Chrome className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <button className="flex-1 flex items-center justify-center py-2.5 rounded-xl border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
                <Apple className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <button className="flex-1 flex items-center justify-center py-2.5 rounded-xl border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
                <Twitter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
