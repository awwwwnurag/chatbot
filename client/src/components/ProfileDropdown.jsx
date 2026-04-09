import React, { useEffect, useRef, useState } from "react";
import { Settings, CreditCard, FileText, LogOut, User, Cpu } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { avatarSVGs } from "../assets/avatars";
import { useNavigate } from "react-router-dom";

const SAMPLE_PROFILE_DATA = {
  name: "Eugene An",
  email: "eugene@kokonutui.com",
  avatar: "https://ferf1mheo22r9ira.public.blob.vercel-storage.com/profile-mjss82WnWBRO86MHHGxvJ2TVZuyrDv.jpeg",
  subscription: "PRO",
  model: "Gemini 2.0 Flash",
};

const ProfileDropdown = ({ data, onSignOut, className = "" }) => {
  const { userAvatarId } = useAppContext();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const selectedAvatar = avatarSVGs.find(a => a.id === userAvatarId) || avatarSVGs[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuItems = [
    {
      label: "Profile",
      href: "/profile",
      icon: <User className="w-4 h-4" />,
    },
    {
      label: "Model",
      value: data.model,
      href: "/models",
      icon: <Cpu className="w-4 h-4" />,
    },
    {
      label: "Subscription",
      value: data.subscription,
      href: "/credits",
      icon: <CreditCard className="w-4 h-4" />,
    },
    {
      label: "Settings",
      href: "/settings",
      icon: <Settings className="w-4 h-4" />,
    },
    {
      label: "Terms & Policies",
      href: "/terms",
      icon: <FileText className="w-4 h-4" />,
    },
  ];

  return (
    <div ref={menuRef} className={`relative inline-flex ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="flex items-center gap-3 p-3 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 hover:shadow-sm transition-all duration-200 focus:outline-none"
      >
        <div className="text-left flex-1">
          <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100 tracking-tight leading-tight">
            {data.name}
          </div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400 tracking-tight leading-tight">
            {data.email}
          </div>
        </div>
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 p-0.5">
            <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-zinc-900 flex items-center justify-center">
               <img src={selectedAvatar.url} className="w-full h-full object-cover scale-[1.1] transform" alt="" />
            </div>
          </div>
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 z-20 mt-3 w-72 rounded-2xl p-2 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-sm border border-zinc-200/60 dark:border-zinc-800/60 shadow-xl shadow-zinc-900/5 dark:shadow-zinc-950/20">
          <div className="space-y-1">
            {menuItems.map((item) => (
              <div
                key={item.label}
                onClick={() => {
                   setIsOpen(false);
                   navigate(item.href);
                }}
                className="flex items-center p-3 hover:bg-zinc-100/80 dark:hover:bg-zinc-800/60 rounded-xl transition-all duration-200 cursor-pointer group hover:shadow-sm border border-transparent hover:border-zinc-200/50 dark:hover:border-zinc-700/50"
              >
                <div className="flex items-center gap-2 flex-1 text-zinc-900 dark:text-zinc-100">
                  {item.icon}
                  <span className="text-sm font-medium tracking-tight leading-tight whitespace-nowrap group-hover:text-zinc-950 dark:group-hover:text-zinc-50 transition-colors">
                    {item.label}
                  </span>
                </div>
                {item.value && (
                  <span
                    className={`text-xs font-medium rounded-md py-1 px-2 tracking-tight ${
                      item.label === "Model"
                        ? "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-500/10 border border-blue-500/10"
                        : "text-purple-600 bg-purple-50 dark:text-purple-400 dark:bg-purple-500/10 border border-purple-500/10"
                    }`}
                  >
                    {item.value}
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="mt-2 border-t border-zinc-100 dark:border-zinc-800/60 pt-2">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onSignOut?.();
              }}
              className="w-full flex items-center gap-3 p-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-transparent hover:border-red-500/30 transition-all duration-200 text-sm font-medium text-red-500 group hover:shadow-sm"
            >
              <LogOut className="w-4 h-4 text-red-500 group-hover:text-red-600" />
              <span className="text-red-500 group-hover:text-red-600">Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
