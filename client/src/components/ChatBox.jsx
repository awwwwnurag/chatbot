

import React, { useRef, useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import Message from './Message'
import toast from 'react-hot-toast'
import EmptyState from './EmptyState'
import LightRays from './LightRays'

const ChatBox = () => {
  const containerRef = useRef(null)

  const { selectedChat, theme, user, axios, token, setUser, setMood, setSelectedChat, setChats } = useAppContext()
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [prompt, setPrompt] = useState("")
  const [mode, setMode] = useState("text")
  const [isPublished, setIsPublished] = useState(false)

  const onSubmit = async (e) => {
    try {
      e.preventDefault();
      if (!user) return toast('login to send message')
      if (!selectedChat) return toast.error('Create or select a chat first')
      if (!prompt.trim()) return toast.error('Enter a prompt')

      setLoading(true)
      const promptCopy = prompt
      setPrompt('')
      const userMessage = {
        role: 'user',
        content: promptCopy,
        timestamp: Date.now(),
        isImage: mode === 'image' ? false : false,
      }
      setMessages(prev => [...prev, userMessage])

      const { data } = await axios.post(`/api/message/${mode}`, {
        chatId: selectedChat._id,
        prompt: promptCopy,
        isPublished
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (data.success) {
        setMessages(prevMessages => {
          const updatedMessages = [...prevMessages, data.reply]
          setSelectedChat(prev => prev ? { ...prev, messages: updatedMessages, updatedAt: Date.now() } : prev)
          setChats(prev => prev.map(chat => chat._id === selectedChat._id ? { ...chat, messages: updatedMessages, updatedAt: Date.now() } : chat))
          return updatedMessages
        })
        setUser(prev => ({ ...prev, credits: data.credits || (mode === 'image' ? prev.credits - 2 : prev.credits - 1) }))
      } else {
        toast.error(data.message)
        setPrompt(promptCopy)
        setMessages(prev => prev.filter(msg => msg !== userMessage))
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
      setMessages(prev => prev.slice(0, -1))
    }
    finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (selectedChat) {
      setMessages(selectedChat.messages)
    }
  }, [selectedChat])

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth',
      })
    }
  }, [messages])

  const analyzeMood = (msgs) => {
    if (!msgs || msgs.length === 0) return 'neutral';
    
    // Check the last 3 messages
    const recentMessages = msgs.slice(-3).map(m => m.content?.toLowerCase() || "");
    const text = recentMessages.join(" ");
    
    const energeticKeywords = ['exciting', 'happy', 'fast', 'action', 'energy', 'awesome', "let's go", 'great', 'wow', 'super', '!', 'love', 'amazing'];
    const calmKeywords = ['sleep', 'tired', 'calm', 'night', 'relax', 'quiet', 'moon', 'peace', 'chill', 'soothing', 'deep sea', 'sad'];
    
    let energeticScore = 0;
    let calmScore = 0;
    
    energeticKeywords.forEach(word => { if (text.includes(word)) energeticScore++; });
    calmKeywords.forEach(word => { if (text.includes(word)) calmScore++; });
    
    // Also consider time of day for late-night calm (10 PM to 4 AM)
    const currentHour = new Date().getHours();
    if (currentHour >= 22 || currentHour <= 4) {
      calmScore += 1; 
    }
    
    if (energeticScore > calmScore && energeticScore > 0) return 'energetic';
    if (calmScore > energeticScore && calmScore > 0) return 'calm';
    return 'neutral';
  }

  useEffect(() => {
    if (messages.length > 0) {
      setMood(analyzeMood(messages));
    }
  }, [messages, setMood])

  return (
    <div className='flex-1 flex flex-col h-full relative overflow-hidden'>
      {/* Background Effect */}
      <div style={{ width: '1080px', height: '1080px', position: 'absolute', top: 0, left: 0, zIndex: 0, pointerEvents: 'none' }}>
        <LightRays
          raysOrigin="top-center"
          raysColor="#95c5e9"
          raysSpeed={1.6}
          lightSpread={1}
          rayLength={3}
          pulsating={false}
          fadeDistance={1}
          saturation={1.1}
          followMouse
          mouseInfluence={0.3}
          noiseAmount={0}
          distortion={0}
        />
      </div>

      {/* Messages Area - Takes up all available space except input */}
      <div 
        ref={containerRef} 
        className='flex-1 overflow-y-auto scroll-smooth relative z-10 px-5 md:px-10 xl:px-30 2xl:pr-40'
      >
        <div className="flex flex-col min-h-full justify-end pb-32">
          {messages.length === 0 && (
            <div className="flex-1 flex flex-col justify-center">
              <EmptyState setPrompt={setPrompt} />
            </div>
          )}

          <div className="flex flex-col gap-4 py-10">
            {messages.map((message, index) => (
              <Message key={index} message={message} />
            ))}
          </div>

          {/* THREE DOTS LOADING */}
          {loading && (
            <div className='loader flex items-center gap-1.5 my-4 px-4'>
              <div className='w-2 h-2 rounded-full opacity-70 animate-bounce' style={{ backgroundColor: 'var(--color-primary)' }}></div>
              <div className='w-2 h-2 rounded-full opacity-50 animate-bounce' style={{ backgroundColor: 'var(--color-primary)' }}></div>
              <div className='w-2 h-2 rounded-full opacity-70 animate-bounce' style={{ backgroundColor: 'var(--color-primary)' }}></div>
            </div>
          )}
        </div>
      </div>

      {/* Input Box Area - Premium Floating Design */}
      <div className="absolute bottom-8 left-0 right-0 px-5 md:px-10 xl:px-40 2xl:px-60 z-30 pointer-events-none">
        <div className="max-w-4xl mx-auto pointer-events-auto">
          {mode == 'image' && (
            <div className="flex justify-center mb-4">
              <label 
                className='flex items-center gap-2 px-4 py-2 rounded-full liquid-glass text-xs font-semibold text-[var(--text-main)] animate-fade-in'
              >
                <input
                  type="checkbox"
                  className='cursor-pointer'
                  style={{ accentColor: 'var(--color-primary)' }}
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                />
                Publish to Community
              </label>
            </div>
          )}

          <div className="flex items-center gap-3 liquid-glass p-1.5 pl-4 rounded-[2rem] shadow-2xl transition-all duration-500 border-white/5 focus-within:ring-2 ring-[var(--color-primary-glow)]">
            <select
              onChange={(e) => setMode(e.target.value)}
              value={mode}
              className='text-xs font-bold uppercase tracking-wider outline-none p-2.5 px-4 rounded-full cursor-pointer transition-colors'
              style={{ backgroundColor: 'var(--color-primary-glow)', color: 'var(--color-primary)' }}
            >
              <option value="text">Text</option>
              <option value="image">Image</option>
            </select>

            <div className="w-px h-6 bg-slate-400/20 dark:bg-white/10"></div>

            <input
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); onSubmit(e); } }}
              value={prompt}
              type="text"
              placeholder={mode === 'text' ? "Ask Athena anything..." : "Describe the image you want to create..."}
              className="flex-1 w-full text-sm outline-none bg-transparent placeholder:text-[var(--text-muted)] text-[var(--text-main)] px-2"
              required
            />

            <button
              type="button"
              disabled={loading}
              onClick={onSubmit}
              className={`p-3 rounded-full transition-all duration-300 flex items-center justify-center ${loading ? 'bg-slate-200 dark:bg-white/10' : 'hover:scale-110 active:scale-95 shadow-lg'}`}
              style={{ 
                backgroundColor: loading ? undefined : 'var(--color-primary)', 
                boxShadow: loading ? undefined : '0 10px 15px -3px var(--color-primary-glow)' 
              }}
            >
              {loading ? (
                <img src={assets.stop_icon} alt="stop" className="w-4 h-4" />
              ) : (
                <svg 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  className="w-4 h-4 text-white transform rotate-45 -translate-x-0.5" 
                  stroke="currentColor" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatBox
