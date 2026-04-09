import React, { useEffect } from 'react'
import { assets } from '../assets/assets'
import moment from 'moment'
import Markdown from 'react-markdown'
import Prism from 'prismjs'

const Message = ({ message }) => {
  useEffect(() => {
    Prism.highlightAll();
  }, [message.content]);

  return (
    <div>
      {message.role === "user" ? (
        <div className='flex items-start justify-end my-4 gap-2 animate-fade-in'>
          <div 
            className='flex flex-col gap-1 p-3 px-5 text-white rounded-2xl rounded-tr-sm shadow-md max-w-2xl transform transition-transform hover:scale-[1.01]'
            style={{ background: 'var(--accent-gradient)' }}
          >
            <p className='text-sm font-medium leading-relaxed'>{message.content}</p>
            <span className='text-[10px] opacity-70 self-end'>{moment(message.timestamp).format('LT')}</span>
          </div>

          {/* USER ICON */}
          <img 
            src={assets.user_icon} 
            className='w-8 h-8 rounded-full border-2 shadow-sm' 
            style={{ borderColor: 'var(--color-primary)' }}
            alt="user" 
          />
        </div>
      ) : (
        <div className='flex items-start justify-start my-4 gap-2 animate-fade-in'>
          <div className='flex flex-col gap-2 p-4 px-5 glass-card rounded-2xl rounded-tl-sm max-w-2xl border border-black/5 dark:border-white/10 shadow-sm transform transition-transform hover:scale-[1.01]'>

            {message.isImage ? (
              <img
                src={message.content}
                className='max-w-md mt-2 w-full rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300'
                alt="generated"
              />
            ) : (
              <div className='text-sm text-[var(--text-main)] leading-relaxed prose dark:prose-invert max-w-none'>
                <Markdown>{message.content}</Markdown>
              </div>
            )}

            <span className='text-[10px] text-[var(--text-muted)] self-end'>{moment(message.timestamp).format('LT')}</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default Message
