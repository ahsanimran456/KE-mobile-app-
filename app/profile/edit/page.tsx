"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Check, User, Mail, Calendar, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import { updateUserProfile } from "@/lib/firestore"
import { toast } from "sonner"

export default function EditProfilePage() {
  const router = useRouter()
  const { user, profile, loading: authLoading } = useAuth()
  const [name, setName] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login")
      return
    }
    if (profile?.name) setName(profile.name)
  }, [user, authLoading, router, profile])

  const handleSave = async () => {
    if (!user || !name.trim()) return
    setSaving(true)
    try {
      await updateUserProfile(user.uid, { name: name.trim() })
      toast.success("Profile updated!")
      router.back()
    } catch (error) {
      toast.error("Failed to update")
    } finally {
      setSaving(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0f14]">
        <div className="w-10 h-10 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const memberSince = user?.metadata?.creationTime 
    ? new Date(user.metadata.creationTime).toLocaleDateString("en-US", { month: "short", year: "numeric" })
    : "N/A"

  return (
    <div className="min-h-screen bg-[#0a0f14]">
      {/* Header */}
      <div className="px-4 pt-3 pb-2 safe-top flex items-center gap-3">
        <button onClick={() => router.back()} className="w-9 h-9 rounded-xl bg-gray-800/60 flex items-center justify-center text-gray-400">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="text-lg font-bold text-white">Edit Profile</h1>
      </div>

      {/* Avatar */}
      <div className="px-4 py-4 flex justify-center">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-cyan-400 flex items-center justify-center text-3xl font-bold text-gray-900">
          {name.charAt(0).toUpperCase() || "S"}
        </div>
      </div>

      {/* Form */}
      <div className="px-4 py-2 space-y-3">
        <div>
          <label className="text-gray-400 text-xs mb-1 block">Display Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-11 pl-10 pr-4 bg-gray-800/60 border border-gray-700/50 rounded-xl text-white text-sm focus:border-cyan-500/50 focus:outline-none"
              placeholder="Your name"
            />
          </div>
        </div>

        <div>
          <label className="text-gray-400 text-xs mb-1 block">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              value={user?.email || ""}
              readOnly
              className="w-full h-11 pl-10 pr-4 bg-gray-800/30 border border-gray-700/30 rounded-xl text-gray-500 text-sm cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 py-3">
        <p className="text-gray-400 text-xs mb-2">Account Info</p>
        <div className="grid grid-cols-2 gap-2">
          <div className="p-3 rounded-xl bg-gray-800/40 border border-gray-700/40">
            <Calendar className="w-4 h-4 text-cyan-400 mb-1" />
            <p className="text-white text-sm font-medium">{memberSince}</p>
            <p className="text-gray-500 text-[10px]">Member since</p>
          </div>
          <div className="p-3 rounded-xl bg-gray-800/40 border border-gray-700/40">
            <Award className="w-4 h-4 text-purple-400 mb-1" />
            <p className="text-white text-sm font-medium">Lvl {profile?.level || 1}</p>
            <p className="text-gray-500 text-[10px]">{profile?.xp || 0} XP earned</p>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="px-4 py-3">
        <Button onClick={handleSave} disabled={saving || !name.trim()} className="w-full h-11 bg-cyan-500 hover:bg-cyan-400 text-gray-900 rounded-xl">
          {saving ? "Saving..." : <><Check className="w-4 h-4 mr-1" /> Save Changes</>}
        </Button>
      </div>
    </div>
  )
}
