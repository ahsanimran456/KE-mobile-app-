"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Check, Bell, Clock, Target, Flame, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import { updateUserProfile } from "@/lib/firestore"
import { toast } from "sonner"

const notificationOptions = [
  { id: "studyReminders", icon: Bell, label: "Study Reminders", desc: "Daily study notifications" },
  { id: "dailyGoals", icon: Target, label: "Daily Goals", desc: "Progress updates" },
  { id: "streakAlerts", icon: Flame, label: "Streak Alerts", desc: "Don't lose your streak!" },
  { id: "achievements", icon: Award, label: "Achievements", desc: "New badge unlocked" },
]

export default function NotificationsPage() {
  const router = useRouter()
  const { user, profile, loading: authLoading } = useAuth()
  const [settings, setSettings] = useState({
    studyReminders: true, dailyGoals: true, streakAlerts: true, achievements: true, reminderTime: "09:00"
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login")
      return
    }
    if (profile?.notifications) {
      setSettings(prev => ({ ...prev, ...profile.notifications }))
    }
  }, [user, authLoading, router, profile])

  const toggleSetting = (id: string) => {
    setSettings(prev => ({ ...prev, [id]: !prev[id as keyof typeof prev] }))
  }

  const handleSave = async () => {
    if (!user) return
    setSaving(true)
    try {
      await updateUserProfile(user.uid, { notifications: settings })
      toast.success("Settings saved!")
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
        <h1 className="text-lg font-bold text-white">Notifications</h1>
      </div>

      {/* Notification Toggles */}
      <div className="px-4 py-2">
        <div className="rounded-2xl bg-gray-800/30 border border-gray-700/40 overflow-hidden">
          {notificationOptions.map((option, i) => (
            <div key={option.id}
              className={`flex items-center gap-3 p-3.5 ${i < notificationOptions.length - 1 ? "border-b border-gray-700/30" : ""}`}>
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                <option.icon className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="flex-1">
                <p className="text-white text-sm font-medium">{option.label}</p>
                <p className="text-gray-500 text-xs">{option.desc}</p>
              </div>
              <button onClick={() => toggleSetting(option.id)}
                className={`w-11 h-6 rounded-full p-0.5 transition-all ${
                  settings[option.id as keyof typeof settings] ? "bg-cyan-500" : "bg-gray-700"
                }`}>
                <div className={`w-5 h-5 rounded-full bg-white transition-all ${
                  settings[option.id as keyof typeof settings] ? "translate-x-5" : "translate-x-0"
                }`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Reminder Time */}
      {settings.studyReminders && (
        <div className="px-4 py-2">
          <div className="p-4 rounded-2xl bg-gray-800/40 border border-gray-700/40">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span className="text-white text-sm font-medium">Reminder Time</span>
              </div>
              <input
                type="time"
                value={settings.reminderTime}
                onChange={(e) => setSettings(prev => ({ ...prev, reminderTime: e.target.value }))}
                className="bg-gray-700 border-none rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Save */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#0a0f14] to-transparent">
        <Button onClick={handleSave} disabled={saving} className="w-full h-11 bg-cyan-500 hover:bg-cyan-400 text-gray-900 rounded-xl">
          {saving ? "Saving..." : <><Check className="w-4 h-4 mr-1" /> Save Settings</>}
        </Button>
      </div>
    </div>
  )
}
