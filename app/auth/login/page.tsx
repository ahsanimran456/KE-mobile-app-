"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "sonner"
import Loading from "@/components/loading"

export default function LoginPage() {
  const router = useRouter()
  const { signIn, signInWithGoogle } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await signIn(formData.email, formData.password)
      toast.success("Welcome back!")
      router.push("/home")
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Login failed"
      if (errorMessage.includes("invalid-credential")) {
        toast.error("Invalid email or password")
      } else if (errorMessage.includes("too-many-requests")) {
        toast.error("Too many attempts. Try later.")
      } else {
        toast.error("Login failed. Try again.")
      }
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true)
    try {
      await signInWithGoogle()
      toast.success("Welcome!")
      router.push("/home")
    } catch (err) {
      toast.error("Google sign in failed.")
      setGoogleLoading(false)
    }
  }

  if (loading || googleLoading) {
    return <Loading />
  }

  return (
    <div className="h-screen flex flex-col bg-[#0a0f14] relative overflow-hidden px-5">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-48 h-48 bg-teal-500/10 rounded-full blur-[80px]" />
      </div>

      {/* Header */}
      <div className="relative z-10 pt-3">
        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={() => router.push("/welcome")}
          className="w-8 h-8 rounded-lg bg-gray-800/80 border border-gray-700/50 flex items-center justify-center text-gray-400"
        >
          <ArrowLeft className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center relative z-10">
        {/* Robot + Title */}
        <div className="flex items-center gap-3 mb-5">
          <motion.div animate={{ y: [0, -3, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
            <svg width="44" height="50" viewBox="0 0 160 180" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="bodyGradL" x1="80" y1="40" x2="80" y2="140" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#5EEAD4"/><stop offset="100%" stopColor="#14B8A6"/>
                </linearGradient>
                <linearGradient id="headGradL" x1="80" y1="20" x2="80" y2="90" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#99F6E4"/><stop offset="100%" stopColor="#2DD4BF"/>
                </linearGradient>
                <linearGradient id="eyeGradL" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#34D399"/><stop offset="100%" stopColor="#10B981"/>
                </linearGradient>
              </defs>
              <circle cx="80" cy="8" r="5" fill="#5EEAD4"/>
              <rect x="78" y="12" width="4" height="12" rx="2" fill="#2DD4BF"/>
              <ellipse cx="30" cy="60" rx="12" ry="18" fill="url(#bodyGradL)"/>
              <ellipse cx="130" cy="60" rx="12" ry="18" fill="url(#bodyGradL)"/>
              <ellipse cx="80" cy="55" rx="45" ry="40" fill="url(#headGradL)"/>
              <ellipse cx="62" cy="52" rx="10" ry="12" fill="#0D1F1C"/>
              <ellipse cx="62" cy="52" rx="7" ry="9" fill="url(#eyeGradL)"/>
              <circle cx="64" cy="49" r="2.5" fill="white" fillOpacity="0.8"/>
              <ellipse cx="98" cy="52" rx="10" ry="12" fill="#0D1F1C"/>
              <ellipse cx="98" cy="52" rx="7" ry="9" fill="url(#eyeGradL)"/>
              <circle cx="100" cy="49" r="2.5" fill="white" fillOpacity="0.8"/>
              <path d="M68 72 Q80 80 92 72" stroke="#134E4A" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
            </svg>
          </motion.div>
          <div>
            <h1 className="text-xl font-bold text-white">Welcome Back</h1>
            <p className="text-gray-400 text-xs">Sign in to continue</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-3">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-teal-400" />
            <input
              type="email"
              placeholder="Email address"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full h-12 pl-11 pr-4 bg-[#111820] border border-gray-700/80 rounded-2xl text-white placeholder:text-gray-500 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500/30 transition-all"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-teal-400" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full h-12 pl-11 pr-11 bg-[#111820] border border-gray-700/80 rounded-2xl text-white placeholder:text-gray-500 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500/30 transition-all"
              required
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex justify-end">
            <button type="button" className="text-xs text-teal-400">Forgot Password?</button>
          </div>

          <motion.button type="submit" whileTap={{ scale: 0.98 }} className="w-full h-12 bg-gradient-to-r from-teal-500 to-teal-400 hover:from-teal-400 hover:to-teal-300 text-gray-900 font-bold rounded-2xl shadow-lg shadow-teal-500/25 transition-all">
            Sign In
          </motion.button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-gray-700/60" />
          <span className="text-gray-500 text-xs">or</span>
          <div className="flex-1 h-px bg-gray-700/60" />
        </div>

        {/* Google */}
        <motion.button type="button" whileTap={{ scale: 0.98 }} onClick={handleGoogleSignIn} className="w-full h-12 bg-[#111820] border border-gray-700/80 hover:bg-[#1a2330] text-white rounded-2xl flex items-center justify-center gap-2.5 font-medium transition-all">
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </motion.button>

        {/* Bottom link */}
        <p className="text-gray-500 text-sm text-center mt-5">
          Don&apos;t have an account? <button onClick={() => router.push("/auth/signup")} className="text-teal-400 font-semibold">Sign Up</button>
        </p>
      </div>
    </div>
  )
}
