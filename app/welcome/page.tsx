"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowRight, Brain, Calendar, Target } from "lucide-react"

export default function WelcomePage() {
  const router = useRouter()

  const features = [
    { icon: Brain, text: "AI-Powered Study Plans", color: "text-teal-400" },
    { icon: Calendar, text: "Smart Scheduling", color: "text-emerald-400" },
    { icon: Target, text: "Progress Tracking", color: "text-cyan-400" },
  ]

  return (
    <div className="h-screen flex flex-col bg-[#0a0f14] relative overflow-hidden px-5">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-teal-500/15 rounded-full blur-[80px]" />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10">
        {/* Robot */}
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="mb-3"
        >
          <svg width="100" height="112" viewBox="0 0 160 180" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bodyGradW" x1="80" y1="40" x2="80" y2="140" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#5EEAD4"/><stop offset="100%" stopColor="#14B8A6"/>
              </linearGradient>
              <linearGradient id="headGradW" x1="80" y1="20" x2="80" y2="90" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#99F6E4"/><stop offset="100%" stopColor="#2DD4BF"/>
              </linearGradient>
              <linearGradient id="eyeGradW" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#34D399"/><stop offset="100%" stopColor="#10B981"/>
              </linearGradient>
            </defs>
            <circle cx="80" cy="8" r="5" fill="#5EEAD4"/>
            <rect x="78" y="12" width="4" height="12" rx="2" fill="#2DD4BF"/>
            <ellipse cx="30" cy="60" rx="12" ry="18" fill="url(#bodyGradW)"/>
            <ellipse cx="130" cy="60" rx="12" ry="18" fill="url(#bodyGradW)"/>
            <ellipse cx="80" cy="55" rx="45" ry="40" fill="url(#headGradW)"/>
            <ellipse cx="62" cy="52" rx="10" ry="12" fill="#0D1F1C"/>
            <ellipse cx="62" cy="52" rx="7" ry="9" fill="url(#eyeGradW)"/>
            <circle cx="64" cy="49" r="2.5" fill="white" fillOpacity="0.8"/>
            <ellipse cx="98" cy="52" rx="10" ry="12" fill="#0D1F1C"/>
            <ellipse cx="98" cy="52" rx="7" ry="9" fill="url(#eyeGradW)"/>
            <circle cx="100" cy="49" r="2.5" fill="white" fillOpacity="0.8"/>
            <path d="M68 72 Q80 80 92 72" stroke="#134E4A" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
            <path d="M50 95 Q50 105 55 115 L55 140 Q55 150 65 155 L95 155 Q105 150 105 140 L105 115 Q110 105 110 95 Q110 90 80 90 Q50 90 50 95Z" fill="url(#bodyGradW)"/>
            <circle cx="80" cy="115" r="6" fill="#99F6E4"/>
            <rect x="30" y="100" width="18" height="30" rx="9" fill="url(#bodyGradW)"/>
            <rect x="112" y="100" width="18" height="30" rx="9" fill="url(#bodyGradW)"/>
            <rect x="62" y="152" width="14" height="18" rx="7" fill="url(#bodyGradW)"/>
            <rect x="84" y="152" width="14" height="18" rx="7" fill="url(#bodyGradW)"/>
          </svg>
        </motion.div>

        {/* Title */}
        <h1 className="text-2xl font-bold">
          <span className="text-white">Study</span>
          <span className="text-teal-400">Genie</span>
        </h1>
        <p className="text-gray-400 text-xs mb-1">Your AI Study Companion</p>
        <p className="text-gray-500 text-[11px] text-center mb-4 max-w-[240px]">
          Smart Support for Every Student. Let AI plan your studies and boost your grades.
        </p>

        {/* Features */}
        <div className="w-full space-y-1.5">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="flex items-center gap-3 p-2.5 rounded-xl bg-[#111820] border border-gray-700/50"
            >
              <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center">
                <feature.icon className={`w-4 h-4 ${feature.color}`} />
              </div>
              <span className="text-gray-200 text-sm">{feature.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom */}
      <div className="py-5 relative z-10">
        <motion.button 
          whileTap={{ scale: 0.98 }}
          onClick={() => router.push("/auth/login")}
          className="w-full h-11 bg-gradient-to-r from-teal-500 to-teal-400 text-gray-900 font-bold rounded-2xl shadow-lg shadow-teal-500/25 flex items-center justify-center gap-2"
        >
          Get Started
          <ArrowRight className="w-4 h-4" />
        </motion.button>
        
        <p className="text-center text-gray-500 text-sm mt-2.5">
          Already have an account? <button onClick={() => router.push("/auth/login")} className="text-teal-400 font-semibold">Sign In</button>
        </p>
      </div>
    </div>
  )
}
