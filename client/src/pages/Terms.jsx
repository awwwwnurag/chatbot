import React from "react";
import { motion } from "framer-motion";
import { FileText, Shield, Scale, Info, ExternalLink } from "lucide-react";

const Terms = () => {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      content: "By accessing and using Athena AI, you agree to be bound by these terms and conditions. If you do not agree, please refrain from using our services."
    },
    {
      title: "2. AI Content Usage",
      content: "Users retain ownership of the prompts provided. However, users are responsible for ensuring that the generated AI content does not violate any copyright or decency laws."
    },
    {
      title: "3. Privacy Policy",
      content: "Your data is encrypted and stored securely. We do not sell your personal data to third parties. We use your data exclusively to improve your AI experience."
    },
    {
      title: "4. Subscription & Credits",
      content: "Purchased credits are non-refundable. Subscriptions can be canceled at any time from the account settings page, effective at the end of the billing cycle."
    }
  ];

  return (
    <div className="h-full overflow-y-auto custom-scrollbar p-6 md:p-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto space-y-10 pb-20"
      >
        <div className="text-center space-y-4">
          <div className="inline-flex p-4 rounded-3xl liquid-glass mb-4 shadow-xl shadow-purple-500/10">
            <FileText className="w-10 h-10 text-[var(--color-primary)]" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-[var(--text-main)] italic">Terms & Policies</h1>
          <p className="text-[var(--text-muted)] max-w-md mx-auto">Updated April 9, 2026. Please read these documents carefully to understand your rights and responsibilities.</p>
        </div>

        <div className="grid gap-8">
          {sections.map((section, idx) => (
            <motion.div
              initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              key={section.title}
              className="p-8 rounded-3xl border border-white/5 bg-white/5 dark:bg-black/5 hover:bg-white/10 dark:hover:bg-black/10 transition-colors group relative overflow-hidden"
            >
               <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Scale className="w-24 h-24" />
               </div>
              <h2 className="text-xl font-bold text-[var(--text-main)] mb-4">{section.title}</h2>
              <p className="text-[var(--text-muted)] leading-relaxed">
                {section.content}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="p-8 rounded-3xl liquid-glass border border-purple-500/20 text-center">
            <Info className="w-6 h-6 text-purple-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-[var(--text-main)]">Questions about our legal terms?</h3>
            <p className="text-sm text-[var(--text-muted)] mt-2">Our support team is always here to help clarify any part of our policies.</p>
            <button className="mt-6 px-6 py-2.5 rounded-xl bg-purple-500 text-white font-medium hover:bg-purple-600 transition-colors flex items-center justify-center gap-2 mx-auto">
              Contact Legal Support <ExternalLink className="w-4 h-4" />
            </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Terms;
