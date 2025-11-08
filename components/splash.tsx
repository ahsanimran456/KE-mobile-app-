"use client"

import { useEffect, useState } from "react"

export default function Splash() {
  const [fadeIn, setFadeIn] = useState(false)

  useEffect(() => {
    setFadeIn(true)
  }, [])

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
      <div
        className={`flex flex-col items-center gap-8 transition-all duration-700 ${
          fadeIn ? "scale-100 opacity-100" : "scale-90 opacity-0"
        }`}
      >
        <div className="relative animate-pulse">
          <img
            src="/kelogo.png"
            alt="App Logo"
            className="h-40 w-40 object-contain drop-shadow-2xl"
          />
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-2">
            <div className="h-3 w-3 animate-bounce rounded-full bg-[#F29200] [animation-delay:-0.3s]"></div>
            <div className="h-3 w-3 animate-bounce rounded-full bg-[#F29200] [animation-delay:-0.15s]"></div>
            <div className="h-3 w-3 animate-bounce rounded-full bg-[#F29200]"></div>
          </div>
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    </div>
  )
}
