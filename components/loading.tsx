"use client"

import { motion } from "framer-motion"

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0f14] relative overflow-hidden">
      {/* Glow Background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-72 h-72 bg-cyan-500/30 rounded-full blur-[80px]"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
          className="absolute w-56 h-56 bg-emerald-500/20 rounded-full blur-[60px]"
        />
      </div>

      {/* Robot Character */}
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10"
      >
        <svg width="160" height="180" viewBox="0 0 160 180" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            {/* Gradients */}
            <linearGradient id="bodyGrad" x1="80" y1="40" x2="80" y2="140" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#5EEAD4"/>
              <stop offset="50%" stopColor="#2DD4BF"/>
              <stop offset="100%" stopColor="#14B8A6"/>
            </linearGradient>
            <linearGradient id="headGrad" x1="80" y1="20" x2="80" y2="90" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#99F6E4"/>
              <stop offset="50%" stopColor="#5EEAD4"/>
              <stop offset="100%" stopColor="#2DD4BF"/>
            </linearGradient>
            <linearGradient id="eyeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34D399"/>
              <stop offset="100%" stopColor="#10B981"/>
            </linearGradient>
            <linearGradient id="glowGrad" x1="80" y1="0" x2="80" y2="180" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#2DD4BF" stopOpacity="0.5"/>
              <stop offset="100%" stopColor="#2DD4BF" stopOpacity="0"/>
            </linearGradient>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#0d9488" floodOpacity="0.4"/>
            </filter>
          </defs>
          
          {/* Antenna */}
          <motion.g
            animate={{ rotate: [-5, 5, -5] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: "80px 25px" }}
          >
            <circle cx="80" cy="8" r="6" fill="#5EEAD4" filter="url(#glow)"/>
            <rect x="77" y="12" width="6" height="15" rx="3" fill="#2DD4BF"/>
          </motion.g>
          
          {/* Ears/Headphones */}
          <ellipse cx="28" cy="60" rx="14" ry="20" fill="url(#bodyGrad)" filter="url(#shadow)"/>
          <ellipse cx="28" cy="60" rx="8" ry="12" fill="#134E4A"/>
          <ellipse cx="132" cy="60" rx="14" ry="20" fill="url(#bodyGrad)" filter="url(#shadow)"/>
          <ellipse cx="132" cy="60" rx="8" ry="12" fill="#134E4A"/>
          
          {/* Head */}
          <ellipse cx="80" cy="55" rx="48" ry="42" fill="url(#headGrad)" filter="url(#shadow)"/>
          
          {/* Face plate */}
          <ellipse cx="80" cy="58" rx="38" ry="32" fill="#F0FDFA" fillOpacity="0.15"/>
          
          {/* Eyes */}
          <g filter="url(#glow)">
            {/* Left eye */}
            <ellipse cx="60" cy="52" rx="12" ry="14" fill="#0D1F1C"/>
            <ellipse cx="60" cy="52" rx="9" ry="11" fill="url(#eyeGrad)"/>
            <motion.ellipse 
              cx="60" cy="52" rx="9" ry="11" fill="url(#eyeGrad)"
              animate={{ scaleY: [1, 0.1, 1] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
            />
            <circle cx="63" cy="48" r="3" fill="white" fillOpacity="0.8"/>
            
            {/* Right eye */}
            <ellipse cx="100" cy="52" rx="12" ry="14" fill="#0D1F1C"/>
            <ellipse cx="100" cy="52" rx="9" ry="11" fill="url(#eyeGrad)"/>
            <motion.ellipse 
              cx="100" cy="52" rx="9" ry="11" fill="url(#eyeGrad)"
              animate={{ scaleY: [1, 0.1, 1] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
            />
            <circle cx="103" cy="48" r="3" fill="white" fillOpacity="0.8"/>
          </g>
          
          {/* Mouth */}
          <motion.path 
            d="M65 75 Q80 85 95 75" 
            stroke="#134E4A" 
            strokeWidth="3" 
            fill="none" 
            strokeLinecap="round"
            animate={{ d: ["M65 75 Q80 85 95 75", "M65 78 Q80 82 95 78", "M65 75 Q80 85 95 75"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          
          {/* Body */}
          <path d="M50 95 Q50 105 55 115 L55 140 Q55 150 65 155 L95 155 Q105 150 105 140 L105 115 Q110 105 110 95 Q110 90 80 90 Q50 90 50 95Z" fill="url(#bodyGrad)" filter="url(#shadow)"/>
          
          {/* Chest light */}
          <motion.circle 
            cx="80" cy="115" r="8" 
            fill="#5EEAD4"
            filter="url(#glow)"
            animate={{ opacity: [0.6, 1, 0.6], scale: [0.9, 1.1, 0.9] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
          <circle cx="80" cy="115" r="5" fill="#99F6E4"/>
          
          {/* Arms */}
          <motion.g
            animate={{ rotate: [-8, 8, -8] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: "45px 105px" }}
          >
            <rect x="30" y="100" width="20" height="35" rx="10" fill="url(#bodyGrad)" filter="url(#shadow)"/>
            <circle cx="40" cy="140" r="10" fill="#2DD4BF"/>
          </motion.g>
          <motion.g
            animate={{ rotate: [8, -8, 8] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: "115px 105px" }}
          >
            <rect x="110" y="100" width="20" height="35" rx="10" fill="url(#bodyGrad)" filter="url(#shadow)"/>
            <circle cx="120" cy="140" r="10" fill="#2DD4BF"/>
          </motion.g>
          
          {/* Legs */}
          <rect x="60" y="152" width="16" height="20" rx="8" fill="url(#bodyGrad)"/>
          <rect x="84" y="152" width="16" height="20" rx="8" fill="url(#bodyGrad)"/>
          
          {/* Feet */}
          <ellipse cx="68" cy="175" rx="12" ry="6" fill="#14B8A6"/>
          <ellipse cx="92" cy="175" rx="12" ry="6" fill="#14B8A6"/>
        </svg>
      </motion.div>

      {/* App Name */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-6 z-10"
      >
        <h1 className="text-2xl font-bold">
          <span className="text-white">Study</span>
          <span className="text-teal-400">Genie</span>
        </h1>
      </motion.div>

      {/* Loading Dots */}
      <div className="flex gap-2 mt-6 z-10">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -8, 0],
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.15,
              ease: "easeInOut",
            }}
            className="w-2.5 h-2.5 rounded-full bg-teal-400"
          />
        ))}
      </div>

      {/* Bottom Glow Line */}
      <motion.div
        animate={{ opacity: [0.3, 0.6, 0.3], scaleX: [0.8, 1, 0.8] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-teal-500 to-transparent"
      />
    </div>
  )
}
