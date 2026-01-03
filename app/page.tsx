"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Splash from "@/components/splash"

export default function RootPage() {
  const [showSplash, setShowSplash] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false)
      router.push("/welcome")
    }, 3500)

    return () => clearTimeout(timer)
  }, [router])

  if (showSplash) {
    return <Splash />
  }

  return null
}
