"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getProfile, getMeasurements, getWorkoutLogs, getMealLogs } from "@/lib/store"
import { calculateBMI, calculateBMR, calculateTDEE, calculateTargetCalories, calculateMacros, getBMICategory } from "@/lib/fitness-utils"
import type { UserProfile, AppView, BodyMeasurement, WorkoutLog, DailyMealLog } from "@/lib/types"
import {
  Dumbbell,
  Ruler,
  UtensilsCrossed,
  TrendingUp,
  Flame,
  Target,
  Scale,
  ArrowRight,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface DashboardProps {
  onNavigate: (view: AppView) => void
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [measurements, setMeasurements] = useState<BodyMeasurement[]>([])
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>([])
  const [mealLogs, setMealLogs] = useState<DailyMealLog[]>([])

  useEffect(() => {
    setProfile(getProfile())
    setMeasurements(getMeasurements())
    setWorkoutLogs(getWorkoutLogs())
    setMealLogs(getMealLogs())
  }, [])

  if (!profile) return null

  const currentWeight = measurements.length > 0
    ? measurements.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0].weight
    : profile.weight

  const bmi = calculateBMI(currentWeight, profile.height)
  const bmiCategory = getBMICategory(bmi)
  const bmr = calculateBMR(currentWeight, profile.height, profile.age, profile.gender)
  const tdee = calculateTDEE(bmr, profile.activityLevel)
  const targetCals = calculateTargetCalories(tdee, profile.goal)
  const macros = calculateMacros(targetCals, currentWeight, profile.goal)

  // Today's meal log
  const today = new Date().toISOString().split("T")[0]
  const todayLog = mealLogs.find((l) => l.date === today)
  const todayCalories = todayLog
    ? Object.values(todayLog.meals)
        .flat()
        .reduce((sum, m) => sum + m.calories, 0)
    : 0
  const calorieProgress = Math.min((todayCalories / targetCals) * 100, 100)

  // This week's workouts
  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)
  const weeklyWorkouts = workoutLogs.filter((l) => new Date(l.date) >= weekAgo).length

  const goalLabels: Record<string, string> = {
    lose_weight: "Perder grasa",
    gain_muscle: "Ganar musculo",
    maintain: "Mantener",
    recomposition: "Recomposicion",
  }

  const quickActions: { icon: typeof Dumbbell; label: string; view: AppView; color: string }[] = [
    { icon: Dumbbell, label: "Rutinas", view: "routines", color: "bg-primary/10 text-primary" },
    { icon: Ruler, label: "Medidas", view: "measurements", color: "bg-info/10 text-info" },
    { icon: UtensilsCrossed, label: "Nutricion", view: "nutrition", color: "bg-warning/10 text-warning" },
    { icon: TrendingUp, label: "Proyecciones", view: "projections", color: "bg-chart-4/10 text-chart-4" },
  ]

  return (
    <div className="mx-auto max-w-lg px-4 pt-6">
      {/* Greeting */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground font-sans text-balance">
          Hola, {profile.name}
        </h1>
        <p className="text-sm text-muted-foreground font-sans">
          {goalLabels[profile.goal]} &middot; {currentWeight} kg
        </p>
      </div>

      {/* Quick Stats Row */}
      <div className="mb-6 grid grid-cols-3 gap-3">
        <Card className="border-border bg-card">
          <CardContent className="flex flex-col items-center p-3">
            <Scale className="mb-1 h-5 w-5 text-primary" />
            <p className="text-lg font-bold text-foreground font-sans">{currentWeight}</p>
            <p className="text-[10px] text-muted-foreground font-sans">kg</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="flex flex-col items-center p-3">
            <Target className="mb-1 h-5 w-5 text-info" />
            <p className="text-lg font-bold text-foreground font-sans">{bmi}</p>
            <p className={`text-[10px] font-sans ${bmiCategory.color}`}>{bmiCategory.label}</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="flex flex-col items-center p-3">
            <Dumbbell className="mb-1 h-5 w-5 text-warning" />
            <p className="text-lg font-bold text-foreground font-sans">{weeklyWorkouts}</p>
            <p className="text-[10px] text-muted-foreground font-sans">esta semana</p>
          </CardContent>
        </Card>
      </div>

      {/* Calorie Progress */}
      <Card className="mb-6 border-border bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm font-sans text-foreground">
            <Flame className="h-4 w-4 text-chart-4" />
            Calorias de Hoy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl font-bold text-foreground font-sans">{todayCalories}</span>
            <span className="text-sm text-muted-foreground font-sans">/ {targetCals} kcal</span>
          </div>
          <Progress value={calorieProgress} className="h-2" />
          <div className="mt-3 flex justify-between text-xs text-muted-foreground font-sans">
            <span>P: {macros.protein}g</span>
            <span>C: {macros.carbs}g</span>
            <span>G: {macros.fat}g</span>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="mb-6">
        <h2 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider font-sans">
          Acceso Rapido
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <Button
                key={action.view}
                variant="ghost"
                className="h-auto flex-col gap-2 border border-border bg-card p-4 hover:bg-secondary"
                onClick={() => onNavigate(action.view)}
              >
                <div className={`rounded-lg p-2 ${action.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-xs font-medium text-foreground font-sans">{action.label}</span>
              </Button>
            )
          })}
        </div>
      </div>

      {/* Nutrition Summary */}
      <Card className="mb-6 border-border bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between text-sm font-sans text-foreground">
            Resumen Nutricional
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 text-primary"
              onClick={() => onNavigate("nutrition")}
            >
              <span className="text-xs font-sans">Ver detalle</span>
              <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 text-sm font-sans">
            <div className="rounded-lg bg-secondary p-3">
              <p className="text-muted-foreground text-xs">TMB</p>
              <p className="font-bold text-foreground">{bmr} kcal</p>
            </div>
            <div className="rounded-lg bg-secondary p-3">
              <p className="text-muted-foreground text-xs">TDEE</p>
              <p className="font-bold text-foreground">{tdee} kcal</p>
            </div>
            <div className="rounded-lg bg-secondary p-3">
              <p className="text-muted-foreground text-xs">Objetivo</p>
              <p className="font-bold text-foreground">{targetCals} kcal</p>
            </div>
            <div className="rounded-lg bg-secondary p-3">
              <p className="text-muted-foreground text-xs">Proteina</p>
              <p className="font-bold text-foreground">{macros.protein}g/dia</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
