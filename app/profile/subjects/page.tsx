"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Check, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import { updateUserProfile } from "@/lib/firestore"
import { toast } from "sonner"

const popularSubjects = [
  "Mathematics", "Physics", "Chemistry", "Biology",
  "Computer Science", "English", "History", "Psychology",
  "Economics", "Business", "Accounting", "Statistics",
  "Law", "Medicine", "Engineering", "Art",
]

export default function SubjectsPage() {
  const router = useRouter()
  const { user, profile, loading: authLoading } = useAuth()
  const [subjects, setSubjects] = useState<string[]>([])
  const [customSubject, setCustomSubject] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login")
      return
    }
    if (profile?.subjects) setSubjects(profile.subjects)
  }, [user, authLoading, router, profile])

  const toggleSubject = (subject: string) => {
    setSubjects(prev =>
      prev.includes(subject) ? prev.filter(s => s !== subject) : prev.length < 10 ? [...prev, subject] : prev
    )
  }

  const addCustom = () => {
    if (customSubject.trim() && subjects.length < 10 && !subjects.includes(customSubject.trim())) {
      setSubjects(prev => [...prev, customSubject.trim()])
      setCustomSubject("")
    }
  }

  const handleSave = async () => {
    if (!user) return
    setSaving(true)
    try {
      await updateUserProfile(user.uid, { subjects })
      toast.success("Subjects saved!")
      router.back()
    } catch (error) {
      toast.error("Failed to save")
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

  return (
    <div className="min-h-screen bg-[#0a0f14] pb-20">
      {/* Header */}
      <div className="px-4 pt-3 pb-2 safe-top flex items-center gap-3">
        <button onClick={() => router.back()} className="w-9 h-9 rounded-xl bg-gray-800/60 flex items-center justify-center text-gray-400">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-bold text-white">My Subjects</h1>
          <p className="text-gray-500 text-xs">{subjects.length}/10 selected</p>
        </div>
      </div>

      {/* Selected */}
      {subjects.length > 0 && (
        <div className="px-4 py-2">
          <p className="text-gray-400 text-xs mb-2">Selected</p>
          <div className="flex flex-wrap gap-1.5">
            {subjects.map(s => (
              <button key={s} onClick={() => toggleSubject(s)}
                className="px-2.5 py-1.5 rounded-lg bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-xs font-medium flex items-center gap-1">
                {s}
                <X className="w-3 h-3" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Add Custom */}
      <div className="px-4 py-2">
        <div className="flex gap-2">
          <input
            value={customSubject}
            onChange={(e) => setCustomSubject(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addCustom()}
            placeholder="Add custom subject..."
            className="flex-1 h-10 px-3 bg-gray-800/60 border border-gray-700/50 rounded-xl text-white text-sm focus:border-cyan-500/50 focus:outline-none"
          />
          <Button onClick={addCustom} disabled={!customSubject.trim() || subjects.length >= 10}
            className="h-10 w-10 bg-cyan-500 hover:bg-cyan-400 rounded-xl p-0">
            <Plus className="w-4 h-4 text-gray-900" />
          </Button>
        </div>
      </div>

      {/* Popular */}
      <div className="px-4 py-2">
        <p className="text-gray-400 text-xs mb-2">Popular Subjects</p>
        <div className="flex flex-wrap gap-1.5">
          {popularSubjects.filter(s => !subjects.includes(s)).map(s => (
            <button key={s} onClick={() => toggleSubject(s)}
              className="px-2.5 py-1.5 rounded-lg bg-gray-800/50 border border-gray-700/50 text-gray-400 text-xs hover:border-cyan-500/50 hover:text-cyan-400 transition-all">
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Save */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#0a0f14] to-transparent">
        <Button onClick={handleSave} disabled={saving} className="w-full h-11 bg-cyan-500 hover:bg-cyan-400 text-gray-900 rounded-xl">
          {saving ? "Saving..." : <><Check className="w-4 h-4 mr-1" /> Save Subjects</>}
        </Button>
      </div>
    </div>
  )
}
