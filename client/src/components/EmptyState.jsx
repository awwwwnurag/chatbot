import React from 'react';
import { assets } from '../assets/assets';

const EmptyState = ({ setPrompt }) => {
    const suggestions = [
        "Explain Quantum Computing in simple terms",
        "Write a Python script for a discord bot",
        "Generate a cyberpunk city with neon lights",
        "What are the best web technologies for 2025?"
    ];

    return (
        <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto h-full px-4 animate-fade-in pt-16">
            {/* Header */}
            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                    Unlock your creativity with Athena
                </h1>
                <p className="text-[var(--text-muted)] text-lg">
                    Ask me anything or explore what others are creating.
                </p>
            </div>

            {/* Suggestions Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-12">
                {suggestions.map((text, index) => (
                    <button
                        key={index}
                        onClick={() => setPrompt(text)}
                        className="p-4 text-left rounded-xl bg-black/5 dark:bg-white/5 backdrop-blur-md border border-black/10 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10 hover:border-purple-500/50 dark:hover:border-purple-500/30 transition-all duration-300 group shadow-sm hover:shadow-md"
                    >
                        <p className="text-[var(--text-main)] text-sm font-medium group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors">
                            {text}
                        </p>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default EmptyState;
