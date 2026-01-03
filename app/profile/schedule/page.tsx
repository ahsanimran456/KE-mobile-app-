"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Check, Clock, Sun, Sunset, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import { updateUserProfile } from "@/lib/firestore"
import { toast } from "sonner"

const timeSlots = [
  { id: "morning", icon: Sun, label: "Morning", time: "6AM - 12PM" },
  { id: "afternoon", icon: Sunset, label: "Afternoon", time: "12PM - 6PM" },
  { id: "evening", icon: Moon, label: "Evening", time: "6PM - 12AM" },
]

const weekDays = [
  { id: "mon", label: "M" },
  { id: "tue", label: "T" },
  { id: "wed", label: "W" },
  { id: "thu", label: "T" },
  { id: "fri", label: "F" },
  { id: "sat", label: "S" },
  { id: "sun", label: "S" },
]

export default function SchedulePage() {
  const router = useRouter()
  const { user, profile, loading: authLoading } = useAuth()
  const [studyHours, setStudyHours] = useState(3)
  const [preferredTime, setPreferredTime] = useState("afternoon")
  const [studyDays, setStudyDays] = useState<string[]>(["mon", "tue", "wed", "thu", "fri"])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login")
      return
    }
    if (profile) {
      setStudyHours(profile.studyHoursPerDay || 3)
      setPreferredTime(profile.preferredTime || "afternoon")
      setStudyDays(profile.studyDays || ["mon", "tue", "wed", "thu", "fri"])
    }
  }, [user, authLoading, router, profile])

  const toggleDay = (dayId: string) => {
    setStudyDays(prev =>
      prev.includes(dayId) ? prev.filter(d => d !== dayId) : [...prev, dayId]
    )
  }

  const handleSave = async () => {
    if (!user) return
    setSaving(true)
    try {
      await updateUserProfile(user.uid, { studyHoursPerDay: studyHours, preferredTime, studyDays })
      toast.success("Schedule saved!")
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
        <h1 className="text-lg font-bold text-white">Study Schedule</h1>
      </div>

      {/* Daily Hours */}
      <div className="px-4 py-3">
        <div className="p-4 rounded-2xl bg-gray-800/40 border border-gray-700/40">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span className="text-white text-sm font-medium">Daily Study Goal</span>
            </div>
            <span className="text-cyan-400 font-bold text-lg">{studyHours}h</span>
          </div>
          <input
            type="range"
            min="1"
            max="8"
            value={studyHours}
            onChange={(e) => setStudyHours(Number(e.target.value))}
            className="w-full h-1.5 bg-gray-700 rounded-full appearance-none cursor-pointer accent-cyan-500"
          />
          <div className="flex justify-between text-gray-500 text-xs mt-1">
            <span>1h</span>
            <span>4h</span>
            <span>8h</span>
          </div>
        </div>
      </div>

      {/* Preferred Time */}
      <div className="px-4 py-2">
        <p className="text-gray-400 text-xs mb-2">Preferred Study Time</p>
        <div className="grid grid-cols-3 gap-2">
          {timeSlots.map(slot => {
            const selected = preferredTime === slot.id
            return (
              <button key={slot.id} onClick={() => setPreferredTime(slot.id)}
                className={`p-3 rounded-xl border text-center transition-all ${
                  selected ? "bg-cyan-500/20 border-cyan-500/30" : "bg-gray-800/40 border-gray-700/40"
                }`}>
                <slot.icon className={`w-5 h-5 mx-auto mb-1 ${selected ? "text-cyan-400" : "text-gray-500"}`} />
                <p className={`text-xs font-medium ${selected ? "text-cyan-400" : "text-white"}`}>{slot.label}</p>
                <p className="text-gray-500 text-[10px]">{slot.time}</p>
              </button>
            )
          })}
        </div>
      </div>

      {/* Study Days */}
      <div className="px-4 py-3">
        <p className="text-gray-400 text-xs mb-2">Study Days</p>
        <div className="flex gap-2 justify-between">
          {weekDays.map(day => {
            const selected = studyDays.includes(day.id)
            return (
              <button key={day.id} onClick={() => toggleDay(day.id)}
                className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${
                  selected ? "bg-cyan-500 text-gray-900" : "bg-gray-800/50 border border-gray-700/50 text-gray-500"
                }`}>
                {day.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Summary */}
      <div className="px-4 py-2">
        <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
          <p className="text-cyan-400 text-sm text-center">
            📅 {studyDays.length} days/week • {studyHours}h/day = <span className="font-bold">{studyDays.length * studyHours}h/week</span>
          </p>
        </div>
      </div>

      {/* Save */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#0a0f14] to-transparent">
        <Button onClick={handleSave} disabled={saving} className="w-full h-11 bg-cyan-500 hover:bg-cyan-400 text-gray-900 rounded-xl">
          {saving ? "Saving..." : <><Check className="w-4 h-4 mr-1" /> Save Schedule</>}
        </Button>
      </div>
    </div>
  )
}
