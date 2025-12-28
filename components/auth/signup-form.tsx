"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { Eye, EyeOff, Mail, Lock, User, Loader2, Sparkles, AlertCircle, Check } from "lucide-react"

export default function SignupForm() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<{ 
    username?: string
    email?: string
    password?: string
    confirmPassword?: string
    general?: string 
  }>({})
  const [isLoading, setIsLoading] = useState(false)
  const { signup } = useAuth()
  const router = useRouter()

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const getPasswordStrength = (password: string): { strength: number; label: string; color: string } => {
    let strength = 0
    if (password.length >= 6) strength++
    if (password.length >= 8) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++

    if (strength <= 1) return { strength: 1, label: "Weak", color: "bg-red-500" }
    if (strength <= 2) return { strength: 2, label: "Fair", color: "bg-orange-500" }
    if (strength <= 3) return { strength: 3, label: "Good", color: "bg-yellow-500" }
    if (strength <= 4) return { strength: 4, label: "Strong", color: "bg-green-500" }
    return { strength: 5, label: "Very Strong", color: "bg-emerald-500" }
  }

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {}

    if (!username.trim()) {
      newErrors.username = "Username is required"
    } else if (username.length < 3) {
      newErrors.username = "Username must be at least 3 characters"
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      newErrors.username = "Username can only contain letters, numbers, and underscores"
    }

    if (!email.trim()) {
      newErrors.email = "Email is required"
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!password) {
      newErrors.password = "Password is required"
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)
    setErrors({})

    // Simulate network delay for better UX
    await new Promise(resolve => setTimeout(resolve, 1000))

    const result = signup(username, email, password)

    if (result.success) {
      router.push("/todos")
    } else {
      setErrors({ general: result.error })
    }

    setIsLoading(false)
  }

  const passwordStrength = getPasswordStrength(password)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-amber-50 p-4 safe-area-inset-top safe-area-inset-bottom">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-64 h-64 sm:w-80 sm:h-80 bg-orange-400 rounded-full opacity-10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 sm:w-80 sm:h-80 bg-amber-400 rounded-full opacity-10 blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-32 h-32 sm:w-48 sm:h-48 bg-orange-300 rounded-full opacity-5 blur-2xl" />
      </div>

      <div className="relative w-full max-w-md mx-auto">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-orange-100/50 border border-orange-100 p-6 sm:p-8 space-y-5 sm:space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 shadow-lg shadow-orange-200 mb-3 sm:mb-4">
              <Sparkles className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Create Account</h1>
            <p className="text-gray-500 text-sm sm:text-base">Start organizing your tasks today</p>
          </div>

          {/* Error message */}
          {errors.general && (
            <div className="flex items-center gap-3 p-3 sm:p-4 rounded-xl bg-red-50 border border-red-100 text-red-600">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{errors.general}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {/* Username field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block">Username</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value)
                    if (errors.username) setErrors({ ...errors, username: undefined })
                  }}
                  placeholder="Choose a username"
                  className={`w-full pl-12 pr-4 py-3 sm:py-3.5 bg-gray-50 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:bg-white transition-all duration-200 text-base ${
                    errors.username 
                      ? "border-red-300 focus:ring-red-100 focus:border-red-400" 
                      : "border-gray-200 focus:ring-orange-100 focus:border-orange-400"
                  }`}
                />
              </div>
              {errors.username && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.username}
                </p>
              )}
            </div>

            {/* Email field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (errors.email) setErrors({ ...errors, email: undefined })
                  }}
                  placeholder="Enter your email"
                  className={`w-full pl-12 pr-4 py-3 sm:py-3.5 bg-gray-50 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:bg-white transition-all duration-200 text-base ${
                    errors.email 
                      ? "border-red-300 focus:ring-red-100 focus:border-red-400" 
                      : "border-gray-200 focus:ring-orange-100 focus:border-orange-400"
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (errors.password) setErrors({ ...errors, password: undefined })
                  }}
                  placeholder="Create a password"
                  className={`w-full pl-12 pr-12 py-3 sm:py-3.5 bg-gray-50 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:bg-white transition-all duration-200 text-base ${
                    errors.password 
                      ? "border-red-300 focus:ring-red-100 focus:border-red-400" 
                      : "border-gray-200 focus:ring-orange-100 focus:border-orange-400"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {/* Password strength indicator */}
              {password && (
                <div className="space-y-1.5">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                          level <= passwordStrength.strength ? passwordStrength.color : "bg-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500">
                    Password strength: <span className={`font-medium ${passwordStrength.color.replace('bg-', 'text-')}`}>{passwordStrength.label}</span>
                  </p>
                </div>
              )}
              {errors.password && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value)
                    if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: undefined })
                  }}
                  placeholder="Confirm your password"
                  className={`w-full pl-12 pr-12 py-3 sm:py-3.5 bg-gray-50 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:bg-white transition-all duration-200 text-base ${
                    errors.confirmPassword 
                      ? "border-red-300 focus:ring-red-100 focus:border-red-400" 
                      : confirmPassword && password === confirmPassword
                        ? "border-green-300 focus:ring-green-100 focus:border-green-400"
                        : "border-gray-200 focus:ring-orange-100 focus:border-orange-400"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
                {confirmPassword && password === confirmPassword && (
                  <Check className="absolute right-12 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                )}
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 sm:py-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold rounded-xl shadow-lg shadow-orange-200 hover:shadow-orange-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base mt-2 active:scale-[0.98] touch-manipulation"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-gray-500 text-sm sm:text-base">
            Already have an account?{" "}
            <Link href="/login" className="text-orange-600 hover:text-orange-700 font-semibold transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
