import { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import toast from "react-hot-toast";

const rawBaseURL = import.meta.env.VITE_SERVER_URL || "";
axios.defaults.baseURL = rawBaseURL.endsWith('/') ? rawBaseURL.slice(0, -1) : rawBaseURL;

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {

    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [token, setToken] = useState(() => {
        try {
            const stored = localStorage.getItem("token");
            return (stored && stored !== "undefined") ? stored : null;
        } catch (e) {
            return null;
        }
    });
    const [theme, setTheme] = useState(() => {
        try {
            const stored = localStorage.getItem("theme");
            return (stored === "dark" || stored === "light") ? stored : "light";
        } catch (e) {
            return "light";
        }
    });
    const [themeColor, setThemeColor] = useState(() => {
        try {
            const stored = localStorage.getItem("themeColor");
            // violet (default), emerald, ocean, rose, amber
            return stored || "violet";
        } catch (e) {
            return "violet";
        }
    });
    const [mood, setMood] = useState("neutral"); // neutral, energetic, calm
     const [loadingUser, setLoadingUser] = useState(true);
     const [userAvatarId, setUserAvatarId] = useState(() => {
        try {
            return parseInt(localStorage.getItem("userAvatarId") || "1", 10);
        } catch (e) {
            return 1;
        }
     });

    const saveChatsToLocalStorage = (chatArray) => {
        try {
            localStorage.setItem("savedChats", JSON.stringify(chatArray));
        } catch (e) {
            console.warn("Unable to save chats locally", e);
        }
    };

    // FETCH USER
    const fetchUser = async () => {
        try {
            const { data } = await axios.get(
                "/api/user/data",
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (data.success) {
                setUser(data.user);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoadingUser(false);
        }
    };

    // CREATE NEW CHAT
    const createNewChat = async () => {
        try {
            if (!user) return toast("Login to create a new chat");

            navigate("/");

            const { data } = await axios.get("/api/chat/create", {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (data.success) {
                await fetchUsersChats();
                setSelectedChat(data.chat); // Select the newly created chat
                toast.success("New chat started");
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    // FETCH USER CHATS
    const fetchUsersChats = async () => {
        try {
            const { data } = await axios.get("/api/chat/get", {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (data.success) {
                setChats(data.chats);
                saveChatsToLocalStorage(data.chats);

                if (data.chats.length > 0) {
                    // Only auto-select if no chat is currently selected
                    setSelectedChat(prev => prev || data.chats[0]);
                } else {
                    setSelectedChat(null);
                }
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
            const saved = localStorage.getItem("savedChats");
            if (saved) {
                const parsed = JSON.parse(saved);
                setChats(parsed);
                if (parsed.length > 0) {
                    setSelectedChat(prev => prev || parsed[0]);
                }
            }
        }
    };

    // THEME HANDLER
    useEffect(() => {
        const root = document.documentElement;
        if (theme === "dark") {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }
        localStorage.setItem("theme", theme);
    }, [theme]);

    useEffect(() => {
        document.documentElement.setAttribute("data-color", themeColor);
        localStorage.setItem("themeColor", themeColor);
    }, [themeColor]);

    useEffect(() => {
        localStorage.setItem("userAvatarId", String(userAvatarId));
    }, [userAvatarId]);

    // WHEN USER CHANGES → LOAD CHATS
    useEffect(() => {
        if (user) {
            fetchUsersChats();
        } else {
            setChats([]);
            setSelectedChat(null);
        }
    }, [user]);

    useEffect(() => {
        saveChatsToLocalStorage(chats);
    }, [chats]);

    // WHEN TOKEN CHANGES → LOAD USER
    useEffect(() => {
        if (token) {
            fetchUser();
        } else {
            setUser(null);
            setLoadingUser(false);
        }
    }, [token]);

    const value = {
        navigate,
        user,
        setUser,
        chats,
        setChats,
        selectedChat,
        setSelectedChat,
        theme,
        setTheme,
        themeColor,
        setThemeColor,
        mood,
        setMood,
        createNewChat,
        loadingUser,
        fetchUsersChats,
        token,
        setToken,
        axios,
        userAvatarId,
        setUserAvatarId
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);
