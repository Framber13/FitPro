"use client"

import { useState, useEffect } from "react"
import type { AppView } from "@/lib/types"
import { getProfile } from "@/lib/store"
import { BottomNav } from "./bottom-nav"
import { Dashboard } from "./modules/dashboard"
import { ProfileModule } from "./modules/profile-module"
import { MeasurementsModule } from "./modules/measurements-module"
import { RoutinesModule } from "./modules/routines-module"
import { NutritionModule } from "./modules/nutrition-module"
import { ProjectionsModule } from "./modules/projections-module"
import { SupplementsModule } from "./modules/supplements-module"
import { HelpModule } from "./modules/help-module"
import { OnboardingFlow } from "./modules/onboarding-flow"
import {
  Dumbbell,
} from "lucide-react"

export function AppShell() {
  const [currentView, setCurrentView] = useState<AppView>("dashboard")
  const [hasProfile, setHasProfile] = useState<boolean | null>(null)

  useEffect(() => {
    const profile = getProfile()
    setHasProfile(!!profile)
  }, [])

  const handleProfileComplete = () => {
    setHasProfile(true)
    setCurrentView("dashboard")
  }

  // Loading state
  if (hasProfile === null) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Dumbbell className="h-12 w-12 text-primary animate-pulse" />
          <p className="text-muted-foreground font-sans">Cargando...</p>
        </div>
      </div>
    )
  }

  // Onboarding for new users
  if (!hasProfile) {
    return <OnboardingFlow onComplete={handleProfileComplete} />
  }

  const renderView = () => {
    switch (currentView) {
      case "dashboard":
        return <Dashboard onNavigate={setCurrentView} />
      case "profile":
        return <ProfileModule onNavigate={setCurrentView} />
      case "measurements":
        return <MeasurementsModule />
      case "routines":
        return <RoutinesModule />
      case "nutrition":
        return <NutritionModule />
      case "projections":
        return <ProjectionsModule />
      case "supplements":
        return <SupplementsModule />
      case "help":
        return <HelpModule />
      default:
        return <Dashboard onNavigate={setCurrentView} />
    }
  }

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <main className="flex-1 pb-20 overflow-y-auto">
        {renderView()}
      </main>
      <BottomNav current={currentView} onChange={setCurrentView} />
    </div>
  )
}
