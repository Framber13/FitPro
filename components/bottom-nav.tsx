"use client"

import type { AppView } from "@/lib/types"
import {
  LayoutDashboard,
  Ruler,
  Dumbbell,
  UtensilsCrossed,
  MoreHorizontal,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { TrendingUp, Pill, HelpCircle, User } from "lucide-react"

interface BottomNavProps {
  current: AppView
  onChange: (view: AppView) => void
}

const mainItems: { view: AppView; icon: typeof LayoutDashboard; label: string }[] = [
  { view: "dashboard", icon: LayoutDashboard, label: "Inicio" },
  { view: "measurements", icon: Ruler, label: "Medidas" },
  { view: "routines", icon: Dumbbell, label: "Rutinas" },
  { view: "nutrition", icon: UtensilsCrossed, label: "Nutricion" },
]

const moreItems: { view: AppView; icon: typeof TrendingUp; label: string }[] = [
  { view: "projections", icon: TrendingUp, label: "Proyecciones" },
  { view: "supplements", icon: Pill, label: "Suplementos" },
  { view: "help", icon: HelpCircle, label: "Ayuda" },
  { view: "profile", icon: User, label: "Perfil" },
]

export function BottomNav({ current, onChange }: BottomNavProps) {
  const isMoreActive = moreItems.some((item) => item.view === current)

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-lg items-center justify-around px-2 py-2">
        {mainItems.map((item) => {
          const Icon = item.icon
          const active = current === item.view
          return (
            <button
              key={item.view}
              onClick={() => onChange(item.view)}
              className={cn(
                "flex flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 text-xs transition-colors",
                active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
              aria-label={item.label}
              aria-current={active ? "page" : undefined}
            >
              <Icon className="h-5 w-5" />
              <span className="font-sans">{item.label}</span>
            </button>
          )
        })}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={cn(
                "flex flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 text-xs transition-colors",
                isMoreActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
              aria-label="Mas opciones"
            >
              <MoreHorizontal className="h-5 w-5" />
              <span className="font-sans">Mas</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="top" className="mb-2">
            {moreItems.map((item) => {
              const Icon = item.icon
              return (
                <DropdownMenuItem
                  key={item.view}
                  onClick={() => onChange(item.view)}
                  className={cn(
                    "gap-2",
                    current === item.view && "text-primary"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </DropdownMenuItem>
              )
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  )
}
