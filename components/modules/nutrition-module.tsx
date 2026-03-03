"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getProfile, getMealLogs, saveMealLog, getFoods } from "@/lib/store"
import {
  calculateBMR,
  calculateTDEE,
  calculateTargetCalories,
  calculateMacros,
} from "@/lib/fitness-utils"
import type { UserProfile, DailyMealLog, MealEntry, FoodItem, NutritionTarget } from "@/lib/types"
import { Plus, Flame, Search, UtensilsCrossed } from "lucide-react"

type MealType = "breakfast" | "lunch" | "dinner" | "snacks"

const mealLabels: Record<MealType, string> = {
  breakfast: "Desayuno",
  lunch: "Almuerzo",
  dinner: "Cena",
  snacks: "Snacks",
}

export function NutritionModule() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [todayLog, setTodayLog] = useState<DailyMealLog | null>(null)
  const [foods, setFoods] = useState<FoodItem[]>([])
  const [addMealOpen, setAddMealOpen] = useState(false)
  const [selectedMealType, setSelectedMealType] = useState<MealType>("breakfast")
  const [searchTerm, setSearchTerm] = useState("")
  const [customEntry, setCustomEntry] = useState({ name: "", calories: "", protein: "", carbs: "", fat: "" })

  const today = new Date().toISOString().split("T")[0]

  const reload = () => {
    setProfile(getProfile())
    const logs = getMealLogs()
    const existing = logs.find((l) => l.date === today)
    setTodayLog(existing || null)
    setFoods(getFoods())
  }

  useEffect(() => { reload() }, [])

  if (!profile) return null

  const bmr = calculateBMR(profile.weight, profile.height, profile.age, profile.gender)
  const tdee = calculateTDEE(bmr, profile.activityLevel)
  const targetCals = calculateTargetCalories(tdee, profile.goal)
  const macros = calculateMacros(targetCals, profile.weight, profile.goal)

  const totalConsumed = todayLog
    ? Object.values(todayLog.meals)
        .flat()
        .reduce(
          (acc, m) => ({
            calories: acc.calories + m.calories,
            protein: acc.protein + m.protein,
            carbs: acc.carbs + m.carbs,
            fat: acc.fat + m.fat,
          }),
          { calories: 0, protein: 0, carbs: 0, fat: 0 }
        )
    : { calories: 0, protein: 0, carbs: 0, fat: 0 }

  const addFoodToMeal = (food: FoodItem) => {
    const entry: MealEntry = {
      id: crypto.randomUUID(),
      name: food.name,
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fat: food.fat,
    }

    const log: DailyMealLog = todayLog || {
      id: crypto.randomUUID(),
      date: today,
      meals: { breakfast: [], lunch: [], dinner: [], snacks: [] },
    }

    log.meals[selectedMealType] = [...log.meals[selectedMealType], entry]
    saveMealLog(log)
    setTodayLog({ ...log })
    setAddMealOpen(false)
    setSearchTerm("")
  }

  const addCustomEntry = () => {
    if (!customEntry.name || !customEntry.calories) return
    const entry: MealEntry = {
      id: crypto.randomUUID(),
      name: customEntry.name,
      calories: Number(customEntry.calories),
      protein: Number(customEntry.protein) || 0,
      carbs: Number(customEntry.carbs) || 0,
      fat: Number(customEntry.fat) || 0,
    }

    const log: DailyMealLog = todayLog || {
      id: crypto.randomUUID(),
      date: today,
      meals: { breakfast: [], lunch: [], dinner: [], snacks: [] },
    }

    log.meals[selectedMealType] = [...log.meals[selectedMealType], entry]
    saveMealLog(log)
    setTodayLog({ ...log })
    setCustomEntry({ name: "", calories: "", protein: "", carbs: "", fat: "" })
    setAddMealOpen(false)
  }

  const filteredFoods = foods.filter((f) =>
    f.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const goalLabel: Record<string, string> = {
    lose_weight: "Deficit calorico (-400 kcal)",
    gain_muscle: "Superavit calorico (+350 kcal)",
    maintain: "Mantenimiento",
    recomposition: "Recomposicion corporal",
  }

  const macroItems: { label: string; consumed: number; target: number; color: string }[] = [
    { label: "Proteina", consumed: totalConsumed.protein, target: macros.protein, color: "bg-primary" },
    { label: "Carbos", consumed: totalConsumed.carbs, target: macros.carbs, color: "bg-info" },
    { label: "Grasas", consumed: totalConsumed.fat, target: macros.fat, color: "bg-warning" },
  ]

  return (
    <div className="mx-auto max-w-lg px-4 pt-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-foreground font-sans">Nutricion</h1>
        <p className="text-xs text-muted-foreground font-sans">{goalLabel[profile.goal]}</p>
      </div>

      {/* Calorie Overview */}
      <Card className="mb-4 border-border bg-card">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-chart-4" />
              <span className="text-sm font-semibold text-foreground font-sans">Calorias Hoy</span>
            </div>
            <span className="text-xs text-muted-foreground font-sans">
              {Math.round(totalConsumed.calories)} / {targetCals} kcal
            </span>
          </div>
          <Progress
            value={Math.min((totalConsumed.calories / targetCals) * 100, 100)}
            className="h-3 mb-3"
          />
          <div className="grid grid-cols-2 gap-3 text-xs text-muted-foreground font-sans">
            <div className="rounded-lg bg-secondary p-2">
              <span className="block font-semibold text-foreground">TMB: {bmr} kcal</span>
              Metabolismo basal
            </div>
            <div className="rounded-lg bg-secondary p-2">
              <span className="block font-semibold text-foreground">TDEE: {tdee} kcal</span>
              Gasto total diario
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Macro Breakdown */}
      <div className="mb-4 grid grid-cols-3 gap-3">
        {macroItems.map((m) => (
          <Card key={m.label} className="border-border bg-card">
            <CardContent className="p-3 text-center">
              <p className="text-[10px] text-muted-foreground font-sans">{m.label}</p>
              <p className="text-lg font-bold text-foreground font-sans">
                {Math.round(m.consumed)}g
              </p>
              <Progress
                value={Math.min((m.consumed / m.target) * 100, 100)}
                className="h-1 mt-1"
              />
              <p className="text-[10px] text-muted-foreground font-sans mt-1">
                / {m.target}g
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Meal Sections */}
      <div className="flex flex-col gap-3 mb-6">
        {(Object.keys(mealLabels) as MealType[]).map((mealType) => {
          const meals = todayLog?.meals[mealType] || []
          const mealCals = meals.reduce((sum, m) => sum + m.calories, 0)

          return (
            <Card key={mealType} className="border-border bg-card">
              <CardHeader className="p-3 pb-0">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-sans text-foreground flex items-center gap-2">
                    <UtensilsCrossed className="h-3.5 w-3.5 text-muted-foreground" />
                    {mealLabels[mealType]}
                    {mealCals > 0 && (
                      <span className="text-xs font-normal text-muted-foreground">
                        {mealCals} kcal
                      </span>
                    )}
                  </CardTitle>
                  <Dialog open={addMealOpen && selectedMealType === mealType} onOpenChange={(open) => {
                    setAddMealOpen(open)
                    if (open) setSelectedMealType(mealType)
                  }}>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setSelectedMealType(mealType)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-h-[85vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="font-sans">
                          Agregar a {mealLabels[mealType]}
                        </DialogTitle>
                      </DialogHeader>

                      <Tabs defaultValue="search">
                        <TabsList className="w-full">
                          <TabsTrigger value="search" className="flex-1 font-sans">Buscar</TabsTrigger>
                          <TabsTrigger value="custom" className="flex-1 font-sans">Manual</TabsTrigger>
                        </TabsList>

                        <TabsContent value="search">
                          <div className="flex flex-col gap-3">
                            <div className="relative">
                              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                              <Input
                                placeholder="Buscar alimento..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9"
                              />
                            </div>
                            <ScrollArea className="h-64">
                              <div className="flex flex-col gap-1">
                                {filteredFoods.map((food) => (
                                  <button
                                    key={food.id}
                                    className="flex items-center justify-between rounded-lg p-2 text-left text-sm hover:bg-secondary transition-colors"
                                    onClick={() => addFoodToMeal(food)}
                                  >
                                    <div>
                                      <p className="font-medium text-foreground font-sans">{food.name}</p>
                                      <p className="text-[10px] text-muted-foreground font-sans">
                                        P: {food.protein}g | C: {food.carbs}g | G: {food.fat}g
                                      </p>
                                    </div>
                                    <span className="text-xs font-semibold text-primary font-sans">
                                      {food.calories} kcal
                                    </span>
                                  </button>
                                ))}
                              </div>
                            </ScrollArea>
                          </div>
                        </TabsContent>

                        <TabsContent value="custom">
                          <div className="flex flex-col gap-3">
                            <div className="flex flex-col gap-1">
                              <Label className="text-xs font-sans text-foreground">Nombre</Label>
                              <Input
                                value={customEntry.name}
                                onChange={(e) => setCustomEntry({ ...customEntry, name: e.target.value })}
                                placeholder="Nombre del alimento"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="flex flex-col gap-1">
                                <Label className="text-xs font-sans text-foreground">Calorias</Label>
                                <Input
                                  type="number"
                                  value={customEntry.calories}
                                  onChange={(e) => setCustomEntry({ ...customEntry, calories: e.target.value })}
                                />
                              </div>
                              <div className="flex flex-col gap-1">
                                <Label className="text-xs font-sans text-foreground">Proteina (g)</Label>
                                <Input
                                  type="number"
                                  value={customEntry.protein}
                                  onChange={(e) => setCustomEntry({ ...customEntry, protein: e.target.value })}
                                />
                              </div>
                              <div className="flex flex-col gap-1">
                                <Label className="text-xs font-sans text-foreground">Carbos (g)</Label>
                                <Input
                                  type="number"
                                  value={customEntry.carbs}
                                  onChange={(e) => setCustomEntry({ ...customEntry, carbs: e.target.value })}
                                />
                              </div>
                              <div className="flex flex-col gap-1">
                                <Label className="text-xs font-sans text-foreground">Grasas (g)</Label>
                                <Input
                                  type="number"
                                  value={customEntry.fat}
                                  onChange={(e) => setCustomEntry({ ...customEntry, fat: e.target.value })}
                                />
                              </div>
                            </div>
                            <Button onClick={addCustomEntry} disabled={!customEntry.name || !customEntry.calories}>
                              Agregar
                            </Button>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent className="p-3 pt-2">
                {meals.length === 0 ? (
                  <p className="text-xs text-muted-foreground font-sans py-1">Sin registros</p>
                ) : (
                  <div className="flex flex-col gap-1">
                    {meals.map((meal) => (
                      <div key={meal.id} className="flex items-center justify-between rounded bg-secondary px-2 py-1.5 text-xs font-sans">
                        <span className="text-foreground">{meal.name}</span>
                        <span className="text-muted-foreground">{meal.calories} kcal</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Suggested Meal Plan */}
      <Card className="mb-6 border-border bg-card">
        <CardHeader className="p-3 pb-0">
          <CardTitle className="text-sm font-sans text-foreground">Plan Sugerido</CardTitle>
        </CardHeader>
        <CardContent className="p-3">
          <div className="flex flex-col gap-2 text-xs font-sans">
            <div className="rounded-lg bg-secondary p-2">
              <p className="font-semibold text-foreground">Desayuno (~{Math.round(targetCals * 0.25)} kcal)</p>
              <p className="text-muted-foreground">Avena + huevos + fruta</p>
            </div>
            <div className="rounded-lg bg-secondary p-2">
              <p className="font-semibold text-foreground">Almuerzo (~{Math.round(targetCals * 0.35)} kcal)</p>
              <p className="text-muted-foreground">Pollo + arroz + verduras</p>
            </div>
            <div className="rounded-lg bg-secondary p-2">
              <p className="font-semibold text-foreground">Cena (~{Math.round(targetCals * 0.25)} kcal)</p>
              <p className="text-muted-foreground">Salmon/atun + papa + ensalada</p>
            </div>
            <div className="rounded-lg bg-secondary p-2">
              <p className="font-semibold text-foreground">Snacks (~{Math.round(targetCals * 0.15)} kcal)</p>
              <p className="text-muted-foreground">Yogur griego + almendras + batido</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
