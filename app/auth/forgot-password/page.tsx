"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Mail, ArrowLeft, Loader2, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { sendPasswordResetEmail } from "firebase/auth"
import { auth } from "@/lib/firebase"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [email, setEmail] = useState("")

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await sendPasswordResetEmail(auth, email)
      setSuccess(true)
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Reset failed"
      if (errorMessage.includes("user-not-found")) {
        setError("No account found with this email")
      } else if (errorMessage.includes("invalid-email")) {
        setError("Invalid email address")
      } else {
        setError("Failed to send reset email. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#0a0f14] to-[#111820] relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-[100px]" />
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-10">
          <div className="w-20 h-20 rounded-full bg-cyan-500/20 flex items-center justify-center mb-6">
            <CheckCircle className="w-10 h-10 text-cyan-400" />
          </div>
          
          <h1 className="text-2xl font-bold text-white mb-3 text-center">Check Your Email</h1>
          <p className="text-gray-400 text-center mb-8 max-w-xs">
            We&apos;ve sent a password reset link to <span className="text-cyan-400">{email}</span>
          </p>
          
          <Button
            onClick={() => router.push("/auth/login")}
            className="w-full max-w-xs h-14 bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 text-gray-900 font-semibold rounded-xl"
          >
            Back to Sign In
          </Button>
          
          <button 
            onClick={() => setSuccess(false)}
            className="mt-4 text-gray-500 hover:text-gray-300 text-sm"
          >
            Didn&apos;t receive email? Try again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#0a0f14] to-[#111820] relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-cyan-400/5 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <div className="relative z-10 p-4 safe-top">
        <button 
          onClick={() => router.push("/auth/login")}
          className="w-10 h-10 rounded-xl bg-gray-800/50 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col px-6 relative z-10">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-cyan-400/10 flex items-center justify-center border border-cyan-500/30">
            <Mail className="w-10 h-10 text-cyan-400" />
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Forgot Password?</h1>
          <p className="text-gray-400">Enter your email and we&apos;ll send you a reset link</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-gray-400 font-medium">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-14 pl-12 bg-gray-800/50 border-gray-700 rounded-xl text-white placeholder:text-gray-500 focus:border-cyan-500 focus:ring-cyan-500/20"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-14 bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 text-gray-900 font-semibold text-lg rounded-xl glow-cyan transition-all duration-300 mt-6"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Send Reset Link"
            )}
          </Button>
        </form>
      </div>

      {/* Bottom */}
      <div className="p-6 text-center relative z-10 safe-bottom">
        <p className="text-gray-500">
          Remember your password?{" "}
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

