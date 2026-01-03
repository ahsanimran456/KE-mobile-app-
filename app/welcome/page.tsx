"use client"

import { useRouter } from "next/navigation"
import { ArrowRight, Sparkles, Brain, Calendar, Target } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function WelcomePage() {
  const router = useRouter()

  const features = [
    { icon: Brain, text: "AI-Powered Study Plans" },
    { icon: Calendar, text: "Smart Scheduling" },
    { icon: Target, text: "Progress Tracking" },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#0a0f14] to-[#111820] relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-cyan-400/5 rounded-full blur-[120px] animate-pulse" />
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 217, 255, 0.3) 1px, transparent 1px), 
                              linear-gradient(90deg, rgba(0, 217, 255, 0.3) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-10">
        {/* Robot Mascot */}
        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-48 h-48 rounded-full bg-cyan-500/20 blur-xl animate-pulse" />
          </div>
          
          <div className="relative animate-float">
            <svg width="180" height="200" viewBox="0 0 200 220" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
                <linearGradient id="bodyGradient" x1="50" y1="60" x2="150" y2="180" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#1a2a3a"/>
                  <stop offset="1" stopColor="#0d1520"/>
                </linearGradient>
                <linearGradient id="cyanGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00D9FF"/>
                  <stop offset="100%" stopColor="#00A8CC"/>
                </linearGradient>
              </defs>
              
              <circle cx="100" cy="20" r="8" fill="url(#cyanGradient)" filter="url(#glow)"/>
              <rect x="97" y="25" width="6" height="20" fill="#2a3a4a" rx="3"/>
              <rect x="55" y="45" width="90" height="70" rx="20" fill="url(#bodyGradient)" stroke="#00D9FF" strokeWidth="2"/>
              <ellipse cx="75" cy="80" rx="12" ry="14" fill="#0a1520"/>
              <ellipse cx="125" cy="80" rx="12" ry="14" fill="#0a1520"/>
              <ellipse cx="75" cy="80" rx="8" ry="10" fill="url(#cyanGradient)" filter="url(#glow)">
                <animate attributeName="ry" values="10;2;10" dur="3s" repeatCount="indefinite"/>
              </ellipse>
              <ellipse cx="125" cy="80" rx="8" ry="10" fill="url(#cyanGradient)" filter="url(#glow)">
                <animate attributeName="ry" values="10;2;10" dur="3s" repeatCount="indefinite"/>
              </ellipse>
              <path d="M80 100 Q100 115 120 100" stroke="#00D9FF" strokeWidth="3" fill="none" strokeLinecap="round"/>
              <rect x="40" y="65" width="15" height="30" rx="5" fill="url(#bodyGradient)" stroke="#00D9FF" strokeWidth="1.5"/>
              <rect x="145" y="65" width="15" height="30" rx="5" fill="url(#bodyGradient)" stroke="#00D9FF" strokeWidth="1.5"/>
              <rect x="60" y="120" width="80" height="60" rx="15" fill="url(#bodyGradient)" stroke="#00D9FF" strokeWidth="2"/>
              <circle cx="100" cy="145" r="12" fill="#0a1520"/>
              <circle cx="100" cy="145" r="8" fill="url(#cyanGradient)" filter="url(#glow)">
                <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite"/>
              </circle>
              <rect x="35" y="125" width="20" height="40" rx="10" fill="url(#bodyGradient)" stroke="#00D9FF" strokeWidth="1.5"/>
              <rect x="145" y="125" width="20" height="40" rx="10" fill="url(#bodyGradient)" stroke="#00D9FF" strokeWidth="1.5"/>
              <circle cx="45" cy="175" r="12" fill="url(#bodyGradient)" stroke="#00D9FF" strokeWidth="1.5"/>
              <circle cx="155" cy="175" r="12" fill="url(#bodyGradient)" stroke="#00D9FF" strokeWidth="1.5"/>
              <rect x="70" y="180" width="20" height="25" rx="8" fill="url(#bodyGradient)" stroke="#00D9FF" strokeWidth="1.5"/>
              <rect x="110" y="180" width="20" height="25" rx="8" fill="url(#bodyGradient)" stroke="#00D9FF" strokeWidth="1.5"/>
              <ellipse cx="80" cy="210" rx="15" ry="8" fill="url(#bodyGradient)" stroke="#00D9FF" strokeWidth="1.5"/>
              <ellipse cx="120" cy="210" rx="15" ry="8" fill="url(#bodyGradient)" stroke="#00D9FF" strokeWidth="1.5"/>
            </svg>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
            Study<span className="text-cyan-400 text-glow-cyan">Genie</span>
          </h1>
          <p className="text-cyan-400 text-lg font-medium flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" />
            Your AI Assistant
            <Sparkles className="w-4 h-4" />
          </p>
        </div>

        {/* Subtitle */}
        <p className="text-gray-400 text-center mb-10 max-w-xs leading-relaxed">
          Smart Support for Every Student. Let AI plan your studies and boost your grades.
        </p>

        {/* Features */}
        <div className="w-full max-w-xs space-y-3 mb-10">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="flex items-center gap-4 p-3 rounded-xl bg-gray-800/30 border border-gray-700/50"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                <feature.icon className="w-5 h-5 text-cyan-400" />
              </div>
              <span className="text-gray-300 font-medium">{feature.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="px-6 pb-10 safe-bottom relative z-10">
        <Button 
          onClick={() => router.push("/auth/login")}
          className="w-full h-14 bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 text-gray-900 font-semibold text-lg rounded-2xl glow-cyan transition-all duration-300 flex items-center justify-center gap-2"
        >
          Get Started
          <ArrowRight className="w-5 h-5" />
        </Button>
        
        <p className="text-center text-gray-500 text-sm mt-4">
          Already have an account?{" "}
          <button 
            onClick={() => router.push("/auth/login")}
            className="text-cyan-400 font-medium hover:underline"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  )
}

