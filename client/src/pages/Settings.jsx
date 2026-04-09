import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings as SettingsIcon, Bell, Palette, Shield, Moon, X, Eye, EyeOff, AlertTriangle, Mail } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const { theme, setTheme, themeColor, setThemeColor, backendUrl, setToken, setUser, user } = useAppContext();
  const navigate = useNavigate();

  // Modal States
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);

  // Form States
  const [passwordForm, setPasswordForm] = useState({ current: "", new: "", confirm: "" });
  const [showPasswords, setShowPasswords] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePreferenceToggle = async (key) => {
    const newPrefs = { 
      ...user.preferences, 
      [key]: !user.preferences?.[key] 
    };
    
    // Optimistic update
    setUser(prev => ({ ...prev, preferences: newPrefs }));

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/update-preferences`,
        { preferences: newPrefs },
        { headers: { token: localStorage.getItem("token") } }
      );
      if (data.success) {
        toast.success("Preference updated");
      }
    } catch (error) {
      toast.error("Failed to sync preference");
      // Rollback
      setUser(prev => ({ ...prev, preferences: user.preferences }));
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordForm.new !== passwordForm.confirm) {
      return toast.error("New passwords do not match");
    }
    if (passwordForm.new.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    setIsSubmitting(true);
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/change-password`,
        { currentPassword: passwordForm.current, newPassword: passwordForm.new },
        { headers: { token: localStorage.getItem("token") } }
      );

      if (data.success) {
        toast.success(data.message);
        setShowPasswordModal(false);
        setPasswordForm({ current: "", new: "", confirm: "" });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeactivate = async () => {
    setIsSubmitting(true);
    try {
      const { data } = await axios.delete(`${backendUrl}/api/user/deactivate-account`, {
        headers: { token: localStorage.getItem("token") },
      });

      if (data.success) {
        toast.success("Account deactivated");
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
        navigate("/login");
      }
    } catch (error) {
      toast.error("Failed to deactivate account");
    } finally {
      setIsSubmitting(false);
    }
  };

  const settingsSections = [
    {
      title: "Appearance",
      icon: <Palette className="w-5 h-5 text-purple-500" />,
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[var(--text-main)]">Dark Mode</p>
              <p className="text-xs text-[var(--text-muted)]">Adjust the visual appearance of the app</p>
            </div>
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            >
              <Moon className={`w-5 h-5 ${theme === 'dark' ? 'text-purple-400' : 'text-gray-400'}`} />
            </button>
          </div>
          
          <div>
            <p className="text-sm font-medium text-[var(--text-main)] mb-3">Accent Color</p>
            <div className="flex gap-3">
              {['violet', 'emerald', 'ocean', 'rose', 'amber'].map((color) => (
                <button
                  key={color}
                  onClick={() => setThemeColor(color)}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    themeColor === color ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-60'
                  }`}
                  style={{ 
                    backgroundColor: 
                      color === 'violet' ? '#8b5cf6' : 
                      color === 'emerald' ? '#10b981' : 
                      color === 'ocean' ? '#3b82f6' : 
                      color === 'rose' ? '#f43f5e' : '#f59e0b' 
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Notifications",
      icon: <Bell className="w-5 h-5 text-blue-500" />,
      content: (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex gap-3">
               <div className="p-2 rounded-lg bg-blue-500/10">
                  <Mail className="w-4 h-4 text-blue-500" />
               </div>
               <div>
                  <p className="text-sm font-medium text-[var(--text-main)]">Email Alerts</p>
                  <p className="text-xs text-[var(--text-muted)]">Get security and billing alerts via email</p>
               </div>
            </div>
            <button 
              onClick={() => handlePreferenceToggle('emailNotifications')}
              className={`w-10 h-6 rounded-full relative transition-colors duration-300 pointer-events-auto cursor-pointer ${user?.preferences?.emailNotifications ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-700'}`}
            >
               <motion.div 
                  animate={{ x: user?.preferences?.emailNotifications ? 18 : 3 }}
                  className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md"
               />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex gap-3">
               <div className="p-2 rounded-lg bg-purple-500/10">
                  <Bell className="w-4 h-4 text-purple-500" />
               </div>
               <div>
                  <p className="text-sm font-medium text-[var(--text-main)]">Push Notifications</p>
                  <p className="text-xs text-[var(--text-muted)]">Receive desktop alerts for completions</p>
               </div>
            </div>
            <button 
              onClick={() => handlePreferenceToggle('pushNotifications')}
              className={`w-10 h-6 rounded-full relative transition-colors duration-300 pointer-events-auto cursor-pointer ${user?.preferences?.pushNotifications ? 'bg-purple-500' : 'bg-gray-300 dark:bg-gray-700'}`}
            >
               <motion.div 
                  animate={{ x: user?.preferences?.pushNotifications ? 18 : 3 }}
                  className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md"
               />
            </button>
          </div>
        </div>
      )
    },
    {
      title: "Privacy & Security",
      icon: <Shield className="w-5 h-5 text-emerald-500" />,
      content: (
        <div className="space-y-4">
          <button 
            onClick={() => setShowPasswordModal(true)}
            className="w-full text-left p-3 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 transition-colors cursor-target"
          >
            <p className="text-sm font-medium text-[var(--text-main)]">Change Password</p>
          </button>
          <button 
            onClick={() => setShowDeactivateModal(true)}
            className="w-full text-left p-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 transition-colors cursor-target"
          >
            <p className="text-sm font-medium text-red-500">Deactivate Account</p>
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="h-full overflow-y-auto custom-scrollbar p-6 md:p-12 relative">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto space-y-8 pb-12"
      >
        <div className="flex items-center gap-4 mb-2">
          <div className="p-3 rounded-2xl liquid-glass">
            <SettingsIcon className="w-8 h-8 text-[var(--color-primary)]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[var(--text-main)]">Settings</h1>
            <p className="text-[var(--text-muted)]">Manage your preferences and account settings</p>
          </div>
        </div>

        <div className="grid gap-6">
          {settingsSections.map((section, idx) => (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              key={section.title}
              className="p-6 rounded-3xl border border-white/10 liquid-glass group hover:shadow-2xl transition-all duration-500"
            >
              <div className="flex items-center gap-3 mb-6">
                {section.icon}
                <h2 className="text-xl font-semibold text-[var(--text-main)]">{section.title}</h2>
              </div>
              {section.content}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ── Modals ── */}
      <AnimatePresence>
        {showPasswordModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowPasswordModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md p-8 rounded-3xl border border-white/10 liquid-glass shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-[var(--text-main)] italic">Change Password</h3>
                <button onClick={() => setShowPasswordModal(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Current Password</label>
                  <div className="relative">
                    <input 
                      type={showPasswords ? "text" : "password"}
                      value={passwordForm.current}
                      onChange={e => setPasswordForm({...passwordForm, current: e.target.value})}
                      required
                      className="w-full p-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 outline-none text-[var(--text-main)]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">New Password</label>
                  <input 
                    type={showPasswords ? "text" : "password"}
                    value={passwordForm.new}
                    onChange={e => setPasswordForm({...passwordForm, new: e.target.value})}
                    required
                    className="w-full p-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 outline-none text-[var(--text-main)]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Confirm New Password</label>
                  <input 
                    type={showPasswords ? "text" : "password"}
                    value={passwordForm.confirm}
                    onChange={e => setPasswordForm({...passwordForm, confirm: e.target.value})}
                    required
                    className="w-full p-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 outline-none text-[var(--text-main)]"
                  />
                </div>

                <button 
                  type="button"
                  onClick={() => setShowPasswords(!showPasswords)}
                  className="flex items-center gap-2 text-xs text-purple-400 hover:text-purple-300 transition-colors"
                >
                  {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  {showPasswords ? "Hide" : "Show"} Passwords
                </button>

                <button 
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl bg-[var(--color-primary)] text-white font-bold shadow-lg shadow-purple-500/20 hover:opacity-90 transition-all disabled:opacity-50 mt-4"
                >
                  {isSubmitting ? "Updating..." : "Update Password"}
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {showDeactivateModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowDeactivateModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm p-8 rounded-3xl border border-red-500/20 bg-zinc-900/90 backdrop-blur-xl shadow-2xl text-center"
            >
              <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Deactivate Account</h3>
              <p className="text-[var(--text-muted)] text-sm mb-8 leading-relaxed">
                This action will permanently delete your profile, chat history, and credits. This cannot be undone.
              </p>

              <div className="flex flex-col gap-3">
                <button 
                  onClick={handleDeactivate}
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Processing..." : "Confirm Deactivation"}
                </button>
                <button 
                  onClick={() => setShowDeactivateModal(false)}
                  className="w-full py-3.5 rounded-xl bg-white/5 text-[var(--text-main)] font-semibold hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Settings;
