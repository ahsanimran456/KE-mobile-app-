"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { 
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider
} from "firebase/auth"
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore"
import { auth, db, googleProvider } from "@/lib/firebase"

export interface UserProfile {
  uid: string
  name: string
  email: string
  photoURL?: string
  subjects: string[]
  studyHoursPerDay: number
  examDates: { subject: string; date: string }[]
  goals: string[]
  profileComplete: boolean
  createdAt: string
  updatedAt?: string
  streak: number
  totalStudyHours: number
  tasksCompleted: number
  level: number
  xp: number
}

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  logout: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  // Fetch user profile from Firestore
  const fetchProfile = async (uid: string) => {
    try {
      const userDoc = await getDoc(doc(db, "users", uid))
      if (userDoc.exists()) {
        setProfile({ uid, ...userDoc.data() } as UserProfile)
      }
    } catch (error) {
      console.error("Error fetching profile:", error)
    }
  }

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser)
      if (currentUser) {
        await fetchProfile(currentUser.uid)
      } else {
        setProfile(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  // Sign in with email/password
  const signIn = async (email: string, password: string) => {
    const result = await signInWithEmailAndPassword(auth, email, password)
    await fetchProfile(result.user.uid)
  }

  // Sign up with email/password
  const signUp = async (email: string, password: string, name: string) => {
    const result = await createUserWithEmailAndPassword(auth, email, password)
    
    // Update display name
    await updateProfile(result.user, { displayName: name })

    // Create user document in Firestore
    const newProfile: Omit<UserProfile, "uid"> = {
      name,
      email,
      subjects: [],
      studyHoursPerDay: 0,
      examDates: [],
      goals: [],
      profileComplete: false,
      createdAt: new Date().toISOString(),
      streak: 0,
      totalStudyHours: 0,
      tasksCompleted: 0,
      level: 1,
      xp: 0,
    }

    await setDoc(doc(db, "users", result.user.uid), newProfile)
    setProfile({ uid: result.user.uid, ...newProfile })
  }

  // Sign in with Google
  const signInWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider)
    
    // Check if user document exists
    const userDoc = await getDoc(doc(db, "users", result.user.uid))
    
    if (!userDoc.exists()) {
      // Create new user document
      const newProfile: Omit<UserProfile, "uid"> = {
        name: result.user.displayName || "User",
        email: result.user.email || "",
        photoURL: result.user.photoURL || undefined,
        subjects: [],
        studyHoursPerDay: 0,
        examDates: [],
        goals: [],
        profileComplete: false,
        createdAt: new Date().toISOString(),
        streak: 0,
        totalStudyHours: 0,
        tasksCompleted: 0,
        level: 1,
        xp: 0,
      }
      await setDoc(doc(db, "users", result.user.uid), newProfile)
      setProfile({ uid: result.user.uid, ...newProfile })
    } else {
      await fetchProfile(result.user.uid)
    }
  }

  // Logout
  const logout = async () => {
    await signOut(auth)
    setProfile(null)
  }

  // Reset password
  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email)
  }

  // Update user profile
  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!user) return

    const updateData = {
      ...data,
      updatedAt: new Date().toISOString(),
    }

    await updateDoc(doc(db, "users", user.uid), updateData)
    setProfile(prev => prev ? { ...prev, ...updateData } : null)
  }

  // Refresh profile
  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.uid)
    }
  }

  const value: AuthContextType = {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    logout,
    resetPassword,
    updateUserProfile,
    refreshProfile,
  }

  return (
    <AuthContext.Provider value={value}>
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

