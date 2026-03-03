"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { getProfile, saveProfile } from "@/lib/store"
import { formatDate } from "@/lib/fitness-utils"
import type { UserProfile, AppView } from "@/lib/types"
import { User, Save, Calendar, Target, TrendingUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface ProfileModuleProps {
  onNavigate: (view: AppView) => void
}

export function ProfileModule({ onNavigate }: ProfileModuleProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState<Partial<UserProfile>>({})
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const p = getProfile()
    if (p) {
      setProfile(p)
      setForm(p)
    }
  }, [])

  const handleSave = () => {
    if (!profile || !form) return
    const updated: UserProfile = { ...profile, ...form } as UserProfile
    saveProfile(updated)
    setProfile(updated)
    setEditing(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (!profile) return null

  const goalLabels: Record<string, string> = {
    lose_weight: "Perder grasa",
    gain_muscle: "Ganar musculo",
    maintain: "Mantener",
    recomposition: "Recomposicion",
  }

  const levelLabels: Record<string, string> = {
    beginner: "Principiante",
    intermediate: "Intermedio",
    advanced: "Avanzado",
  }

  const activityLabels: Record<string, string> = {
    sedentary: "Sedentario",
    light: "Ligero",
    moderate: "Moderado",
    active: "Activo",
    very_active: "Muy activo",
  }

  return (
    <div className="mx-auto max-w-lg px-4 pt-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground font-sans">Mi Perfil</h1>
        <Button
          variant={editing ? "default" : "outline"}
          size="sm"
          onClick={() => (editing ? handleSave() : setEditing(true))}
          className="gap-1"
        >
          {editing ? (
            <>
              <Save className="h-4 w-4" />
              Guardar
            </>
          ) : (
            "Editar"
          )}
        </Button>
      </div>

      {saved && (
        <div className="mb-4 rounded-lg bg-primary/10 p-3 text-sm text-primary font-sans">
          Perfil actualizado correctamente
        </div>
      )}

      {/* Profile Header Card */}
      <Card className="mb-4 border-border bg-card">
        <CardContent className="flex items-center gap-4 p-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <User className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground font-sans">{profile.name}</h2>
            <div className="flex flex-wrap gap-2 mt-1">
              <Badge variant="secondary" className="text-xs font-sans">
                {levelLabels[profile.level]}
              </Badge>
              <Badge variant="secondary" className="text-xs font-sans">
                {goalLabels[profile.goal]}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Info Cards */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <Card className="border-border bg-card">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground font-sans">Inicio</span>
            </div>
            <p className="text-sm font-semibold text-foreground font-sans">{formatDate(profile.startDate)}</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-1">
              <Target className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground font-sans">Actividad</span>
            </div>
            <p className="text-sm font-semibold text-foreground font-sans">{activityLabels[profile.activityLevel]}</p>
          </CardContent>
        </Card>
      </div>

      {/* Editable Form */}
      {editing ? (
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-sm font-sans text-foreground">Editar Datos</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label className="font-sans text-foreground">Nombre</Label>
              <Input
                value={form.name || ""}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-2">
                <Label className="font-sans text-foreground">Edad</Label>
                <Input
                  type="number"
                  value={form.age || ""}
                  onChange={(e) => setForm({ ...form, age: Number(e.target.value) })}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="font-sans text-foreground">Genero</Label>
                <Select
                  value={form.gender}
                  onValueChange={(v) => setForm({ ...form, gender: v as "male" | "female" })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Masculino</SelectItem>
                    <SelectItem value="female">Femenino</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-2">
                <Label className="font-sans text-foreground">Altura (cm)</Label>
                <Input
                  type="number"
                  value={form.height || ""}
                  onChange={(e) => setForm({ ...form, height: Number(e.target.value) })}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="font-sans text-foreground">Peso (kg)</Label>
                <Input
                  type="number"
                  value={form.weight || ""}
                  onChange={(e) => setForm({ ...form, weight: Number(e.target.value) })}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label className="font-sans text-foreground">Objetivo</Label>
              <Select
                value={form.goal}
                onValueChange={(v) => setForm({ ...form, goal: v as UserProfile["goal"] })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="lose_weight">Perder grasa</SelectItem>
                  <SelectItem value="gain_muscle">Ganar musculo</SelectItem>
                  <SelectItem value="maintain">Mantener</SelectItem>
                  <SelectItem value="recomposition">Recomposicion</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label className="font-sans text-foreground">Nivel</Label>
              <Select
                value={form.level}
                onValueChange={(v) => setForm({ ...form, level: v as UserProfile["level"] })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Principiante</SelectItem>
                  <SelectItem value="intermediate">Intermedio</SelectItem>
                  <SelectItem value="advanced">Avanzado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label className="font-sans text-foreground">Actividad</Label>
              <Select
                value={form.activityLevel}
                onValueChange={(v) => setForm({ ...form, activityLevel: v as UserProfile["activityLevel"] })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedentary">Sedentario</SelectItem>
                  <SelectItem value="light">Ligero</SelectItem>
                  <SelectItem value="moderate">Moderado</SelectItem>
                  <SelectItem value="active">Activo</SelectItem>
                  <SelectItem value="very_active">Muy activo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-sm font-sans text-foreground">Datos Personales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3 text-sm font-sans">
              {[
                ["Edad", `${profile.age} anios`],
                ["Genero", profile.gender === "male" ? "Masculino" : "Femenino"],
                ["Altura", `${profile.height} cm`],
                ["Peso", `${profile.weight} kg`],
                ["Objetivo", goalLabels[profile.goal]],
                ["Nivel", levelLabels[profile.level]],
                ["Actividad", activityLabels[profile.activityLevel]],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between border-b border-border pb-2 last:border-0">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-medium text-foreground">{value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
