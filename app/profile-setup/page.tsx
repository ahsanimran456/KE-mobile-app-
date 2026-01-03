"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, ArrowRight, Book, Clock, Calendar, Target, Plus, X, Loader2, GraduationCap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "sonner"

const steps = [
  { id: 1, title: "Your Subjects", icon: Book },
  { id: 2, title: "Study Hours", icon: Clock },
  { id: 3, title: "Exam Dates", icon: Calendar },
  { id: 4, title: "Your Goals", icon: Target },
]

const popularSubjects = [
  "Mathematics", "Physics", "Chemistry", "Biology", 
  "Computer Science", "English", "History", "Economics",
  "Accounting", "Business Studies", "Psychology", "Statistics"
]

export default function ProfileSetupPage() {
  const router = useRouter()
  const { user, profile, updateUserProfile, loading: authLoading } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  
  const [subjects, setSubjects] = useState<string[]>([])
  const [customSubject, setCustomSubject] = useState("")
  const [studyHours, setStudyHours] = useState(3)
  const [examDates, setExamDates] = useState<{ subject: string; date: string }[]>([])
  const [goals, setGoals] = useState<string[]>([])

  const goalOptions = [
    "Improve grades",
    "Better time management",
    "Reduce study stress",
    "Prepare for exams",
    "Learn new subjects",
    "Build study habits",
  ]

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login")
      return
    }

    // Pre-fill with existing profile data if available
    if (profile) {
      if (profile.subjects?.length) setSubjects(profile.subjects)
      if (profile.studyHoursPerDay) setStudyHours(profile.studyHoursPerDay)
      if (profile.examDates?.length) setExamDates(profile.examDates)
      if (profile.goals?.length) setGoals(profile.goals)
    }
  }, [user, profile, authLoading, router])

  const addSubject = (subject: string) => {
    if (!subjects.includes(subject) && subjects.length < 8) {
      setSubjects([...subjects, subject])
    }
  }

  const removeSubject = (subject: string) => {
    setSubjects(subjects.filter(s => s !== subject))
    setExamDates(examDates.filter(e => e.subject !== subject))
  }

  const addCustomSubject = () => {
    if (customSubject.trim() && !subjects.includes(customSubject.trim())) {
      addSubject(customSubject.trim())
      setCustomSubject("")
    }
  }

  const updateExamDate = (subject: string, date: string) => {
    const existing = examDates.find(e => e.subject === subject)
    if (existing) {
      setExamDates(examDates.map(e => e.subject === subject ? { ...e, date } : e))
    } else {
      setExamDates([...examDates, { subject, date }])
    }
  }

  const toggleGoal = (goal: string) => {
    if (goals.includes(goal)) {
      setGoals(goals.filter(g => g !== goal))
    } else {
      setGoals([...goals, goal])
    }
  }

  const handleComplete = async () => {
    if (!user) return
    setLoading(true)

    try {
      await updateUserProfile({
        subjects,
        studyHoursPerDay: studyHours,
        examDates,
        goals,
        profileComplete: true,
      })
      
      toast.success("Profile setup complete! 🎉")
      router.push("/home")
    } catch (error) {
      console.error("Error saving profile:", error)
      toast.error("Failed to save profile. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1: return subjects.length > 0
      case 2: return studyHours > 0
      case 3: return true
      case 4: return goals.length > 0
      default: return false
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0a0f14] to-[#111820]">
        <div className="w-12 h-12 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#0a0f14] to-[#111820]">
      {/* Header */}
      <div className="p-4 safe-top">
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : router.back()}
            className="w-10 h-10 rounded-xl bg-gray-800/50 flex items-center justify-center text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-cyan-400" />
            <span className="text-gray-400 text-sm">Step {currentStep} of 4</span>
          </div>
        </div>

        {/* Progress */}
        <div className="flex gap-2">
          {steps.map((step) => (
            <div 
              key={step.id}
              className={`flex-1 h-1.5 rounded-full transition-all ${
                step.id <= currentStep ? "bg-cyan-500" : "bg-gray-700"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-4 overflow-y-auto">
        {/* Step 1: Subjects */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">What are your subjects?</h1>
              <p className="text-gray-400">Select the subjects you want to study</p>
            </div>

            {/* Selected Subjects */}
            {subjects.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {subjects.map((subject) => (
                  <div 
                    key={subject}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-cyan-500/20 border border-cyan-500/30"
                  >
                    <span className="text-cyan-400 text-sm font-medium">{subject}</span>
                    <button onClick={() => removeSubject(subject)}>
                      <X className="w-4 h-4 text-cyan-400/60 hover:text-cyan-400" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Custom Subject Input */}
            <div className="flex gap-2">
              <Input
                placeholder="Add custom subject..."
                value={customSubject}
                onChange={(e) => setCustomSubject(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addCustomSubject()}
                className="h-12 bg-gray-800/50 border-gray-700 rounded-xl text-white"
              />
              <Button 
                onClick={addCustomSubject}
                className="h-12 px-4 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 rounded-xl"
              >
                <Plus className="w-5 h-5 text-cyan-400" />
              </Button>
            </div>

            {/* Popular Subjects */}
            <div>
              <p className="text-gray-500 text-sm mb-3">Popular Subjects</p>
              <div className="flex flex-wrap gap-2">
                {popularSubjects.map((subject) => (
                  <button
                    key={subject}
                    onClick={() => addSubject(subject)}
                    disabled={subjects.includes(subject)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      subjects.includes(subject)
                        ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                        : "bg-gray-800/50 text-gray-400 border border-gray-700 hover:border-cyan-500/50"
                    }`}
                  >
                    {subject}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Study Hours */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">Daily Study Time</h1>
              <p className="text-gray-400">How many hours can you study per day?</p>
            </div>

            <div className="py-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-cyan-500/10 border-2 border-cyan-500/30">
                  <div>
                    <span className="text-5xl font-bold text-cyan-400">{studyHours}</span>
                    <p className="text-gray-400 text-sm">hours/day</p>
                  </div>
                </div>
              </div>

              <input
                type="range"
                min="1"
                max="12"
                value={studyHours}
                onChange={(e) => setStudyHours(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
              <div className="flex justify-between text-gray-500 text-sm mt-2">
                <span>1 hour</span>
                <span>12 hours</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[2, 4, 6].map((hours) => (
                <button
                  key={hours}
                  onClick={() => setStudyHours(hours)}
                  className={`p-4 rounded-xl border transition-all ${
                    studyHours === hours
                      ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-400"
                      : "bg-gray-800/50 border-gray-700 text-gray-400 hover:border-cyan-500/30"
                  }`}
                >
                  <div className="text-2xl font-bold">{hours}h</div>
                  <div className="text-xs opacity-60">
                    {hours <= 2 ? "Light" : hours <= 4 ? "Moderate" : "Intense"}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Exam Dates */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">Exam Schedule</h1>
              <p className="text-gray-400">When are your exams? (Optional)</p>
            </div>

            <div className="space-y-3">
              {subjects.map((subject) => {
                const examDate = examDates.find(e => e.subject === subject)
                return (
                  <div 
                    key={subject}
                    className="p-4 rounded-xl bg-gray-800/50 border border-gray-700"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                          <Book className="w-5 h-5 text-cyan-400" />
                        </div>
                        <span className="text-white font-medium">{subject}</span>
                      </div>
                    </div>
                    <div className="mt-3">
                      <Input
                        type="date"
                        value={examDate?.date || ""}
                        onChange={(e) => updateExamDate(subject, e.target.value)}
                        className="h-12 bg-gray-900/50 border-gray-600 rounded-xl text-white"
                      />
                    </div>
                  </div>
                )
              })}
            </div>

            {subjects.length === 0 && (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500">No subjects added yet</p>
              </div>
            )}
          </div>
        )}

        {/* Step 4: Goals */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">Your Study Goals</h1>
              <p className="text-gray-400">What do you want to achieve?</p>
            </div>

            <div className="space-y-3">
              {goalOptions.map((goal) => (
                <button
                  key={goal}
                  onClick={() => toggleGoal(goal)}
                  className={`w-full p-4 rounded-xl border text-left flex items-center gap-4 transition-all ${
                    goals.includes(goal)
                      ? "bg-cyan-500/20 border-cyan-500/50"
                      : "bg-gray-800/50 border-gray-700 hover:border-cyan-500/30"
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    goals.includes(goal) ? "border-cyan-400 bg-cyan-400" : "border-gray-500"
                  }`}>
                    {goals.includes(goal) && (
                      <svg className="w-4 h-4 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <span className={goals.includes(goal) ? "text-cyan-400" : "text-gray-300"}>
                    {goal}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom */}
      <div className="p-6 safe-bottom">
        <Button
          onClick={() => {
            if (currentStep < 4) {
              setCurrentStep(currentStep + 1)
            } else {
              handleComplete()
            }
          }}
          disabled={!canProceed() || loading}
          className="w-full h-14 bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 text-gray-900 font-semibold text-lg rounded-xl glow-cyan transition-all disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : currentStep < 4 ? (
            <>
              Continue
              <ArrowRight className="w-5 h-5 ml-2" />
            </>
          ) : (
            "Complete Setup"
          )}
        </Button>
      </div>
    </div>
  )
}
