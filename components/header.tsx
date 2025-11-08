"use client"

import { Menu, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HeaderProps {
  title: string
  onMenuClick: () => void
  onNotificationClick: () => void
}

export function Header({ title, onMenuClick, onNotificationClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between bg-primary px-4 py-3 text-primary-foreground shadow-md">
      <Button
        variant="ghost"
        size="icon"
        className="text-primary-foreground hover:bg-primary-foreground/10"
        onClick={onMenuClick}
      >
        <Menu className="h-6 w-6" />
      </Button>
      <h1 className="text-lg font-bold tracking-wide">{title}</h1>
      <Button
        variant="ghost"
        size="icon"
        className="relative text-primary-foreground hover:bg-primary-foreground/10"
        onClick={onNotificationClick}
      >
        <Bell className="h-6 w-6" />
        <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500"></span>
      </Button>
    </header>
  )
}
