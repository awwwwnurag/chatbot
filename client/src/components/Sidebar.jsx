import React, { useState } from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import { avatarSVGs } from "../assets/avatars";
import moment from "moment";
import toast from "react-hot-toast";
import { Sun, Moon, Save } from "lucide-react";
import { motion } from "motion/react";

// Chat History Item Component
const ChatHistoryItem = ({ chat, navigate, setSelectedChat, setIsMenuOpen, deleteChat, assets }) => {
  return (
    <motion.div
      whileHover={{ 
        rotateX: -5,
        rotateY: 5,
        scale: 1.02,
        z: 20
      }}
      initial={{ perspective: 1000 }}
      onClick={() => {
        navigate("/");
        setSelectedChat(chat);
        setIsMenuOpen(false);
      }}
      className="p-3 px-4 cursor-target
      bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 border border-black/5 dark:border-white/10 
      rounded-lg cursor-pointer flex justify-between items-center group transition-all duration-200"
    >
      <div className="flex flex-col flex-1 min-w-0 pointer-events-none">
        <p className="truncate text-sm text-[var(--text-main)] font-medium">
          {chat.messages.length > 0
            ? chat.messages[0]?.content.slice(0, 28)
            : chat.name}
        </p>
        <p className="text-xs text-[var(--text-muted)]">
          {moment(chat.updatedAt).format('HH:mm')}
        </p>
      </div>

      <img
        src={assets.bin_icon}
        className="hidden group-hover:block w-4 cursor-pointer dark:invert flex-shrink-0 relative z-10"
        alt="delete"
        onClick={(e) =>
          toast.promise(deleteChat(e, chat._id), {
            loading: "Deleting...",
          })
        }
      />
    </motion.div>
  );
};

const Sidebar = ({ isMenuOpen, setIsMenuOpen }) => {
  const {
    chats,
    setSelectedChat,
    theme,
    setTheme,
    themeColor,
    setThemeColor,
    user,
    navigate,
    createNewChat,
    axios,
    setChats,
    fetchUsersChats,
    setToken,
    token,
    userAvatarId
  } = useAppContext();

  const [search, setSearch] = useState("");
  const selectedAvatar = avatarSVGs.find(a => a.id === userAvatarId) || avatarSVGs[0];

  // GROUP CHATS BY DATE
  const groupChatsByDate = (chatsArray) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const groups = {
      today: [],
      yesterday: [],
      week: [],
      month: [],
      older: []
    };

    chatsArray.forEach(chat => {
      const chatDate = new Date(chat.updatedAt);
      const chatDateNormalized = new Date(chatDate.getFullYear(), chatDate.getMonth(), chatDate.getDate());

      if (chatDateNormalized.getTime() === today.getTime()) {
        groups.today.push(chat);
      } else if (chatDateNormalized.getTime() === yesterday.getTime()) {
        groups.yesterday.push(chat);
      } else if (chatDateNormalized > sevenDaysAgo) {
        groups.week.push(chat);
      } else if (chatDateNormalized > thirtyDaysAgo) {
        groups.month.push(chat);
      } else {
        groups.older.push(chat);
      }
    });

    return groups;
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    toast.success("Logged out successfully!");
  };

  // DELETE CHAT
  const deleteChat = async (e, chatId) => {
    try {
      e.stopPropagation();

      const confirmDelete = window.confirm(
        "Are you sure you want to delete this chat?"
      );
      if (!confirmDelete) return;

      const { data } = await axios.post(
        "/api/chat/delete",
        { chatId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        setChats((prev) => prev.filter((chat) => chat._id !== chatId));
        await fetchUsersChats();
        toast.success(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div
      className={`flex flex-col h-screen min-w-[340px] p-6
      liquid-glass bg-white/90 dark:bg-slate-900/40 border-r border-gray-200 dark:border-white/10 transition-all duration-500 
      max-md:absolute left-0 z-20 
      ${!isMenuOpen && "max-md:-translate-x-full"}`}
    >
      {/* Logo Removed */}

      {/* Create New Chat */}
      <motion.button
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={createNewChat}
        className="mt-6 flex items-center justify-center gap-2 text-sm font-medium px-4 py-3 cursor-target
        bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 border border-black/10 dark:border-white/10 
        rounded-xl transition-all duration-300 shadow-sm hover:shadow-md text-[var(--text-main)] w-full"
      >
        <span className="text-xl leading-none">+</span> New Chat
      </motion.button>

      {/* Search */}
      <div className="flex items-center gap-2 p-3 mt-4 border border-black/10 dark:border-white/20 rounded-md cursor-target">
        <img src={assets.search_icon} className="w-4 dark:invert opacity-60" alt="search" />
        <input
          type="text"
          placeholder="Search conversations..."
          className="bg-transparent outline-none w-full text-sm text-[var(--text-main)] placeholder:text-[var(--text-muted)]"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Chat History */}
      <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
        Chat History
      </p>

      <div className="flex flex-col gap-3 mt-3 overflow-y-auto flex-1 pr-2 min-h-0">
        {chats.length === 0 ? (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">No chats yet. Create one to get started!</p>
        ) : (
          <>
            {(() => {
              const groups = groupChatsByDate(
                chats.filter((chat) =>
                  chat.messages.length > 0
                    ? chat.messages[0]?.content
                      .toLowerCase()
                      .includes(search.toLowerCase())
                    : chat.name.toLowerCase().includes(search.toLowerCase())
                )
              );

              return (
                <>
                  {/* TODAY */}
                  {groups.today.length > 0 && (
                    <div>
                      <p className="text-xs font-bold text-[var(--text-muted)] mb-2 px-1">Today</p>
                      <div className="flex flex-col gap-1">
                        {groups.today.map((chat) => (
                          <ChatHistoryItem
                            key={chat._id}
                            chat={chat}
                            navigate={navigate}
                            setSelectedChat={setSelectedChat}
                            setIsMenuOpen={setIsMenuOpen}
                            deleteChat={deleteChat}
                            assets={assets}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* YESTERDAY */}
                  {groups.yesterday.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-[var(--text-muted)] mb-2 px-1 mt-3">Yesterday</p>
                      <div className="flex flex-col gap-1">
                        {groups.yesterday.map((chat) => (
                          <ChatHistoryItem
                            key={chat._id}
                            chat={chat}
                            navigate={navigate}
                            setSelectedChat={setSelectedChat}
                            setIsMenuOpen={setIsMenuOpen}
                            deleteChat={deleteChat}
                            assets={assets}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* LAST 7 DAYS */}
                  {groups.week.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-[var(--text-muted)] mb-2 px-1 mt-3">Last 7 Days</p>
                      <div className="flex flex-col gap-1">
                        {groups.week.map((chat) => (
                          <ChatHistoryItem
                            key={chat._id}
                            chat={chat}
                            navigate={navigate}
                            setSelectedChat={setSelectedChat}
                            setIsMenuOpen={setIsMenuOpen}
                            deleteChat={deleteChat}
                            assets={assets}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* LAST 30 DAYS */}
                  {groups.month.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-[var(--text-muted)] mb-2 px-1 mt-3">Last 30 Days</p>
                      <div className="flex flex-col gap-1">
                        {groups.month.map((chat) => (
                          <ChatHistoryItem
                            key={chat._id}
                            chat={chat}
                            navigate={navigate}
                            setSelectedChat={setSelectedChat}
                            setIsMenuOpen={setIsMenuOpen}
                            deleteChat={deleteChat}
                            assets={assets}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* OLDER */}
                  {groups.older.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-[var(--text-muted)] mb-2 px-1 mt-3">Older</p>
                      <div className="flex flex-col gap-1">
                        {groups.older.map((chat) => (
                          <ChatHistoryItem
                            key={chat._id}
                            chat={chat}
                            navigate={navigate}
                            setSelectedChat={setSelectedChat}
                            setIsMenuOpen={setIsMenuOpen}
                            deleteChat={deleteChat}
                            assets={assets}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </>
              );
            })()}
          </>
        )}
      </div>

      {/* Navigation Groups */}
      <div className="mt-auto space-y-1 pt-4">
        <motion.div
          whileHover={{ scale: 1.02, x: 4 }}
          onClick={() => {
            navigate("/community");
            setIsMenuOpen(false);
          }}
          className="flex items-center gap-3 p-2.5 rounded-xl cursor-pointer hover:bg-slate-100 dark:hover:bg-white/5 transition-all group cursor-target"
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
             <img src={assets.gallery_icon} className="w-4 dark:invert" alt="" />
          </div>
          <p className="text-sm font-medium text-[var(--text-main)]">Community</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02, x: 4 }}
          onClick={() => {
            navigate("/credits");
            setIsMenuOpen(false);
          }}
          className="flex items-center gap-3 p-2.5 rounded-xl cursor-pointer hover:bg-slate-100 dark:hover:bg-white/5 transition-all group cursor-target"
        >
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <img src={assets.diamond_icon} className="w-4 dark:invert" alt="" />
          </div>
          <div className="flex flex-col">
            <p className="text-sm font-medium text-[var(--text-main)]">Credits: {user?.credits}</p>
            <p className="text-[10px] text-[var(--text-muted)] font-medium">Upgrade Plan</p>
          </div>
        </motion.div>

        {/* Theme & Style Personalization */}
        <div className="p-3 rounded-xl bg-slate-100/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 mt-1.5 cursor-target">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-3">
            Accent Color
          </p>
          
          <div className="flex items-center gap-2">
            {[
              { id: 'violet', color: 'bg-violet-500' },
              { id: 'emerald', color: 'bg-emerald-500' },
              { id: 'ocean', color: 'bg-sky-500' },
              { id: 'rose', color: 'bg-rose-500' },
              { id: 'amber', color: 'bg-amber-500' }
            ].map((c) => (
              <button
                key={c.id}
                onClick={() => setThemeColor(c.id)}
                className={`w-5 h-5 rounded-full ${c.color} transition-all duration-300 ${
                  themeColor === c.id 
                  ? 'ring-2 ring-offset-2 ring-slate-400 dark:ring-slate-500 scale-125 shadow-sm' 
                  : 'opacity-40 hover:opacity-100 scale-100'
                }`}
                title={c.id.charAt(0).toUpperCase() + c.id.slice(1)}
              />
            ))}
          </div>
        </div>

        {/* Light/Dark Mode Section */}
        <div className="p-3 rounded-xl bg-slate-100/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 mt-1.5 cursor-target">
           <div className="flex items-center justify-between">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)]">
                Light / Dark Mode
              </p>
              
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="relative w-12 h-6 rounded-full transition-all duration-500 p-1 flex items-center bg-slate-200 dark:bg-slate-700 overflow-hidden"
              >
                {/* Sliding Knob */}
                <div 
                  className={`relative z-10 w-4 h-4 rounded-full shadow-md transform transition-transform duration-500 flex items-center justify-center ${
                    theme === 'dark' ? 'translate-x-6 bg-slate-900' : 'translate-x-0 bg-white'
                  }`}
                >
                  {theme === 'dark' 
                    ? <Moon className="w-2.5 h-2.5 text-blue-400" /> 
                    : <Sun className="w-2.5 h-2.5 text-amber-500" />
                  }
                </div>
                
                {/* Background Indicators */}
                <div className="absolute inset-0 flex items-center justify-between px-2 opacity-50">
                  <Sun className="w-2.5 h-2.5 text-slate-400" />
                  <Moon className="w-2.5 h-2.5 text-slate-400" />
                </div>
              </button>
           </div>
        </div>

        {/* User / Profile */}
        <motion.div
          whileHover={{ scale: 1.02, y: -4, rotateX: -2 }}
          initial={{ perspective: 1000 }}
          onClick={() => { navigate("/profile"); setIsMenuOpen(false); }}
          className="flex items-center gap-3 p-2.5 mt-3 rounded-xl cursor-pointer bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:shadow-lg hover:shadow-indigo-500/5 transition-all group cursor-target"
        >
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="relative h-10 w-10 border-none flex-shrink-0 ring-2 ring-[var(--color-primary-glow)] bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden rounded-full"
          >
             <img src={selectedAvatar.url} className="w-full h-full object-cover scale-[1.1] transform" alt="" />
          </motion.div>
         <p className="flex-1 text-sm text-[var(--text-main)] font-bold truncate">
            {user ? user.name : "Sign In"}
          </p>
          {user && (
            <img
              onClick={(e) => { e.stopPropagation(); logout(); }}
              src={assets.logout_icon}
              className="h-4 p-0.5 opacity-40 hover:opacity-100 hover:text-red-500 cursor-pointer dark:invert transition-all"
              alt="logout"
            />
          )}
        </motion.div>
      </div>

      {/* Close Icon */}
      <img
        onClick={() => setIsMenuOpen(false)}
        src={assets.close_icon}
        className="absolute top-4 right-4 w-6 dark:invert md:hidden cursor-pointer"
        alt="close sidebar"
      />
    </div>
  );
};

export default Sidebar;
