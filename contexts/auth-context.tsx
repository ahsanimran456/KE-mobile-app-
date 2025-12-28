"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"

export interface User {
  id: string
  username: string
  email: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => { success: boolean; error?: string }
  signup: (username: string, email: string, password: string) => { success: boolean; error?: string }
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session on mount
    const currentUser = localStorage.getItem("currentUser")
    if (currentUser) {
      setUser(JSON.parse(currentUser))
    }
    setIsLoading(false)
  }, [])

  const signup = (username: string, email: string, password: string): { success: boolean; error?: string } => {
    // Get existing users from localStorage
    const users = JSON.parse(localStorage.getItem("users") || "[]")
    
    // Check if email already exists
    const existingUser = users.find((u: { email: string }) => u.email.toLowerCase() === email.toLowerCase())
    if (existingUser) {
      return { success: false, error: "An account with this email already exists" }
    }

    // Check if username already exists
    const existingUsername = users.find((u: { username: string }) => u.username.toLowerCase() === username.toLowerCase())
    if (existingUsername) {
      return { success: false, error: "This username is already taken" }
    }

    // Create new user
    const newUser = {
      id: crypto.randomUUID(),
      username,
      email: email.toLowerCase(),
      password, // In production, this should be hashed
    }

    // Save to localStorage
    users.push(newUser)
    localStorage.setItem("users", JSON.stringify(users))

    // Auto login after signup
    const { password: _, ...userWithoutPassword } = newUser
    setUser(userWithoutPassword)
    localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword))

    return { success: true }
  }

  const login = (email: string, password: string): { success: boolean; error?: string } => {
    const users = JSON.parse(localStorage.getItem("users") || "[]")
    
    const foundUser = users.find(
      (u: { email: string; password: string }) => 
        u.email.toLowerCase() === email.toLowerCase() && u.password === password
    )

    if (!foundUser) {
      return { success: false, error: "Invalid email or password" }
    }

    const { password: _, ...userWithoutPassword } = foundUser
    setUser(userWithoutPassword)
    localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword))

    return { success: true }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("currentUser")
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

