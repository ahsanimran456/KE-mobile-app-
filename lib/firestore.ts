// Firestore Database Service - Complete CRUD Operations

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  limit,
  onSnapshot,
  increment,
  arrayUnion,
  writeBatch,
} from "firebase/firestore"
import { db } from "./firebase"

// ==================== TYPES ====================

export interface Task {
  id?: string
  userId: string
  title: string
  subject: string
  duration: number
  time: string
  date: string
  completed: boolean
  priority: "high" | "medium" | "low"
  createdAt: string
  completedAt?: string
  // New lecture fields
  lectureContent?: string
  lectureTitle?: string
  hasLecture?: boolean
  lectureRead?: boolean
}

export interface StudySession {
  id?: string
  userId: string
  subject: string
  duration: number
  date: string
  startTime: string
  endTime: string
  notes?: string
  createdAt: string
}

export interface ChatMessage {
  id?: string
  userId: string
  role: "user" | "assistant"
  content: string
  createdAt: string
}

export interface StudyPlan {
  id?: string
  userId: string
  date: string
  tasks: Task[]
  generatedBy: "ai" | "manual"
  createdAt: string
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlockedAt?: string
}

// ==================== USER OPERATIONS ====================

export const getUserProfile = async (userId: string) => {
  const docRef = doc(db, "users", userId)
  const docSnap = await getDoc(docRef)
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null
}

export const updateUserProfile = async (userId: string, data: Record<string, unknown>) => {
  const docRef = doc(db, "users", userId)
  await updateDoc(docRef, {
    ...data,
    updatedAt: new Date().toISOString(),
  })
}

export const incrementUserStats = async (
  userId: string,
  stats: { xp?: number; tasksCompleted?: number; totalStudyHours?: number }
) => {
  const docRef = doc(db, "users", userId)
  const updates: Record<string, unknown> = {}
  
  if (stats.xp) updates.xp = increment(stats.xp)
  if (stats.tasksCompleted) updates.tasksCompleted = increment(stats.tasksCompleted)
  if (stats.totalStudyHours) updates.totalStudyHours = increment(stats.totalStudyHours)
  
  await updateDoc(docRef, updates)
}

// ==================== TASK OPERATIONS ====================

export const createTask = async (task: Omit<Task, "id">) => {
  const docRef = await addDoc(collection(db, "tasks"), {
    ...task,
    createdAt: new Date().toISOString(),
  })
  return docRef.id
}

export const getTask = async (taskId: string) => {
  const docRef = doc(db, "tasks", taskId)
  const docSnap = await getDoc(docRef)
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Task : null
}

export const getTasks = async (userId: string, date?: string) => {
  const q = query(
    collection(db, "tasks"),
    where("userId", "==", userId)
  )

  const snapshot = await getDocs(q)
  let tasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task))
  
  if (date) {
    tasks = tasks.filter(t => t.date === date)
  }
  
  return tasks.sort((a, b) => a.time.localeCompare(b.time))
}

export const getTasksByDateRange = async (userId: string, startDate: string, endDate: string) => {
  const q = query(
    collection(db, "tasks"),
    where("userId", "==", userId)
  )

  const snapshot = await getDocs(q)
  const tasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task))
  
  return tasks
    .filter(t => t.date >= startDate && t.date <= endDate)
    .sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date)
      return a.time.localeCompare(b.time)
    })
}

export const updateTask = async (taskId: string, data: Partial<Task>) => {
  const docRef = doc(db, "tasks", taskId)
  await updateDoc(docRef, data)
}

export const completeTask = async (taskId: string, userId: string) => {
  const docRef = doc(db, "tasks", taskId)
  await updateDoc(docRef, {
    completed: true,
    completedAt: new Date().toISOString(),
  })
  
  await incrementUserStats(userId, { xp: 10, tasksCompleted: 1 })
}

export const markLectureRead = async (taskId: string, userId: string) => {
  const docRef = doc(db, "tasks", taskId)
  await updateDoc(docRef, {
    lectureRead: true,
    completed: true,
    completedAt: new Date().toISOString(),
  })
  
  // Give XP for reading lecture
  await incrementUserStats(userId, { xp: 15, tasksCompleted: 1 })
}

export const uncompleteTask = async (taskId: string) => {
  const docRef = doc(db, "tasks", taskId)
  await updateDoc(docRef, {
    completed: false,
    lectureRead: false,
    completedAt: null,
  })
}

export const deleteTask = async (taskId: string) => {
  const docRef = doc(db, "tasks", taskId)
  await deleteDoc(docRef)
}

export const createMultipleTasks = async (tasks: Omit<Task, "id">[]) => {
  const batch = writeBatch(db)
  const taskIds: string[] = []

  tasks.forEach(task => {
    const docRef = doc(collection(db, "tasks"))
    batch.set(docRef, {
      ...task,
      createdAt: new Date().toISOString(),
    })
    taskIds.push(docRef.id)
  })

  await batch.commit()
  return taskIds
}

// Real-time task listener
export const subscribeToTasks = (
  userId: string,
  date: string,
  callback: (tasks: Task[]) => void
) => {
  const q = query(
    collection(db, "tasks"),
    where("userId", "==", userId)
  )

  return onSnapshot(q, (snapshot) => {
    const allTasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task))
    const filteredTasks = allTasks
      .filter(t => t.date === date)
      .sort((a, b) => a.time.localeCompare(b.time))
    callback(filteredTasks)
  })
}

// ==================== STUDY SESSION OPERATIONS ====================

export const createStudySession = async (session: Omit<StudySession, "id">) => {
  const docRef = await addDoc(collection(db, "studySessions"), {
    ...session,
    createdAt: new Date().toISOString(),
  })
  
  await incrementUserStats(session.userId, {
    totalStudyHours: session.duration / 60,
    xp: Math.floor(session.duration / 5),
  })
  
  return docRef.id
}

export const getStudySessions = async (userId: string, days: number = 7) => {
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)
  const startDateStr = startDate.toISOString().split("T")[0]
  
  const q = query(
    collection(db, "studySessions"),
    where("userId", "==", userId)
  )

  const snapshot = await getDocs(q)
  const sessions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as StudySession))
  
  return sessions
    .filter(s => s.date >= startDateStr)
    .sort((a, b) => b.date.localeCompare(a.date))
}

export const getTodayStudyTime = async (userId: string) => {
  const today = new Date().toISOString().split("T")[0]
  
  const q = query(
    collection(db, "studySessions"),
    where("userId", "==", userId)
  )

  const snapshot = await getDocs(q)
  let totalMinutes = 0
  
  snapshot.docs.forEach(doc => {
    const session = doc.data() as StudySession
    if (session.date === today) {
      totalMinutes += session.duration
    }
  })
  
  return totalMinutes
}

// ==================== CHAT OPERATIONS ====================

export const saveChat = async (userId: string, messages: ChatMessage[]) => {
  const docRef = doc(db, "chats", userId)
  await setDoc(docRef, {
    messages,
    updatedAt: new Date().toISOString(),
  }, { merge: true })
}

export const getChatHistory = async (userId: string): Promise<ChatMessage[]> => {
  const docRef = doc(db, "chats", userId)
  const docSnap = await getDoc(docRef)
  
  if (docSnap.exists()) {
    return docSnap.data().messages || []
  }
  return []
}

export const clearChatHistory = async (userId: string) => {
  const docRef = doc(db, "chats", userId)
  await setDoc(docRef, { messages: [], updatedAt: new Date().toISOString() })
}

// ==================== STUDY PLAN OPERATIONS ====================

export const saveStudyPlan = async (plan: Omit<StudyPlan, "id">) => {
  const docRef = await addDoc(collection(db, "studyPlans"), {
    ...plan,
    createdAt: new Date().toISOString(),
  })
  return docRef.id
}

export const getStudyPlans = async (userId: string, limitCount: number = 10) => {
  const q = query(
    collection(db, "studyPlans"),
    where("userId", "==", userId),
    limit(limitCount)
  )

  const snapshot = await getDocs(q)
  const plans = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as StudyPlan))
  
  return plans.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

// ==================== PROGRESS & STATS OPERATIONS ====================

export const getDailyProgress = async (userId: string, date: string) => {
  const tasks = await getTasks(userId, date)
  const completed = tasks.filter(t => t.completed).length
  const total = tasks.length
  
  return {
    completed,
    total,
    percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
  }
}

export const getWeeklyProgress = async (userId: string) => {
  const progress: number[] = []
  const today = new Date()
  
  const allTasks = await getTasks(userId)
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split("T")[0]
    
    const dayTasks = allTasks.filter(t => t.date === dateStr)
    const completed = dayTasks.filter(t => t.completed).length
    const total = dayTasks.length
    
    progress.push(total > 0 ? Math.round((completed / total) * 100) : 0)
  }
  
  return progress
}

export const getSubjectStats = async (userId: string) => {
  const sessions = await getStudySessions(userId, 30)
  const subjectMap: Record<string, number> = {}
  
  sessions.forEach(session => {
    if (!subjectMap[session.subject]) {
      subjectMap[session.subject] = 0
    }
    subjectMap[session.subject] += session.duration
  })
  
  return Object.entries(subjectMap).map(([subject, minutes]) => ({
    subject,
    hours: Math.round(minutes / 60 * 10) / 10,
    minutes,
  }))
}

// ==================== STREAK OPERATIONS ====================

export const updateStreak = async (userId: string) => {
  const userRef = doc(db, "users", userId)
  const userDoc = await getDoc(userRef)
  
  if (!userDoc.exists()) return
  
  const userData = userDoc.data()
  const lastStudyDate = userData.lastStudyDate
  const today = new Date().toISOString().split("T")[0]
  
  if (lastStudyDate === today) {
    return userData.streak
  }
  
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().split("T")[0]
  
  let newStreak = 1
  if (lastStudyDate === yesterdayStr) {
    newStreak = (userData.streak || 0) + 1
  }
  
  await updateDoc(userRef, {
    streak: newStreak,
    lastStudyDate: today,
  })
  
  return newStreak
}

// ==================== ACHIEVEMENTS OPERATIONS ====================

export const checkAndUnlockAchievements = async (userId: string) => {
  const userDoc = await getDoc(doc(db, "users", userId))
  if (!userDoc.exists()) return []
  
  const userData = userDoc.data()
  const unlockedAchievements: Achievement[] = []
  
  const achievements: Achievement[] = [
    { id: "first_task", title: "First Task", description: "Complete your first task", icon: "🎯" },
    { id: "streak_7", title: "On Fire!", description: "7 day study streak", icon: "🔥" },
    { id: "streak_30", title: "Unstoppable", description: "30 day study streak", icon: "⚡" },
    { id: "hours_10", title: "Bookworm", description: "Study for 10 hours total", icon: "📚" },
    { id: "hours_50", title: "Scholar", description: "Study for 50 hours total", icon: "🎓" },
    { id: "tasks_10", title: "Getting Started", description: "Complete 10 tasks", icon: "✅" },
    { id: "tasks_50", title: "Task Master", description: "Complete 50 tasks", icon: "⭐" },
    { id: "tasks_100", title: "Overachiever", description: "Complete 100 tasks", icon: "🏆" },
  ]
  
  const userAchievements = userData.achievements || []
  
  if (!userAchievements.includes("first_task") && userData.tasksCompleted >= 1) {
    unlockedAchievements.push(achievements[0])
  }
  if (!userAchievements.includes("streak_7") && userData.streak >= 7) {
    unlockedAchievements.push(achievements[1])
  }
  if (!userAchievements.includes("streak_30") && userData.streak >= 30) {
    unlockedAchievements.push(achievements[2])
  }
  if (!userAchievements.includes("hours_10") && userData.totalStudyHours >= 10) {
    unlockedAchievements.push(achievements[3])
  }
  if (!userAchievements.includes("hours_50") && userData.totalStudyHours >= 50) {
    unlockedAchievements.push(achievements[4])
  }
  if (!userAchievements.includes("tasks_10") && userData.tasksCompleted >= 10) {
    unlockedAchievements.push(achievements[5])
  }
  if (!userAchievements.includes("tasks_50") && userData.tasksCompleted >= 50) {
    unlockedAchievements.push(achievements[6])
  }
  if (!userAchievements.includes("tasks_100") && userData.tasksCompleted >= 100) {
    unlockedAchievements.push(achievements[7])
  }
  
  if (unlockedAchievements.length > 0) {
    const newAchievementIds = unlockedAchievements.map(a => a.id)
    await updateDoc(doc(db, "users", userId), {
      achievements: arrayUnion(...newAchievementIds),
    })
  }
  
  return unlockedAchievements
}

export const getUserAchievements = async (userId: string) => {
  const userDoc = await getDoc(doc(db, "users", userId))
  if (!userDoc.exists()) return []
  
  const userData = userDoc.data()
  return userData.achievements || []
}
