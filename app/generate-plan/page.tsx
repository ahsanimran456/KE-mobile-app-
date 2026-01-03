"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { 
  ArrowLeft, Sparkles, Loader2, Calendar, Clock, 
  Book, Target, CheckCircle, Brain, BookOpen
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import { createMultipleTasks, Task } from "@/lib/firestore"
import openai from "@/lib/openai"
import { toast } from "sonner"

interface GeneratedTask {
  title: string
  subject: string
  duration: number
  time: string
  priority: "high" | "medium" | "low"
  lectureTitle: string
  lectureContent: string
}

export default function GeneratePlanPage() {
  const router = useRouter()
  const { user, profile, loading: authLoading } = useAuth()
  const [generating, setGenerating] = useState(false)
  const [generatedTasks, setGeneratedTasks] = useState<GeneratedTask[]>([])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const today = new Date().toISOString().split("T")[0]

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login")
    }
  }, [user, authLoading, router])

  const generatePlan = async () => {
    if (!profile) {
      toast.error("Please complete your profile first")
      return
    }
    
    if (!profile.subjects?.length) {
      toast.error("Please add subjects to your profile")
      router.push("/profile-setup")
      return
    }

    setGenerating(true)

    try {
      const prompt = `Create a daily study plan with lecture content for a university student:

Student Info:
- Subjects: ${profile.subjects.join(", ")}
- Available study time: ${profile.studyHoursPerDay} hours per day
- Goals: ${profile.goals?.join(", ") || "General improvement"}
- Exam dates: ${profile.examDates?.map(e => `${e.subject}: ${e.date}`).join(", ") || "Not specified"}

Generate a JSON array of ${Math.min(Math.floor(profile.studyHoursPerDay * 1.2), 6)} study tasks. Each task MUST include:
- title: task name (e.g., "Learn Calculus - Derivatives")
- subject: subject name from the list
- duration: minutes (30, 45, or 60)
- time: start time in HH:MM (24h), starting from 09:00
- priority: "high", "medium", or "low"
- lectureTitle: a catchy lecture title for this topic
- lectureContent: A detailed educational lecture (300-500 words) explaining the topic. Include:
  * Introduction to the concept
  * Key points and explanations
  * Examples where relevant
  * Summary/key takeaways
  * Tips for remembering

Make lectures engaging, easy to understand, and suitable for university students.

Return ONLY valid JSON array:
[{"title":"...", "subject":"...", "duration":45, "time":"09:00", "priority":"high", "lectureTitle":"...", "lectureContent":"..."}]`

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are an expert educational content creator and study planner. Create detailed, engaging lectures that help students understand concepts easily. Return only valid JSON."
          },
          { role: "user", content: prompt }
        ],
        max_tokens: 4000,
        temperature: 0.7,
      })

      const content = response.choices[0].message.content || "[]"
      const jsonMatch = content.match(/\[[\s\S]*\]/)
      
      if (jsonMatch) {
        const tasks = JSON.parse(jsonMatch[0]) as GeneratedTask[]
        setGeneratedTasks(tasks)
        toast.success("Study plan with lectures generated!")
      } else {
        throw new Error("Invalid response format")
      }
    } catch (error) {
      console.error("Error generating plan:", error)
      toast.error("Failed to generate plan. Using sample tasks.")
      
      const subjects = profile.subjects || ["General Study"]
      setGeneratedTasks([
        { 
          title: "Introduction to the Topic", 
          subject: subjects[0], 
          duration: 45, 
          time: "09:00", 
          priority: "high",
          lectureTitle: "Getting Started with " + subjects[0],
          lectureContent: `Welcome to today's lesson on ${subjects[0]}!\n\n**Introduction**\nToday we'll explore the fundamental concepts that form the foundation of this subject. Understanding these basics is crucial for your academic success.\n\n**Key Points**\n1. Start with the core definitions and terminology\n2. Understand the historical context and why this matters\n3. Learn the practical applications\n\n**Main Content**\nThis subject is essential because it helps you develop critical thinking skills. The concepts we learn here apply to many real-world situations.\n\nWhen studying, try to:\n- Connect new information to what you already know\n- Practice with examples\n- Review regularly\n\n**Summary**\nRemember: consistent practice is key. Take notes, ask questions, and don't be afraid to revisit topics you find challenging.\n\n**Tips for Success**\n- Study in focused 25-minute blocks\n- Take short breaks between sessions\n- Teach concepts to others to reinforce learning`
        },
        { 
          title: "Practice Problems", 
          subject: subjects[Math.min(1, subjects.length - 1)], 
          duration: 60, 
          time: "10:00", 
          priority: "medium",
          lectureTitle: "Problem-Solving Techniques",
          lectureContent: `Welcome to our problem-solving session!\n\n**Introduction**\nPractice is the bridge between learning and mastery. Today, we'll work through problems step by step.\n\n**Problem-Solving Framework**\n1. **Read Carefully**: Understand what's being asked\n2. **Identify Given Information**: List what you know\n3. **Plan Your Approach**: Choose the right method\n4. **Execute**: Work through systematically\n5. **Check**: Verify your answer makes sense\n\n**Key Strategies**\n- Break complex problems into smaller parts\n- Draw diagrams when helpful\n- Show all your work\n- Double-check calculations\n\n**Common Mistakes to Avoid**\n- Rushing through without reading carefully\n- Skipping steps\n- Not checking your work\n\n**Practice Tips**\n- Start with easier problems and progress to harder ones\n- Time yourself to build speed\n- Review mistakes to learn from them\n\n**Summary**\nProblem-solving is a skill that improves with practice. Be patient with yourself and celebrate small wins!`
        },
        { 
          title: "Chapter Review", 
          subject: subjects[0], 
          duration: 30, 
          time: "11:30", 
          priority: "low",
          lectureTitle: "Review & Consolidation",
          lectureContent: `Time to consolidate what we've learned!\n\n**Why Review Matters**\nResearch shows that regular review helps move information from short-term to long-term memory. This is called spaced repetition.\n\n**Review Checklist**\n✓ Key definitions and terms\n✓ Main concepts and theories\n✓ Important formulas or frameworks\n✓ Connections between topics\n\n**Active Review Techniques**\n1. **Self-Testing**: Quiz yourself without looking at notes\n2. **Summarization**: Write brief summaries in your own words\n3. **Teaching**: Explain concepts as if teaching someone else\n4. **Mind Mapping**: Create visual connections\n\n**What to Focus On**\n- Areas where you felt uncertain\n- Topics likely to appear in exams\n- Foundational concepts that support other learning\n\n**Moving Forward**\nAfter this review:\n- Note any gaps in understanding\n- Plan to revisit challenging topics\n- Connect today's learning to upcoming material\n\n**Remember**\nReview isn't about memorizing—it's about understanding deeply!`
        },
      ])
    } finally {
      setGenerating(false)
    }
  }

  const savePlan = async () => {
    if (!user || generatedTasks.length === 0) return
    
    setSaving(true)

    try {
      const tasksToCreate: Omit<Task, "id">[] = generatedTasks.map(task => ({
        userId: user.uid,
        title: task.title,
        subject: task.subject,
        duration: task.duration,
        time: task.time,
        priority: task.priority,
        completed: false,
        date: today,
        createdAt: new Date().toISOString(),
        // Lecture content
        hasLecture: true,
        lectureTitle: task.lectureTitle,
        lectureContent: task.lectureContent,
        lectureRead: false,
      }))

      await createMultipleTasks(tasksToCreate)
      
      setSaved(true)
      toast.success("Study plan with lectures saved!")
      setTimeout(() => router.push("/tasks"), 1500)
    } catch (error) {
      console.error("Error saving plan:", error)
      toast.error("Failed to save plan")
    } finally {
      setSaving(false)
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
    <div className="min-h-screen bg-gradient-to-b from-[#0a0f14] to-[#111820]">
      {/* Header */}
      <div className="p-4 safe-top">
        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={() => router.back()}
            className="w-10 h-10 rounded-xl bg-gray-800/50 flex items-center justify-center text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-white">AI Study Plan</h1>
            <p className="text-gray-400 text-sm">Generate plan with AI lectures</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-8">
        {generatedTasks.length === 0 ? (
          <>
            {/* Info Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 mb-6">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 flex items-center justify-center">
                  <Brain className="w-8 h-8 text-cyan-400" />
                </div>
              </div>
              <h2 className="text-xl font-bold text-white text-center mb-2">
                AI-Powered Learning
              </h2>
              <p className="text-gray-400 text-center text-sm">
                Our AI will create a personalized study plan with detailed lectures for each topic. Click on any task to read the AI-generated lesson!
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="p-4 rounded-xl bg-gray-800/30 border border-gray-700/50">
                <BookOpen className="w-6 h-6 text-cyan-400 mb-2" />
                <p className="text-white text-sm font-medium">AI Lectures</p>
                <p className="text-gray-500 text-xs">Detailed content for each task</p>
              </div>
              <div className="p-4 rounded-xl bg-gray-800/30 border border-gray-700/50">
                <Target className="w-6 h-6 text-green-400 mb-2" />
                <p className="text-white text-sm font-medium">Track Progress</p>
                <p className="text-gray-500 text-xs">Mark as read when done</p>
              </div>
            </div>

            {/* Profile Summary */}
            {profile && (
              <div className="space-y-3 mb-6">
                <div className="p-4 rounded-xl bg-gray-800/30 border border-gray-700/50 flex items-center gap-3">
                  <Book className="w-5 h-5 text-cyan-400" />
                  <div>
                    <p className="text-gray-400 text-sm">Subjects</p>
                    <p className="text-white">{profile.subjects?.join(", ") || "Not set"}</p>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-gray-800/30 border border-gray-700/50 flex items-center gap-3">
                  <Clock className="w-5 h-5 text-cyan-400" />
                  <div>
                    <p className="text-gray-400 text-sm">Daily Study Time</p>
                    <p className="text-white">{profile.studyHoursPerDay || 0} hours</p>
                  </div>
                </div>
              </div>
            )}

            {/* Generate Button */}
            <Button
              onClick={generatePlan}
              disabled={generating}
              className="w-full h-14 bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 text-gray-900 font-semibold text-lg rounded-xl glow-cyan"
            >
              {generating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Generating Lectures...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate Study Plan
                </>
              )}
            </Button>
          </>
        ) : (
          <>
            {/* Generated Tasks */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-white font-medium">Plan Generated!</span>
              </div>
              
              <p className="text-gray-400 text-sm mb-4">
                {generatedTasks.length} tasks with AI lectures. Tap any task to preview the lecture content.
              </p>

              <div className="space-y-3">
                {generatedTasks.map((task, index) => (
                  <div 
                    key={index}
                    className="p-4 rounded-xl bg-gray-800/30 border border-gray-700/50"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                            task.priority === "high" ? "bg-red-500/20 text-red-400" :
                            task.priority === "medium" ? "bg-yellow-500/20 text-yellow-400" :
                            "bg-green-500/20 text-green-400"
                          }`}>
                            {task.priority}
                          </span>
                          <span className="px-2 py-0.5 rounded text-xs font-medium bg-cyan-500/20 text-cyan-400 flex items-center gap-1">
                            <BookOpen className="w-3 h-3" />
                            Has Lecture
                          </span>
                        </div>
                        <h3 className="text-white font-medium">{task.title}</h3>
                        <p className="text-cyan-400 text-xs mt-1">{task.lectureTitle}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-gray-500 text-xs flex items-center gap-1">
                            <Book className="w-3 h-3" />
                            {task.subject}
                          </span>
                          <span className="text-gray-500 text-xs flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {task.duration} min
                          </span>
                        </div>
                      </div>
                      <span className="text-gray-400 text-sm">{task.time}</span>
                    </div>
                    
                    {/* Preview */}
                    <div className="mt-3 p-3 rounded-lg bg-gray-900/50 border border-gray-700/30">
                      <p className="text-gray-400 text-xs line-clamp-2">
                        {task.lectureContent.substring(0, 150)}...
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total Time */}
              <div className="mt-4 p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                <p className="text-cyan-400 text-sm text-center">
                  Total: {generatedTasks.length} lectures • {Math.round(generatedTasks.reduce((acc, t) => acc + t.duration, 0) / 60 * 10) / 10} hours
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={() => setGeneratedTasks([])}
                variant="outline"
                className="flex-1 h-12 bg-gray-800/50 border-gray-700 text-gray-300 rounded-xl"
              >
                Regenerate
              </Button>
              <Button
                onClick={savePlan}
                disabled={saving || saved}
                className="flex-1 h-12 bg-gradient-to-r from-cyan-500 to-cyan-400 text-gray-900 font-semibold rounded-xl"
              >
                {saving ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : saved ? (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Saved!
                  </>
                ) : (
                  "Save Plan"
                )}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
