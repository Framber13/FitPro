"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { getRoutines, saveRoutine, deleteRoutine, saveWorkoutLog } from "@/lib/store"
import { calculate1RM, getIntensityTable, getBest1RMFromExercise } from "@/lib/fitness-utils"
import type { Routine, Exercise, ExerciseSet, WorkoutLog } from "@/lib/types"
import {
  Plus,
  Trash2,
  Dumbbell,
  Calculator,
  Play,
  ChevronDown,
  ChevronUp,
  Star,
  X,
} from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export function RoutinesModule() {
  const [routines, setRoutines] = useState<Routine[]>([])
  const [expandedRoutine, setExpandedRoutine] = useState<string | null>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [calcOpen, setCalcOpen] = useState(false)
  const [calcWeight, setCalcWeight] = useState("")
  const [calcReps, setCalcReps] = useState("")

  // New routine form
  const [newRoutine, setNewRoutine] = useState({ name: "", description: "" })
  const [newExercises, setNewExercises] = useState<Exercise[]>([])
  const [newExerciseForm, setNewExerciseForm] = useState({ name: "", muscleGroup: "" })
  const [newSets, setNewSets] = useState<ExerciseSet[]>([{ reps: 10, weight: 0 }])

  const reload = () => setRoutines(getRoutines())
  useEffect(() => { reload() }, [])

  const handleCreateRoutine = () => {
    if (!newRoutine.name.trim() || newExercises.length === 0) return
    const routine: Routine = {
      id: crypto.randomUUID(),
      name: newRoutine.name,
      description: newRoutine.description,
      exercises: newExercises,
      createdAt: new Date().toISOString(),
    }
    saveRoutine(routine)
    setCreateOpen(false)
    setNewRoutine({ name: "", description: "" })
    setNewExercises([])
    reload()
  }

  const handleAddExercise = () => {
    if (!newExerciseForm.name.trim()) return
    const exercise: Exercise = {
      id: crypto.randomUUID(),
      name: newExerciseForm.name,
      muscleGroup: newExerciseForm.muscleGroup,
      sets: [...newSets],
    }
    setNewExercises([...newExercises, exercise])
    setNewExerciseForm({ name: "", muscleGroup: "" })
    setNewSets([{ reps: 10, weight: 0 }])
  }

  const handleLogWorkout = (routine: Routine) => {
    const log: WorkoutLog = {
      id: crypto.randomUUID(),
      routineId: routine.id,
      date: new Date().toISOString(),
      exercises: routine.exercises,
    }
    saveWorkoutLog(log)
    alert("Entrenamiento registrado!")
  }

  const handleDelete = (id: string) => {
    deleteRoutine(id)
    reload()
  }

  // 1RM calculation
  const oneRM = calcWeight && calcReps
    ? calculate1RM(Number(calcWeight), Number(calcReps))
    : 0
  const intensityTable = oneRM > 0 ? getIntensityTable(oneRM) : []

  return (
    <div className="mx-auto max-w-lg px-4 pt-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground font-sans">Rutinas</h1>
        <div className="flex gap-2">
          {/* 1RM Calculator */}
          <Dialog open={calcOpen} onOpenChange={setCalcOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                <Calculator className="h-4 w-4" />
                1RM
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="font-sans">Calculadora 1RM (Epley)</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-4">
                <p className="text-xs text-muted-foreground font-sans">
                  Formula: 1RM = Peso x (1 + Repeticiones / 30)
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <Label className="text-xs font-sans text-foreground">Peso (kg)</Label>
                    <Input
                      type="number"
                      value={calcWeight}
                      onChange={(e) => setCalcWeight(e.target.value)}
                      placeholder="80"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label className="text-xs font-sans text-foreground">Repeticiones</Label>
                    <Input
                      type="number"
                      value={calcReps}
                      onChange={(e) => setCalcReps(e.target.value)}
                      placeholder="8"
                    />
                  </div>
                </div>

                {oneRM > 0 && (
                  <>
                    <div className="rounded-lg bg-primary/10 p-4 text-center">
                      <p className="text-xs text-muted-foreground font-sans">Tu 1RM estimado</p>
                      <p className="text-3xl font-bold text-primary font-sans">{oneRM} kg</p>
                    </div>

                    <h3 className="text-sm font-semibold text-foreground font-sans">
                      Tabla de Intensidades
                    </h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="font-sans">%</TableHead>
                          <TableHead className="font-sans">Peso</TableHead>
                          <TableHead className="font-sans">Reps</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {intensityTable.map((row) => (
                          <TableRow key={row.percentage}>
                            <TableCell className="font-sans font-medium">{row.percentage}%</TableCell>
                            <TableCell className="font-sans">{row.weight} kg</TableCell>
                            <TableCell className="font-sans">{row.reps}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </>
                )}
              </div>
            </DialogContent>
          </Dialog>

          {/* Create Routine */}
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1">
                <Plus className="h-4 w-4" />
                Crear
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="font-sans">Nueva Rutina</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Label className="font-sans text-foreground">Nombre de la rutina</Label>
                  <Input
                    value={newRoutine.name}
                    onChange={(e) => setNewRoutine({ ...newRoutine, name: e.target.value })}
                    placeholder="Ej: Upper Body"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="font-sans text-foreground">Descripcion</Label>
                  <Input
                    value={newRoutine.description}
                    onChange={(e) => setNewRoutine({ ...newRoutine, description: e.target.value })}
                    placeholder="Breve descripcion"
                  />
                </div>

                {/* Added exercises */}
                {newExercises.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <Label className="font-sans text-foreground">Ejercicios agregados</Label>
                    {newExercises.map((ex, i) => (
                      <div key={ex.id} className="flex items-center justify-between rounded-lg border border-border p-2 text-sm font-sans">
                        <span className="text-foreground">{i + 1}. {ex.name} ({ex.sets.length} series)</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => setNewExercises(newExercises.filter((_, j) => j !== i))}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add exercise form */}
                <div className="rounded-lg border border-border p-3">
                  <Label className="text-xs font-semibold text-muted-foreground font-sans">Agregar ejercicio</Label>
                  <div className="mt-2 flex flex-col gap-2">
                    <Input
                      value={newExerciseForm.name}
                      onChange={(e) => setNewExerciseForm({ ...newExerciseForm, name: e.target.value })}
                      placeholder="Nombre del ejercicio"
                    />
                    <Input
                      value={newExerciseForm.muscleGroup}
                      onChange={(e) => setNewExerciseForm({ ...newExerciseForm, muscleGroup: e.target.value })}
                      placeholder="Grupo muscular"
                    />
                    <div className="flex flex-col gap-2">
                      <Label className="text-xs font-sans text-foreground">Series</Label>
                      {newSets.map((s, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <Input
                            type="number"
                            className="w-20"
                            placeholder="Reps"
                            value={s.reps || ""}
                            onChange={(e) => {
                              const updated = [...newSets]
                              updated[i] = { ...updated[i], reps: Number(e.target.value) }
                              setNewSets(updated)
                            }}
                          />
                          <span className="text-xs text-muted-foreground font-sans">x</span>
                          <Input
                            type="number"
                            className="w-20"
                            placeholder="kg"
                            value={s.weight || ""}
                            onChange={(e) => {
                              const updated = [...newSets]
                              updated[i] = { ...updated[i], weight: Number(e.target.value) }
                              setNewSets(updated)
                            }}
                          />
                          <span className="text-xs text-muted-foreground font-sans">kg</span>
                          {newSets.length > 1 && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => setNewSets(newSets.filter((_, j) => j !== i))}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setNewSets([...newSets, { reps: 10, weight: 0 }])}
                        className="text-xs"
                      >
                        + Serie
                      </Button>
                    </div>
                    <Button variant="secondary" size="sm" onClick={handleAddExercise} className="mt-1">
                      Agregar Ejercicio
                    </Button>
                  </div>
                </div>

                <Button onClick={handleCreateRoutine} disabled={!newRoutine.name || newExercises.length === 0}>
                  Guardar Rutina
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Tabs for suggested vs custom */}
      <Tabs defaultValue="all" className="mb-6">
        <TabsList className="w-full">
          <TabsTrigger value="all" className="flex-1 font-sans">Todas</TabsTrigger>
          <TabsTrigger value="suggested" className="flex-1 font-sans">Sugeridas</TabsTrigger>
          <TabsTrigger value="custom" className="flex-1 font-sans">Personalizadas</TabsTrigger>
        </TabsList>

        {["all", "suggested", "custom"].map((tab) => (
          <TabsContent key={tab} value={tab}>
            <div className="flex flex-col gap-3">
              {routines
                .filter((r) => {
                  if (tab === "suggested") return r.isSuggested
                  if (tab === "custom") return !r.isSuggested
                  return true
                })
                .map((routine) => {
                  const isExpanded = expandedRoutine === routine.id
                  return (
                    <Card key={routine.id} className="border-border bg-card">
                      <CardHeader className="p-3 pb-0">
                        <div className="flex items-start justify-between">
                          <div
                            className="flex-1 cursor-pointer"
                            onClick={() => setExpandedRoutine(isExpanded ? null : routine.id)}
                          >
                            <div className="flex items-center gap-2">
                              <CardTitle className="text-sm font-sans text-foreground">
                                {routine.name}
                              </CardTitle>
                              {routine.isSuggested && (
                                <Star className="h-3 w-3 text-warning fill-warning" />
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground font-sans mt-0.5">
                              {routine.description}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 shrink-0"
                            onClick={() => setExpandedRoutine(isExpanded ? null : routine.id)}
                          >
                            {isExpanded ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="p-3">
                        <div className="flex flex-wrap gap-1 mb-2">
                          {routine.exercises.map((ex) => (
                            <Badge key={ex.id} variant="secondary" className="text-[10px] font-sans">
                              {ex.muscleGroup}
                            </Badge>
                          ))}
                        </div>

                        {isExpanded && (
                          <div className="mt-3 flex flex-col gap-3 border-t border-border pt-3">
                            {routine.exercises.map((ex) => {
                              const best1RM = getBest1RMFromExercise(ex)
                              return (
                                <div key={ex.id} className="rounded-lg bg-secondary p-2">
                                  <div className="flex items-center justify-between mb-1">
                                    <p className="text-xs font-semibold text-foreground font-sans">
                                      {ex.name}
                                    </p>
                                    {best1RM > 0 && (
                                      <span className="text-[10px] text-primary font-sans">
                                        1RM: {best1RM}kg
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                    {ex.sets.map((s, i) => (
                                      <span key={i} className="text-[10px] text-muted-foreground font-sans">
                                        S{i + 1}: {s.reps}x{s.weight}kg
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )
                            })}
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                className="flex-1 gap-1"
                                onClick={() => handleLogWorkout(routine)}
                              >
                                <Play className="h-3 w-3" />
                                Registrar
                              </Button>
                              {!routine.isSuggested && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-destructive"
                                  onClick={() => handleDelete(routine.id)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
