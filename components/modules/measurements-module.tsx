"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { getMeasurements, saveMeasurement, deleteMeasurement, getProfile } from "@/lib/store"
import { calculateBMI, getBMICategory, formatDate } from "@/lib/fitness-utils"
import type { BodyMeasurement, UserProfile } from "@/lib/types"
import { Plus, Trash2, Scale, TrendingDown, TrendingUp, Minus } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

export function MeasurementsModule() {
  const [measurements, setMeasurements] = useState<BodyMeasurement[]>([])
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [form, setForm] = useState<Partial<BodyMeasurement>>({
    weight: 0,
    bodyFat: undefined,
    chest: undefined,
    waist: undefined,
    hips: undefined,
    bicepsLeft: undefined,
    bicepsRight: undefined,
    thighLeft: undefined,
    thighRight: undefined,
  })

  const reload = () => {
    setMeasurements(getMeasurements().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()))
    setProfile(getProfile())
  }

  useEffect(() => {
    reload()
  }, [])

  const handleSave = () => {
    if (!form.weight || form.weight <= 0) return
    const m: BodyMeasurement = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      weight: form.weight,
      bodyFat: form.bodyFat,
      chest: form.chest,
      waist: form.waist,
      hips: form.hips,
      bicepsLeft: form.bicepsLeft,
      bicepsRight: form.bicepsRight,
      thighLeft: form.thighLeft,
      thighRight: form.thighRight,
    }
    saveMeasurement(m)
    setDialogOpen(false)
    setForm({ weight: 0 })
    reload()
  }

  const handleDelete = (id: string) => {
    deleteMeasurement(id)
    reload()
  }

  const sorted = [...measurements].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  const chartData = sorted.map((m) => ({
    date: new Date(m.date).toLocaleDateString("es-ES", { day: "2-digit", month: "short" }),
    peso: m.weight,
    grasa: m.bodyFat || null,
  }))

  // Weight change calculation
  const weightChange = measurements.length >= 2 ? measurements[0].weight - measurements[1].weight : 0
  const latestWeight = measurements.length > 0 ? measurements[0].weight : profile?.weight || 0
  const bmi = profile ? calculateBMI(latestWeight, profile.height) : 0
  const bmiCat = getBMICategory(bmi)

  return (
    <div className="mx-auto max-w-lg px-4 pt-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground font-sans">Medidas y Progreso</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1">
              <Plus className="h-4 w-4" />
              Registrar
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-sans">Nueva Medicion</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label className="font-sans text-foreground">Peso (kg) *</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={form.weight || ""}
                  onChange={(e) => setForm({ ...form, weight: Number(e.target.value) })}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="font-sans text-foreground">% Grasa corporal</Label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="Opcional"
                  value={form.bodyFat || ""}
                  onChange={(e) => setForm({ ...form, bodyFat: Number(e.target.value) || undefined })}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { key: "chest", label: "Pecho (cm)" },
                  { key: "waist", label: "Cintura (cm)" },
                  { key: "hips", label: "Cadera (cm)" },
                  { key: "bicepsLeft", label: "Biceps Izq (cm)" },
                  { key: "bicepsRight", label: "Biceps Der (cm)" },
                  { key: "thighLeft", label: "Muslo Izq (cm)" },
                  { key: "thighRight", label: "Muslo Der (cm)" },
                ].map((field) => (
                  <div key={field.key} className="flex flex-col gap-1">
                    <Label className="text-xs font-sans text-foreground">{field.label}</Label>
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="--"
                      value={(form as Record<string, number | undefined>)[field.key] || ""}
                      onChange={(e) =>
                        setForm({ ...form, [field.key]: Number(e.target.value) || undefined })
                      }
                    />
                  </div>
                ))}
              </div>
              <Button onClick={handleSave} className="w-full">
                Guardar Medicion
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="mb-6 grid grid-cols-3 gap-3">
        <Card className="border-border bg-card">
          <CardContent className="flex flex-col items-center p-3">
            <Scale className="mb-1 h-5 w-5 text-primary" />
            <p className="text-lg font-bold text-foreground font-sans">{latestWeight}</p>
            <p className="text-[10px] text-muted-foreground font-sans">kg actual</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="flex flex-col items-center p-3">
            {weightChange < 0 ? (
              <TrendingDown className="mb-1 h-5 w-5 text-success" />
            ) : weightChange > 0 ? (
              <TrendingUp className="mb-1 h-5 w-5 text-warning" />
            ) : (
              <Minus className="mb-1 h-5 w-5 text-muted-foreground" />
            )}
            <p className="text-lg font-bold text-foreground font-sans">
              {weightChange > 0 ? "+" : ""}{weightChange.toFixed(1)}
            </p>
            <p className="text-[10px] text-muted-foreground font-sans">kg cambio</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="flex flex-col items-center p-3">
            <span className="mb-1 text-lg font-bold text-foreground font-sans">{bmi}</span>
            <p className={`text-[10px] font-sans ${bmiCat.color}`}>{bmiCat.label}</p>
            <p className="text-[10px] text-muted-foreground font-sans">IMC</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="weight" className="mb-6">
        <TabsList className="w-full">
          <TabsTrigger value="weight" className="flex-1 font-sans">Peso</TabsTrigger>
          <TabsTrigger value="fat" className="flex-1 font-sans">% Grasa</TabsTrigger>
        </TabsList>

        <TabsContent value="weight">
          <Card className="border-border bg-card">
            <CardContent className="p-4">
              {chartData.length > 1 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.27 0.005 250)" />
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: "oklch(0.65 0 0)" }} />
                    <YAxis tick={{ fontSize: 10, fill: "oklch(0.65 0 0)" }} domain={["auto", "auto"]} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "oklch(0.17 0.005 250)", border: "1px solid oklch(0.27 0.005 250)", borderRadius: "8px", color: "oklch(0.97 0 0)" }}
                    />
                    <Line type="monotone" dataKey="peso" stroke="oklch(0.75 0.18 145)" strokeWidth={2} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <p className="py-8 text-center text-sm text-muted-foreground font-sans">
                  Registra al menos 2 mediciones para ver la grafica
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fat">
          <Card className="border-border bg-card">
            <CardContent className="p-4">
              {chartData.filter((d) => d.grasa).length > 1 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={chartData.filter((d) => d.grasa)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.27 0.005 250)" />
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: "oklch(0.65 0 0)" }} />
                    <YAxis tick={{ fontSize: 10, fill: "oklch(0.65 0 0)" }} domain={["auto", "auto"]} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "oklch(0.17 0.005 250)", border: "1px solid oklch(0.27 0.005 250)", borderRadius: "8px", color: "oklch(0.97 0 0)" }}
                    />
                    <Line type="monotone" dataKey="grasa" stroke="oklch(0.80 0.15 85)" strokeWidth={2} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <p className="py-8 text-center text-sm text-muted-foreground font-sans">
                  Registra % de grasa en al menos 2 mediciones
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* History */}
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground font-sans">
        Historial
      </h2>
      <div className="flex flex-col gap-3 pb-4">
        {measurements.length === 0 ? (
          <Card className="border-border bg-card">
            <CardContent className="p-6 text-center">
              <p className="text-sm text-muted-foreground font-sans">
                Aun no hay mediciones registradas
              </p>
            </CardContent>
          </Card>
        ) : (
          measurements.map((m) => {
            const mBmi = profile ? calculateBMI(m.weight, profile.height) : 0
            return (
              <Card key={m.id} className="border-border bg-card">
                <CardContent className="p-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground font-sans">{formatDate(m.date)}</p>
                      <p className="text-lg font-bold text-foreground font-sans">{m.weight} kg</p>
                      <div className="flex flex-wrap gap-2 mt-1 text-xs text-muted-foreground font-sans">
                        <span>IMC: {mBmi}</span>
                        {m.bodyFat && <span>Grasa: {m.bodyFat}%</span>}
                        {m.chest && <span>Pecho: {m.chest}cm</span>}
                        {m.waist && <span>Cintura: {m.waist}cm</span>}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => handleDelete(m.id)}
                      aria-label="Eliminar medicion"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
