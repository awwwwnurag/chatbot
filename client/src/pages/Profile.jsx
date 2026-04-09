import React, { useState, useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check, User2, LogOut, Mail, Star, Calendar, Shield, Pencil, X, Save } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import ProfileDropdown from "../components/ProfileDropdown";
import { AVATAR_RGB, avatarSVGs } from "../assets/avatars";

const containerVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};

const thumbnailVariants = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.28, ease: "easeOut" } },
};

const sectionVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const Profile = () => {
  const { user, setUser, theme, navigate, token, axios, setToken, userAvatarId, setUserAvatarId } = useAppContext();
  const shouldReduceMotion = useReducedMotion();

  const currentAvatar = avatarSVGs.find((a) => a.id === userAvatarId) || avatarSVGs[0];

  const [selectedAvatar, setSelectedAvatar] = useState(currentAvatar);
  const [pendingAvatar, setPendingAvatar] = useState(currentAvatar);
  const [editingName, setEditingName] = useState(false);
  const [editingEmail, setEditingEmail] = useState(false);
  const [newName, setNewName] = useState(user?.name || "");
  const [newEmail, setNewEmail] = useState(user?.email || "");

  // Sync state if global avatar changes
  useEffect(() => {
    setSelectedAvatar(currentAvatar);
    setPendingAvatar(currentAvatar);
  }, [userAvatarId, currentAvatar]);

  const handleSaveAvatar = () => {
    setUserAvatarId(pendingAvatar.id);
    toast.success(`Avatar changed to ${pendingAvatar.alt}!`);
  };

  const handleSaveName = async () => {
    if (!newName.trim() || newName.trim().length < 2) {
      toast.error("Name must be at least 2 characters");
      return;
    }
    try {
      setUser((prev) => ({ ...prev, name: newName.trim() }));
      toast.success("Name updated!");
    } catch {
      toast.error("Failed to update name");
    }
    setEditingName(false);
  };

  const handleSaveEmail = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }
    try {
      setUser((prev) => ({ ...prev, email: newEmail.trim() }));
      toast.success("Email updated!");
    } catch {
      toast.error("Failed to update email");
    }
    setEditingEmail(false);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    toast.success("Logged out successfully!");
    navigate("/");
  };

  // Robust date formatting
  const memberSince = (user?.createdAt && !isNaN(new Date(user.createdAt).getTime()))
    ? new Date(user.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })
    : new Date().toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" });

  const avatarChanged = pendingAvatar.id !== selectedAvatar.id;

  return (
    <div className="h-full py-10 px-4 flex flex-col items-center gap-8 overflow-y-auto custom-scrollbar">
      {/* ── Page Title ── */}
      <motion.div
        variants={sectionVariants}
        initial="initial"
        animate="animate"
        className="w-full max-w-lg flex flex-col gap-4"
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold gradient-text mb-1">My Profile</h1>
            <p className="text-sm text-[var(--text-muted)] font-medium">
              Manage your identity &amp; avatar
            </p>
          </div>
          <ProfileDropdown data={user} onSignOut={logout} />
        </div>
      </motion.div>

      {/* ── USER INFO CARD ── */}
      <motion.div
        variants={sectionVariants}
        initial="initial"
        animate="animate"
        whileHover={{ rotateX: 2, rotateY: -2, scale: 1.01 }}
        transition={{ delay: 0.05 }}
        className="w-full max-w-lg glass-card rounded-2xl p-6 flex flex-col gap-5 cursor-target"
        style={{ perspective: 1000 }}
      >
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-lg font-semibold text-[var(--text-main)]">
            Account Info
          </h2>
          <span 
            className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{ backgroundColor: 'var(--color-primary-glow)', color: 'var(--color-primary)' }}
          >
            Active
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div 
            className="relative h-16 w-16 rounded-full overflow-hidden flex-shrink-0 ring-2 flex items-center justify-center bg-gray-100 dark:bg-gray-800"
            style={{ ringColor: 'var(--color-primary-glow)' }}
          >
              <img src={selectedAvatar.url} className="w-full h-full object-cover scale-[1.1] transform" alt="" />
          </div>

          <div className="flex-1 min-w-0">
            {editingName ? (
              <div className="flex items-center gap-2">
                <input
                  autoFocus
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
                  className="flex-1 text-lg font-medium bg-transparent border-b-2 border-purple-500 outline-none text-[var(--text-main)] pb-0.5"
                  maxLength={32}
                />
                <button
                  onClick={handleSaveName}
                  className="p-1 rounded-lg text-white hover:opacity-80 transition-opacity"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                >
                  <Save className="w-4 h-4" />
                </button>
                <button
                  onClick={() => { setEditingName(false); setNewName(user?.name || ""); }}
                  className="p-1 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 group">
                <span className="text-lg font-medium text-[var(--text-main)] truncate">
                  {user?.name || "User"}
                </span>
                <button
                  onClick={() => { setEditingName(true); setNewName(user?.name || ""); }}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                >
                  <Pencil className="w-3.5 h-3.5 text-gray-500" />
                </button>
              </div>
            )}
            <p className="text-sm text-[var(--text-muted)] mt-0.5">
              {selectedAvatar.alt} avatar
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Email Card */}
          <motion.div 
            whileHover={{ y: -2, scale: 1.02, backgroundColor: 'rgba(59, 130, 246, 0.08)' }}
            className="flex items-center gap-3 p-3 rounded-xl bg-black/5 dark:bg-white/5 transition-colors group cursor-target"
          >
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/40">
              <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-[var(--text-muted)] font-medium">Email</p>
              {editingEmail ? (
                <div className="flex items-center gap-1 mt-0.5">
                  <input
                    autoFocus
                    type="text"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSaveEmail()}
                    className="w-full text-xs font-medium bg-transparent border-b border-blue-500 outline-none text-[var(--text-main)] pb-0.5"
                  />
                  <button onClick={handleSaveEmail} className="text-blue-500 hover:scale-110"><Save className="w-3.5 h-3.5" /></button>
                  <button onClick={() => { setEditingEmail(false); setNewEmail(user?.email || ""); }} className="text-gray-400 hover:scale-110"><X className="w-3.5 h-3.5" /></button>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-1">
                  <p className="text-sm font-medium text-[var(--text-main)] truncate">
                    {user?.email || "—"}
                  </p>
                  <button 
                    onClick={() => { setEditingEmail(true); setNewEmail(user?.email || ""); }}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-black/5"
                  >
                    <Pencil className="w-3 h-3 text-gray-400" />
                  </button>
                </div>
              )}
            </div>
          </motion.div>

          {/* Credits Card */}
          <motion.div 
            whileHover={{ y: -2, scale: 1.02, backgroundColor: 'rgba(245, 158, 11, 0.08)' }}
            onClick={() => navigate('/credits')}
            className="flex items-center gap-3 p-3 rounded-xl bg-black/5 dark:bg-white/5 transition-colors cursor-pointer cursor-target"
          >
            <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/40">
              <Star className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-xs text-[var(--text-muted)] font-medium">Credits</p>
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-[var(--text-main)]">
                  {user?.credits ?? 0}
                </p>
                <span className="text-[10px] bg-amber-500/10 text-amber-600 px-1.5 py-0.5 rounded font-bold uppercase tracking-tighter">Buy</span>
              </div>
            </div>
          </motion.div>

          {/* Member Since Card */}
          <motion.div 
            whileHover={{ y: -2, scale: 1.02, backgroundColor: 'rgba(16, 185, 129, 0.08)' }}
            className="flex items-center gap-3 p-3 rounded-xl bg-black/5 dark:bg-white/5 transition-colors cursor-target"
          >
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/40">
              <Calendar className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-xs text-[var(--text-muted)] font-medium">Member Since</p>
              <p className="text-sm font-medium text-[var(--text-main)]">
                {memberSince}
              </p>
            </div>
          </motion.div>

          {/* Role Card */}
          <motion.div 
            whileHover={{ y: -2, scale: 1.02, backgroundColor: 'rgba(139, 92, 246, 0.08)' }}
            className="flex items-center gap-3 p-3 rounded-xl bg-black/5 dark:bg-white/5 transition-colors cursor-target"
          >
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/40">
              <Shield className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-xs text-[var(--text-muted)] font-medium">Role</p>
              <p className="text-sm font-medium text-[var(--text-main)] capitalize">
                {user?.role || "user"}
              </p>
            </div>
          </motion.div>
        </div>

        <button
          onClick={logout}
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-medium
          text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50
          hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </motion.div>

      {/* ── AVATAR PICKER CARD ── */}
      <motion.div
        variants={sectionVariants}
        initial="initial"
        animate="animate"
        whileHover={{ rotateX: -2, rotateY: 2, scale: 1.01 }}
        transition={{ delay: 0.12 }}
        className="w-full max-w-lg glass-card rounded-2xl p-6 flex flex-col gap-6 cursor-target"
        style={{ perspective: 1000 }}
      >
        <div>
          <h2 className="text-lg font-semibold text-[var(--text-main)]">
            Pick Your Avatar
          </h2>
          <p className="text-sm text-[var(--text-muted)] mt-0.5">
            Choose one that represents you
          </p>
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="relative h-36 w-36">
            <motion.div
              animate={{
                boxShadow: `0 0 0 4px rgba(${AVATAR_RGB[pendingAvatar.id]}, 0.2), 0 0 20px rgba(${AVATAR_RGB[pendingAvatar.id]}, 0.4)`,
                scale: [1, 1.05, 1],
              }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute inset-0 rounded-full"
            />
            <div className="relative h-full w-full overflow-hidden rounded-full border-2 border-white/10 shadow-2xl bg-white/5 dark:bg-black/20 p-2">
              <AnimatePresence mode="wait">
                <motion.div
                  key={pendingAvatar.id}
                  animate={{ opacity: 1, scale: 1, rotate: [5, -5, 0] }}
                  className="absolute inset-0 flex items-center justify-center"
                  exit={{ opacity: 0, scale: 0.9, rotate: -10 }}
                  initial={{ opacity: 0, scale: 0.9, rotate: 10 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <img src={pendingAvatar.url} className="w-full h-full object-contain p-2" alt="" />
                </motion.div>
 drum
              </AnimatePresence>
            </div>
          </div>

          <motion.div
            className="flex flex-wrap justify-center gap-4 mt-2"
          >
            {avatarSVGs.map((avatar) => {
              const isPending = pendingAvatar.id === avatar.id;
              const isSaved = selectedAvatar.id === avatar.id;
              return (
                <motion.button
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  key={avatar.id}
                  onClick={() => setPendingAvatar(avatar)}
                  className={[
                    "relative h-16 w-16 overflow-hidden rounded-2xl border-2 transition-all duration-300 cursor-target",
                    isPending
                      ? "border-purple-500 shadow-lg shadow-purple-500/20 scale-110"
                      : "border-gray-200 dark:border-white/10 opacity-60 hover:opacity-100",
                  ].join(" ")}
                >
                  <div className="flex items-center justify-center p-3 h-full w-full">
                    <img src={avatar.url} className="w-full h-full object-contain" alt="" />
                  </div>
                  {isSaved && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 shadow-sm"
                    >
                      <Check className="h-3.5 w-3.5 text-white" />
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </motion.div>
        </div>

        <motion.button
          whileHover={avatarChanged ? { scale: 1.02, y: -2 } : {}}
          whileTap={avatarChanged ? { scale: 0.98 } : {}}
          onClick={handleSaveAvatar}
          disabled={!avatarChanged}
          className={[
            "py-3.5 px-6 rounded-2xl text-sm font-bold tracking-tight transition-all duration-300 w-full cursor-target",
            avatarChanged
              ? "text-white shadow-xl shadow-purple-500/20"
              : "bg-gray-100 dark:bg-white/5 text-gray-400 cursor-not-allowed",
          ].join(" ")}
          style={{ 
            background: avatarChanged ? 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)' : undefined 
          }}
        >
          {avatarChanged ? `Confirm "${pendingAvatar.alt}" Selection` : "Current Avatar Active"}
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Profile;
