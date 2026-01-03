"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Send, Loader2, Bot, User, Sparkles, Trash2, Brain } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import { saveChat, getChatHistory, clearChatHistory } from "@/lib/firestore"
import openai from "@/lib/openai"
import { toast } from "sonner"
import BottomNav from "@/components/bottom-nav"
import Loading from "@/components/loading"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

const quickPrompts = [
  { text: "Explain a topic", prompt: "Can you explain " },
  { text: "Study tips", prompt: "Give me study tips for " },
  { text: "Summarize", prompt: "Summarize this: " },
]

export default function AssistantPage() {
  const router = useRouter()
  const { user, profile, loading: authLoading } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login")
      return
    }
    if (user) loadChatHistory()
  }, [user, authLoading, router])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const loadChatHistory = async () => {
    if (!user) return
    try {
      const history = await getChatHistory(user.uid)
      if (history.length > 0) {
        setMessages(history.map(m => ({ ...m, timestamp: new Date(m.createdAt) })))
      } else {
        setMessages([{
          id: "1",
          role: "assistant",
          content: `Hi ${profile?.name?.split(" ")[0] || "there"}! 👋 I'm your AI Study Assistant. How can I help you learn today?`,
          timestamp: new Date(),
        }])
      }
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setInitialLoading(false)
    }
  }

  const handleClearChat = async () => {
    if (!user) return
    try {
      await clearChatHistory(user.uid)
      setMessages([{
        id: Date.now().toString(),
        role: "assistant",
        content: "Chat cleared! How can I help? 📚",
        timestamp: new Date(),
      }])
      toast.success("Cleared")
    } catch (error) {
      toast.error("Failed")
    }
  }

  const sendMessage = async () => {
    if (!input.trim() || loading || !user) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    }

    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInput("")
    setLoading(true)

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are StudyGenie, a friendly AI study assistant. Student: ${profile?.name || "Student"}. Subjects: ${profile?.subjects?.join(", ") || "General"}. Be concise, helpful, and encouraging. Use emojis sparingly.`
          },
          ...messages.slice(-8).map(m => ({ role: m.role as "user" | "assistant", content: m.content })),
          { role: "user", content: userMessage.content }
        ],
        max_tokens: 800,
        temperature: 0.7,
      })

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.choices[0].message.content || "Sorry, I couldn't respond.",
        timestamp: new Date(),
      }

      const finalMessages = [...updatedMessages, assistantMessage]
      setMessages(finalMessages)
      await saveChat(user.uid, finalMessages.map(m => ({
        id: m.id, userId: user.uid, role: m.role, content: m.content, createdAt: m.timestamp.toISOString(),
      })))
    } catch (error) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Connection error. Please try again. 🔌",
        timestamp: new Date(),
      }])
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || initialLoading) {
    return <Loading />
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0f14]">
      {/* Header */}
      <div className="px-4 pt-3 pb-2 safe-top border-b border-gray-800/50 bg-[#0a0f14]/95 backdrop-blur-xl sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/home">
              <motion.div 
                whileTap={{ scale: 0.9 }}
                className="w-9 h-9 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50 flex items-center justify-center text-gray-400 shadow-lg"
              >
                <ArrowLeft className="w-4 h-4" />
              </motion.div>
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white text-sm font-semibold">AI Assistant</p>
                <p className="text-green-400 text-[10px] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                  Online
                </p>
              </div>
            </div>
          </div>
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={handleClearChat} 
            className="w-9 h-9 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50 flex items-center justify-center text-gray-400 shadow-lg"
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 pb-36">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-2 mb-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md ${
                message.role === "assistant" 
                  ? "bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 border border-cyan-500/30" 
                  : "bg-gradient-to-br from-gray-700 to-gray-800"
              }`}>
                {message.role === "assistant" ? <Bot className="w-4 h-4 text-cyan-400" /> : <User className="w-4 h-4 text-gray-300" />}
              </div>
              <div className={`max-w-[80%] ${message.role === "user" ? "text-right" : ""}`}>
                <div className={`p-3 rounded-2xl text-sm shadow-lg ${
                  message.role === "assistant"
                    ? "bg-gradient-to-br from-gray-800/60 to-gray-900/60 border border-gray-700/50 rounded-tl-md text-gray-200"
                    : "bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 border border-cyan-500/30 rounded-tr-md text-white"
                }`}>
                  <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                </div>
                <p className="text-gray-600 text-[10px] mt-0.5 px-1">
                  {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <div className="flex gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 border border-cyan-500/30 flex items-center justify-center shadow-md">
              <Bot className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 border border-gray-700/50 rounded-2xl rounded-tl-md p-3 shadow-lg">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 150}ms` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      {messages.length <= 2 && (
        <div className="px-4 pb-2">
          <div className="flex items-center gap-1 mb-1.5">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span className="text-gray-500 text-[10px]">Quick prompts</span>
          </div>
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
            {quickPrompts.map((p, i) => (
              <motion.button
                key={i}
                whileTap={{ scale: 0.95 }}
                onClick={() => setInput(p.prompt)}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 text-gray-400 text-xs whitespace-nowrap shadow-md"
              >
                {p.text}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="fixed bottom-16 left-0 right-0 p-3 bg-gradient-to-t from-[#0a0f14] via-[#0a0f14] to-transparent">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
            placeholder="Ask anything..."
            className="flex-1 h-12 px-4 bg-gradient-to-br from-gray-800/60 to-gray-900/60 border border-gray-700/50 rounded-xl text-white text-sm placeholder:text-gray-500 focus:border-cyan-500/50 focus:outline-none shadow-lg"
            disabled={loading}
          />
          <motion.div whileTap={{ scale: 0.9 }}>
            <Button
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              className="h-12 w-12 bg-gradient-to-br from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 rounded-xl p-0 shadow-lg shadow-cyan-500/30"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin text-white" /> : <Send className="w-5 h-5 text-white" />}
            </Button>
          </motion.div>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
