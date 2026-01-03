"use client"

import { useState, useEffect, ReactNode } from "react"
import { AnimatePresence, motion } from "framer-motion"
import Splash from "./splash"

interface AppWrapperProps {
  children: ReactNode
}

export default function AppWrapper({ children }: AppWrapperProps) {
  const [showSplash, setShowSplash] = useState(true)
  const [isFirstVisit, setIsFirstVisit] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Check if this is the first visit in this session
    const visited = sessionStorage.getItem("app_visited")
    if (!visited) {
      setIsFirstVisit(true)
      sessionStorage.setItem("app_visited", "true")
    } else {
      setShowSplash(false)
    }
  }, [])

  useEffect(() => {
    if (isFirstVisit) {
      const timer = setTimeout(() => {
        setShowSplash(false)
      }, 2800)
      return () => clearTimeout(timer)
    }
  }, [isFirstVisit])

  // Prevent hydration mismatch
  if (!mounted) {
    return null
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {showSplash && isFirstVisit ? (
          <Splash key="splash" />
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="min-h-screen"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
