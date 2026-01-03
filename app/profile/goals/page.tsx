"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Check, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import { updateUserProfile } from "@/lib/firestore"
import { toast } from "sonner"

const presetGoals = [
  { id: "grades", icon: "📚", label: "Improve grades" },
  { id: "exam", icon: "🎯", label: "Pass exams" },
  { id: "skills", icon: "💡", label: "Learn new skills" },
  { id: "habits", icon: "⏰", label: "Build study habits" },
  { id: "focus", icon: "🧠", label: "Improve focus" },
  { id: "time", icon: "⚡", label: "Manage time better" },
  { id: "stress", icon: "😌", label: "Reduce stress" },
  { id: "gpa", icon: "🏆", label: "Boost GPA" },
]

export default function GoalsPage() {
  const router = useRouter()
  const { user, profile, loading: authLoading } = useAuth()
  const [goals, setGoals] = useState<string[]>([])
  const [customGoal, setCustomGoal] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login")
      return
    }
    if (profile?.goals) setGoals(profile.goals)
  }, [user, authLoading, router, profile])

  const toggleGoal = (goalId: string) => {
    setGoals(prev =>
      prev.includes(goalId) ? prev.filter(g => g !== goalId) : prev.length < 6 ? [...prev, goalId] : prev
    )
  }

  const addCustom = () => {
    if (customGoal.trim() && goals.length < 6) {
      const id = `custom_${customGoal.trim().toLowerCase().replace(/\s+/g, "_")}`
      if (!goals.includes(id)) {
        setGoals(prev => [...prev, id])
        setCustomGoal("")
      }
    }
  }

  const handleSave = async () => {
    if (!user) return
    setSaving(true)
    try {
      await updateUserProfile(user.uid, { goals })
      toast.success("Goals saved!")
      router.back()
    } catch (error) {
      toast.error("Failed to save")
    } finally {
      setSaving(false)
    }
  }

  const getGoalLabel = (id: string) => {
    const preset = presetGoals.find(g => g.id === id)
    return preset ? `${preset.icon} ${preset.label}` : id.replace("custom_", "").replace(/_/g, " ")
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
          <h1 className="text-lg font-bold text-white">Study Goals</h1>
          <p className="text-gray-500 text-xs">{goals.length}/6 selected</p>
        </div>
      </div>

      {/* Selected */}
      {goals.length > 0 && (
        <div className="px-4 py-2">
          <p className="text-gray-400 text-xs mb-2">Your Goals</p>
          <div className="flex flex-wrap gap-1.5">
            {goals.map(g => (
              <button key={g} onClick={() => toggleGoal(g)}
                className="px-2.5 py-1.5 rounded-lg bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-xs font-medium flex items-center gap-1">
                {getGoalLabel(g)}
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
            value={customGoal}
            onChange={(e) => setCustomGoal(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addCustom()}
            placeholder="Add custom goal..."
            className="flex-1 h-10 px-3 bg-gray-800/60 border border-gray-700/50 rounded-xl text-white text-sm focus:border-cyan-500/50 focus:outline-none"
          />
          <Button onClick={addCustom} disabled={!customGoal.trim() || goals.length >= 6}
            className="h-10 w-10 bg-cyan-500 hover:bg-cyan-400 rounded-xl p-0">
            <Plus className="w-4 h-4 text-gray-900" />
          </Button>
        </div>
      </div>

      {/* Preset Goals */}
      <div className="px-4 py-2">
        <p className="text-gray-400 text-xs mb-2">Choose Goals</p>
        <div className="grid grid-cols-2 gap-2">
          {presetGoals.map(g => {
            const selected = goals.includes(g.id)
            return (
              <button key={g.id} onClick={() => toggleGoal(g.id)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  selected ? "bg-cyan-500/20 border-cyan-500/30" : "bg-gray-800/40 border-gray-700/40"
                }`}>
                <span className="text-lg">{g.icon}</span>
                <p className={`text-sm font-medium mt-1 ${selected ? "text-cyan-400" : "text-white"}`}>{g.label}</p>
              </button>
            )
          })}
        </div>
      </div>

      {/* Save */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#0a0f14] to-transparent">
        <Button onClick={handleSave} disabled={saving} className="w-full h-11 bg-cyan-500 hover:bg-cyan-400 text-gray-900 rounded-xl">
          {saving ? "Saving..." : <><Check className="w-4 h-4 mr-1" /> Save Goals</>}
        </Button>
      </div>
    </div>
  )
}
