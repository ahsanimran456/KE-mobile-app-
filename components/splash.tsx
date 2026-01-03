"use client"

import { useEffect, useState } from "react"
import { Brain, Sparkles } from "lucide-react"

export default function Splash() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer)
          return 100
        }
        return prev + 2
      })
    }, 60)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen bg-[#0a0f14] flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      {/* Logo */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="relative mb-6">
          {/* Glow ring */}
          <div className="absolute inset-0 w-24 h-24 bg-cyan-500/20 rounded-3xl blur-xl animate-pulse" />
          
          {/* Icon container */}
          <div className="relative w-24 h-24 bg-gradient-to-br from-cyan-500 to-cyan-400 rounded-3xl flex items-center justify-center shadow-lg shadow-cyan-500/30">
            <Brain className="w-12 h-12 text-gray-900" />
          </div>
          
          {/* Sparkle */}
          <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-400 animate-pulse" />
        </div>

        {/* App name */}
        <h1 className="text-3xl font-bold text-white mb-1">
          Study<span className="text-cyan-400">AI</span>
        </h1>
        <p className="text-gray-500 text-sm">Your AI Study Companion</p>

        {/* Progress bar */}
        <div className="mt-8 w-48">
          <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full transition-all duration-100 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-gray-600 text-xs text-center mt-2">Loading...</p>
        </div>
      </div>

      {/* Bottom decoration */}
      <div className="absolute bottom-8 flex items-center gap-2 text-gray-600 text-xs">
        <span>✨</span>
        <span>Powered by GPT-4</span>
      </div>
    </div>
  )
}
