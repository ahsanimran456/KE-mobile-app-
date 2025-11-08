"use client"

import { useRouter } from "next/navigation"
import { X, User, Settings, HelpCircle, FileText, Shield, LogOut } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useEffect } from "react"

interface SidebarProps {
  open: boolean
  onClose: () => void
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const router = useRouter()

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [open])

  const handleNavigate = (path: string) => {
    onClose()
    router.push(path)
  }

  if (!open) return null

  return (
    <>
      <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm" onClick={onClose}></div>

      <div className="fixed left-0 top-0 bottom-0 z-[70] w-80 bg-card shadow-2xl animate-in slide-in-from-left">
        <div className="flex h-full flex-col">
          <div className="bg-primary p-6 text-primary-foreground">
            <div className="flex items-start justify-between mb-4">
              <Avatar className="h-16 w-16 border-2 border-primary-foreground/20">
                <AvatarFallback className="bg-primary-foreground/10 text-xl font-bold text-primary-foreground">
                  MA
                </AvatarFallback>
              </Avatar>
              <Button variant="ghost" size="icon" onClick={onClose} className="text-primary-foreground">
                <X className="h-6 w-6" />
              </Button>
            </div>
            <h2 className="text-lg font-bold">Muhammad Ahsan</h2>
            <p className="text-sm text-primary-foreground/80">CSC-23s-289</p>
            <p className="text-xs text-primary-foreground/70 mt-1">m.ahsan@example.com</p>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <nav className="space-y-1">
              <button
                onClick={() => handleNavigate("/account")}
                className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left hover:bg-accent transition-colors"
              >
                <User className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">My Profile</span>
              </button>

              <button
                onClick={() => handleNavigate("/billing")}
                className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left hover:bg-accent transition-colors"
              >
                <FileText className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">Billing History</span>
              </button>

              <div className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-muted-foreground/60 cursor-default">
                <Settings className="h-5 w-5" />
                <span className="font-medium">Settings</span>
              </div>

              <div className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-muted-foreground/60 cursor-default">
                <Shield className="h-5 w-5" />
                <span className="font-medium">Privacy & Security</span>
              </div>

              <div className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-muted-foreground/60 cursor-default">
                <HelpCircle className="h-5 w-5" />
                <span className="font-medium">Help & Support</span>
              </div>
            </nav>
          </div>

          <div className="border-t border-border p-4">
            <button
              onClick={() => {
                onClose()
                router.push("/")
              }}
              className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span className="font-medium">Log Out</span>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
