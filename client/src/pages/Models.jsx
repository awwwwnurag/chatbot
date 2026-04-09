import React from "react";
import { motion } from "framer-motion";
import { Cpu, Zap, Brain, Sparkles, Image, CheckCircle2 } from "lucide-react";

const Models = () => {
  const models = [
    {
      name: "Gemini 2.0 Flash",
      description: "Our fastest model for real-time interactions and quick image generation.",
      icon: <Zap className="w-6 h-6 text-yellow-500" />,
      tag: "Default",
      features: ["Instant response", "8K Context window", "Vision support"]
    },
    {
      name: "Gemini 2.0 Pro",
      description: "Optimized for complex reasoning, long-form creative writing, and deep analysis.",
      icon: <Brain className="w-6 h-6 text-purple-500" />,
      tag: "Subscription Required",
      features: ["Deep reasoning", "100K+ Context", "Complex instruction following"]
    },
    {
      name: "Imagen Professional",
      description: "State-of-the-art image generation model for photorealistic results.",
      icon: <Image className="w-6 h-6 text-blue-500" />,
      tag: "Vision",
      features: ["4K Upscaling", "Natural language parsing", "Hyper-realism"]
    }
  ];

  return (
    <div className="h-full overflow-y-auto custom-scrollbar p-6 md:p-12">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-4xl mx-auto space-y-12 pb-20"
      >
        <div className="text-center space-y-4">
          <div className="inline-flex p-4 rounded-3xl liquid-glass mb-4 shadow-xl shadow-blue-500/10 border border-white/10">
            <Cpu className="w-10 h-10 text-[var(--color-primary)]" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-[var(--text-main)] italic">Model Intelligence</h1>
          <p className="text-[var(--text-muted)] max-w-lg mx-auto">Explore the neural networks powering Athena AI. We use a hybrid architecture to deliver the best speed and quality for every task.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {models.map((model, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              key={model.name}
              className="p-6 rounded-3xl border border-white/5 bg-white/5 backdrop-blur-md hover:bg-white/10 transition-all duration-300 flex flex-col group cursor-pointer"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 rounded-2xl bg-white/10 text-white group-hover:scale-110 transition-transform">
                  {model.icon}
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-widest ${
                  model.tag === 'Default' ? 'bg-green-500/20 text-green-500' : 'bg-blue-500/20 text-blue-500'
                }`}>
                  {model.tag}
                </span>
              </div>
              <h3 className="text-xl font-bold text-[var(--text-main)] mb-2">{model.name}</h3>
              <p className="text-sm text-[var(--text-muted)] mb-6 flex-1">{model.description}</p>
              
              <div className="space-y-3 pt-6 border-t border-white/10">
                {model.features.map(feat => (
                  <div key={feat} className="flex items-center gap-2 text-xs text-[var(--text-main)]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    {feat}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="p-10 rounded-3xl bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-transparent border border-white/10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform duration-1000">
                <Sparkles className="w-32 h-32 text-white" />
            </div>
            <div className="relative z-10 space-y-4">
                <h3 className="text-2xl font-bold text-white">Hybrid Neural Orchestration</h3>
                <p className="text-[var(--text-muted)] max-w-xl">Our system automatically routes your requests to the most efficient model, ensuring you get high-quality results while minimizing latency.</p>
                <div className="flex gap-4">
                    <button className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors">Technical Docs</button>
                    <button className="px-6 py-2.5 rounded-xl bg-[var(--color-primary)] text-white text-sm font-medium transition-colors">View Benchmarks</button>
                </div>
            </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Models;
