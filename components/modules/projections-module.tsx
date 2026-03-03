"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getProfile, getMeasurements, getWorkoutLogs } from "@/lib/store"
import { projectStrength, projectWeight, calculate1RM } from "@/lib/fitness-utils"
import type { UserProfile, BodyMeasurement, WorkoutLog } from "@/lib/types"
import { TrendingUp, Scale, Dumbbell, Target } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"

export function ProjectionsModule() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [measurements, setMeasurements] = useState<BodyMeasurement[]>([])
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>([])
  const [current1RM, setCurrent1RM] = useState("")

  useEffect(() => {
    setProfile(getProfile())
    setMeasurements(getMeasurements())
    setWorkoutLogs(getWorkoutLogs())
  }, [])

  if (!profile) return null

  const currentWeight = measurements.length > 0
    ? measurements.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0].weight
    : profile.weight

  // Weight projection
  const weightProjections = [
    { label: "Actual", months: 0, value: currentWeight },
    { label: "3 meses", months: 3, value: projectWeight(currentWeight, profile.goal, 3) },
    { label: "6 meses", months: 6, value: projectWeight(currentWeight, profile.goal, 6) },
    { label: "12 meses", months: 12, value: projectWeight(currentWeight, profile.goal, 12) },
  ]

  // Strength projection (based on entered 1RM or best from logs)
  const oneRM = current1RM ? Number(current1RM) : 0
  const strengthProjections = oneRM > 0
    ? [
        { label: "Actual", months: 0, value: oneRM },
        { label: "3 meses", months: 3, value: projectStrength(oneRM, profile.level, 3) },
        { label: "6 meses", months: 6, value: projectStrength(oneRM, profile.level, 6) },
        { label: "12 meses", months: 12, value: projectStrength(oneRM, profile.level, 12) },
      ]
    : []

  const goalLabels: Record<string, string> = {
    lose_weight: "Perder grasa",
    gain_muscle: "Ganar musculo",
    maintain: "Mantener",
    recomposition: "Recomposicion",
  }

  const barColors = ["oklch(0.65 0 0)", "oklch(0.70 0.15 200)", "oklch(0.75 0.18 145)", "oklch(0.80 0.15 85)"]

  return (
    <div className="mx-auto max-w-lg px-4 pt-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-foreground font-sans">Proyecciones</h1>
        <p className="text-xs text-muted-foreground font-sans">
          Estimaciones basadas en tu objetivo: {goalLabels[profile.goal]}
        </p>
      </div>

      {/* Weight Projection */}
      <Card className="mb-4 border-border bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm font-sans text-foreground">
            <Scale className="h-4 w-4 text-primary" />
            Proyeccion de Peso Corporal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weightProjections}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.27 0.005 250)" />
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: "oklch(0.65 0 0)" }} />
              <YAxis tick={{ fontSize: 10, fill: "oklch(0.65 0 0)" }} domain={["auto", "auto"]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "oklch(0.17 0.005 250)",
                  border: "1px solid oklch(0.27 0.005 250)",
                  borderRadius: "8px",
                  color: "oklch(0.97 0 0)",
                }}
                formatter={(value: number) => [`${value} kg`, "Peso"]}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {weightProjections.map((_, i) => (
                  <Cell key={i} fill={barColors[i]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          <div className="mt-3 grid grid-cols-4 gap-2">
            {weightProjections.map((p) => (
              <div key={p.label} className="text-center">
                <p className="text-lg font-bold text-foreground font-sans">{p.value}</p>
                <p className="text-[10px] text-muted-foreground font-sans">{p.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Strength Projection */}
      <Card className="mb-4 border-border bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm font-sans text-foreground">
            <Dumbbell className="h-4 w-4 text-warning" />
            Proyeccion de Fuerza (1RM)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col gap-2">
            <Label className="text-xs font-sans text-foreground">
              Tu 1RM actual (kg) - cualquier ejercicio
            </Label>
            <Input
              type="number"
              value={current1RM}
              onChange={(e) => setCurrent1RM(e.target.value)}
              placeholder="Ej: 80"
            />
          </div>

          {strengthProjections.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={strengthProjections}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.27 0.005 250)" />
                  <XAxis dataKey="label" tick={{ fontSize: 10, fill: "oklch(0.65 0 0)" }} />
                  <YAxis tick={{ fontSize: 10, fill: "oklch(0.65 0 0)" }} domain={["auto", "auto"]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "oklch(0.17 0.005 250)",
                      border: "1px solid oklch(0.27 0.005 250)",
                      borderRadius: "8px",
                      color: "oklch(0.97 0 0)",
                    }}
                    formatter={(value: number) => [`${value} kg`, "1RM"]}
                  />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {strengthProjections.map((_, i) => (
                      <Cell key={i} fill={barColors[i]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>

              <div className="mt-3 grid grid-cols-4 gap-2">
                {strengthProjections.map((p) => (
                  <div key={p.label} className="text-center">
                    <p className="text-lg font-bold text-foreground font-sans">{p.value}</p>
                    <p className="text-[10px] text-muted-foreground font-sans">{p.label}</p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="py-4 text-center text-sm text-muted-foreground font-sans">
              Ingresa tu 1RM actual para ver la proyeccion
            </p>
          )}
        </CardContent>
      </Card>

      {/* Info Note */}
      <Card className="mb-6 border-border bg-card">
        <CardContent className="p-3">
          <div className="flex items-start gap-2">
            <Target className="h-4 w-4 text-primary mt-0.5 shrink-0" />
            <p className="text-xs text-muted-foreground font-sans leading-relaxed">
              Estas proyecciones son estimaciones basadas en tasas de progreso tipicas
              para tu nivel ({profile.level === "beginner" ? "principiante" : profile.level === "intermediate" ? "intermedio" : "avanzado"}).
              Los resultados reales dependen de la consistencia, nutricion, descanso y genetica individual.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
