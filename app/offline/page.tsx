import Link from "next/link"
import { WifiOff } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function OfflinePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="text-center">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-muted p-6">
            <WifiOff className="h-16 w-16 text-muted-foreground" />
          </div>
        </div>
        <h1 className="mb-2 text-2xl font-bold text-foreground">You're Offline</h1>
        <p className="mb-6 text-muted-foreground">Check your internet connection and try again</p>
        <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Link href="/">Try Again</Link>
        </Button>
      </div>
    </div>
  )
}
