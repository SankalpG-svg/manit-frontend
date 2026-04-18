import { Moon, Sun } from "lucide-react"
import { useTheme } from "./theme-provider" // Ensure this path matches your file
import { Button } from "@/components/ui/button"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      {/* Sun Icon: Visible in light mode, hidden/rotated in dark mode */}
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-amber-500" />
      
      {/* Moon Icon: Hidden in light mode, visible/rotated in dark mode */}
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-blue-400" />
      
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}