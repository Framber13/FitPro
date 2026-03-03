"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { saveProfile } from "@/lib/store"
import type { UserProfile } from "@/lib/types"
import { Dumbbell, ArrowRight, ArrowLeft, Check } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface OnboardingFlowProps {
  onComplete: () => void
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(0)
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "male" as "male" | "female",
    height: "",
    weight: "",
    goal: "gain_muscle" as UserProfile["goal"],
    level: "beginner" as UserProfile["level"],
    activityLevel: "moderate" as UserProfile["activityLevel"],
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const totalSteps = 4
  const progress = ((step + 1) / totalSteps) * 100

  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (step === 0) {
      if (!formData.name.trim()) newErrors.name = "Ingresa tu nombre"
      if (!formData.age || Number(formData.age) < 14 || Number(formData.age) > 100)
        newErrors.age = "Edad entre 14 y 100"
    }

    if (step === 1) {
      if (!formData.height || Number(formData.height) < 100 || Number(formData.height) > 250)
        newErrors.height = "Altura entre 100 y 250 cm"
      if (!formData.weight || Number(formData.weight) < 30 || Number(formData.weight) > 300)
        newErrors.weight = "Peso entre 30 y 300 kg"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep()) {
      if (step < totalSteps - 1) setStep(step + 1)
      else handleSubmit()
    }
  }

  const handleSubmit = () => {
    const profile: UserProfile = {
      id: crypto.randomUUID(),
      name: formData.name,
      age: Number(formData.age),
      gender: formData.gender,
      height: Number(formData.height),
      weight: Number(formData.weight),
      goal: formData.goal,
      level: formData.level,
      activityLevel: formData.activityLevel,
      startDate: new Date().toISOString(),
      usesSupplements: false,
      supplements: [],
    }
    saveProfile(profile)
    onComplete()
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary">
            <Dumbbell className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground font-sans">FitPro</h1>
          <p className="text-sm text-muted-foreground font-sans">Tu entrenador personal digital</p>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <Progress value={progress} className="h-1.5" />
          <p className="mt-2 text-center text-xs text-muted-foreground font-sans">
            Paso {step + 1} de {totalSteps}
          </p>
        </div>

        {/* Step Content */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="font-sans text-foreground">
              {step === 0 && "Datos Personales"}
              {step === 1 && "Medidas Corporales"}
              {step === 2 && "Tu Objetivo"}
              {step === 3 && "Nivel y Actividad"}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {step === 0 && (
              <>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="name" className="font-sans text-foreground">Nombre</Label>
                  <Input
                    id="name"
                    placeholder="Tu nombre"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="age" className="font-sans text-foreground">Edad</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="25"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  />
                  {errors.age && <p className="text-xs text-destructive">{errors.age}</p>}
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="font-sans text-foreground">Genero</Label>
                  <RadioGroup
                    value={formData.gender}
                    onValueChange={(v) => setFormData({ ...formData, gender: v as "male" | "female" })}
                    className="flex gap-4"
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="male" id="male" />
                      <Label htmlFor="male" className="font-sans text-foreground">Masculino</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="female" id="female" />
                      <Label htmlFor="female" className="font-sans text-foreground">Femenino</Label>
                    </div>
                  </RadioGroup>
                </div>
              </>
            )}

            {step === 1 && (
              <>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="height" className="font-sans text-foreground">Altura (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    placeholder="175"
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                  />
                  {errors.height && <p className="text-xs text-destructive">{errors.height}</p>}
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="weight" className="font-sans text-foreground">Peso (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    placeholder="75"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  />
                  {errors.weight && <p className="text-xs text-destructive">{errors.weight}</p>}
                </div>
              </>
            )}

            {step === 2 && (
              <RadioGroup
                value={formData.goal}
                onValueChange={(v) => setFormData({ ...formData, goal: v as UserProfile["goal"] })}
                className="flex flex-col gap-3"
              >
                {[
                  { value: "lose_weight", label: "Perder grasa", desc: "Deficit calorico para perder peso" },
                  { value: "gain_muscle", label: "Ganar musculo", desc: "Superavit calorico para hipertrofia" },
                  { value: "maintain", label: "Mantener", desc: "Mantener peso y composicion actual" },
                  { value: "recomposition", label: "Recomposicion", desc: "Perder grasa y ganar musculo" },
                ].map((opt) => (
                  <label
                    key={opt.value}
                    className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-3 transition-colors hover:border-primary data-[state=checked]:border-primary"
                  >
                    <RadioGroupItem value={opt.value} className="mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground font-sans">{opt.label}</p>
                      <p className="text-xs text-muted-foreground font-sans">{opt.desc}</p>
                    </div>
                  </label>
                ))}
              </RadioGroup>
            )}

            {step === 3 && (
              <>
                <div className="flex flex-col gap-2">
                  <Label className="font-sans text-foreground">Nivel de experiencia</Label>
                  <Select
                    value={formData.level}
                    onValueChange={(v) => setFormData({ ...formData, level: v as UserProfile["level"] })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Principiante (0-1 anio)</SelectItem>
                      <SelectItem value="intermediate">Intermedio (1-3 anios)</SelectItem>
                      <SelectItem value="advanced">Avanzado (3+ anios)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="font-sans text-foreground">Nivel de actividad</Label>
                  <Select
                    value={formData.activityLevel}
                    onValueChange={(v) =>
                      setFormData({ ...formData, activityLevel: v as UserProfile["activityLevel"] })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sedentary">Sedentario (oficina)</SelectItem>
                      <SelectItem value="light">Ligero (1-2 dias/sem)</SelectItem>
                      <SelectItem value="moderate">Moderado (3-5 dias/sem)</SelectItem>
                      <SelectItem value="active">Activo (6-7 dias/sem)</SelectItem>
                      <SelectItem value="very_active">Muy activo (atleta)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between pt-2">
              {step > 0 ? (
                <Button variant="ghost" onClick={() => setStep(step - 1)} className="gap-1">
                  <ArrowLeft className="h-4 w-4" />
                  Atras
                </Button>
              ) : (
                <div />
              )}
              <Button onClick={handleNext} className="gap-1">
                {step === totalSteps - 1 ? (
                  <>
                    Completar
                    <Check className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    Siguiente
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
