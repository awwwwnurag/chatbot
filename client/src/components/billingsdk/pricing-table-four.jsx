"use client";

import * as React from "react";
import { cn } from "./utils";
import { motion } from "motion/react";

export function PricingTableFour({
  plans,
  title = "Choose Your Plan",
  subtitle,
  description,
  theme = "classic",
  size = "medium",
  className,
  showBillingToggle = false,
  billingToggleLabels = { monthly: "Monthly", yearly: "Yearly" },
  onPlanSelect,
}) {
  const [billingCycle, setBillingCycle] = React.useState("monthly");

  const sizeClasses = {
    small: "max-w-sm",
    medium: "max-w-2xl",
    large: "max-w-7xl",
  };

  return (
    <div className={cn("w-full", sizeClasses[size], className)}>
      {/* Header */}
      <div className="text-center mb-12">
        {subtitle && (
          <p className="text-sm font-medium text-purple-600 dark:text-purple-400 uppercase tracking-wider mb-2">
            {subtitle}
          </p>
        )}
        <h2 className="text-3xl md:text-5xl font-bold text-[var(--text-main)] mb-4">
          {title}
        </h2>
        {description && (
          <p className="text-lg text-[var(--text-muted)] max-w-2xl mx-auto">
            {description}
          </p>
        )}
      </div>

      {/* Billing Toggle */}
      {showBillingToggle && (
        <div className="flex justify-center mb-8">
          <div className="relative bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
            <div className="flex">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-md transition-all",
                  billingCycle === "monthly"
                    ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                )}
              >
                {billingToggleLabels.monthly}
              </button>
              <button
                onClick={() => setBillingCycle("yearly")}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-md transition-all",
                  billingCycle === "yearly"
                    ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                )}
              >
                {billingToggleLabels.yearly}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={cn(
        "grid gap-8 justify-center items-stretch",
        theme === "minimal" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      )}>
        {plans.map((plan) => (
          <motion.div
            key={plan.id}
            whileHover={{ 
              rotateX: 7, 
              rotateY: -7, 
              scale: 1.02,
              z: 30
            }}
            initial={{ perspective: 1000 }}
            className={cn(
              "relative premium-card col-hover p-8 md:p-10 flex flex-col min-w-[320px] max-w-[400px] cursor-target",
              plan.popular
                ? "border-indigo-500/50 ring-4 ring-indigo-500/5 dark:bg-indigo-500/5 shadow-indigo-500/10"
                : "border-slate-200 dark:border-white/5",
            )}
          >
            {/* Popular Badge */}
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-indigo-600 text-white px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-indigo-600/30">
                  {plan.badge || "Most Popular"}
                </span>
              </div>
            )}

            {/* Plan Header */}
            <div className="text-center mb-6 pointer-events-none">
              <h3 className="text-xl font-semibold text-[var(--text-main)] mb-2">
                {plan.name}
              </h3>
              <div className="flex items-baseline justify-center">
                <span className="text-4xl font-bold text-[var(--text-main)]">
                  ${plan.price}
                </span>
                <span className="text-[var(--text-muted)] ml-1">
                  /{plan.credits} credits
                </span>
              </div>
            </div>

            {/* Features */}
            <ul className="space-y-3 mb-8 pointer-events-none">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <svg
                    className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-[var(--text-main)] text-sm">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            {/* CTA Button */}
            <button
              onClick={() => onPlanSelect?.(plan.id)}
              className={cn(
                "w-full py-3 px-6 rounded-lg font-medium transition-all",
                plan.popular
                  ? "bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl"
                  : "bg-gray-900 dark:bg-gray-700 hover:bg-gray-800 dark:hover:bg-gray-600 text-white",
                theme === "minimal" && "hover:scale-105"
              )}
            >
              Choose {plan.name}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}