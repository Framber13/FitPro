// ========================================
// Centralized state management using Supabase
// This module provides functions for managing
// all app data with Supabase as the backend.
// ========================================

import { createClient } from "@/lib/supabase/client"
import type {
  UserProfile,
  BodyMeasurement,
  Routine,
  WorkoutLog,
  DailyMealLog,
  FoodItem,
  Exercise,
} from "./types"
import { defaultFoods, suggestedRoutines } from "./default-data"

// Helper to get the current user id
async function getUserId(): Promise<string | null> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user?.id ?? null
}

// ---- Profile ----
export async function getProfile(): Promise<UserProfile | null> {
  const userId = await getUserId()
  if (!userId) return null

  const supabase = createClient()
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single()

  if (error || !data) return null

  return {
    id: data.id,
    name: data.name,
    age: data.age,
    gender: data.gender,
    height: Number(data.height),
    weight: Number(data.weight),
    goal: data.goal,
    level: data.level,
    activityLevel: data.activity_level,
    startDate: data.start_date || data.created_at,
    usesSupplements: data.uses_supplements || false,
    supplements: data.supplements || [],
  }
}

export async function saveProfile(profile: UserProfile): Promise<void> {
  const userId = await getUserId()
  if (!userId) return

  const supabase = createClient()
  const { error } = await supabase
    .from("profiles")
    .upsert({
      id: userId,
      name: profile.name,
      age: profile.age,
      gender: profile.gender,
      height: profile.height,
      weight: profile.weight,
      goal: profile.goal,
      level: profile.level,
      activity_level: profile.activityLevel,
      uses_supplements: profile.usesSupplements,
      supplements: profile.supplements,
      start_date: profile.startDate,
      updated_at: new Date().toISOString(),
    })

  if (error) {
    console.error("Error saving profile:", error)
  }
}

// ---- Measurements ----
export async function getMeasurements(): Promise<BodyMeasurement[]> {
  const userId = await getUserId()
  if (!userId) return []

  const supabase = createClient()
  const { data, error } = await supabase
    .from("body_measurements")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: false })

  if (error || !data) return []

  return data.map((m) => ({
    id: m.id,
    date: m.date,
    weight: Number(m.weight),
    bodyFat: m.body_fat ? Number(m.body_fat) : undefined,
    chest: m.chest ? Number(m.chest) : undefined,
    waist: m.waist ? Number(m.waist) : undefined,
    hips: m.hips ? Number(m.hips) : undefined,
    bicepsLeft: m.biceps_left ? Number(m.biceps_left) : undefined,
    bicepsRight: m.biceps_right ? Number(m.biceps_right) : undefined,
    thighLeft: m.thigh_left ? Number(m.thigh_left) : undefined,
    thighRight: m.thigh_right ? Number(m.thigh_right) : undefined,
    calfLeft: m.calf_left ? Number(m.calf_left) : undefined,
    calfRight: m.calf_right ? Number(m.calf_right) : undefined,
  }))
}

export async function saveMeasurement(m: BodyMeasurement): Promise<void> {
  const userId = await getUserId()
  if (!userId) return

  const supabase = createClient()
  const { error } = await supabase
    .from("body_measurements")
    .upsert({
      id: m.id,
      user_id: userId,
      date: m.date,
      weight: m.weight,
      body_fat: m.bodyFat ?? null,
      chest: m.chest ?? null,
      waist: m.waist ?? null,
      hips: m.hips ?? null,
      biceps_left: m.bicepsLeft ?? null,
      biceps_right: m.bicepsRight ?? null,
      thigh_left: m.thighLeft ?? null,
      thigh_right: m.thighRight ?? null,
      calf_left: m.calfLeft ?? null,
      calf_right: m.calfRight ?? null,
    })

  if (error) console.error("Error saving measurement:", error)
}

export async function deleteMeasurement(id: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase
    .from("body_measurements")
    .delete()
    .eq("id", id)

  if (error) console.error("Error deleting measurement:", error)
}

// ---- Routines ----
export async function getRoutines(): Promise<Routine[]> {
  const userId = await getUserId()
  if (!userId) return suggestedRoutines

  const supabase = createClient()
  const { data: routinesData, error } = await supabase
    .from("routines")
    .select("*, exercises(*)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error || !routinesData) return suggestedRoutines

  const dbRoutines: Routine[] = routinesData.map((r) => ({
    id: r.id,
    name: r.name,
    description: r.description || "",
    isSuggested: r.is_suggested || false,
    createdAt: r.created_at,
    exercises: (r.exercises || [])
      .sort((a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order)
      .map((e: { id: string; name: string; muscle_group: string; sets: Exercise["sets"] }) => ({
        id: e.id,
        name: e.name,
        muscleGroup: e.muscle_group,
        sets: e.sets || [],
      })),
  }))

  // Merge suggested routines if not already present
  const all = [
    ...suggestedRoutines.filter(
      (s) => !dbRoutines.find((c) => c.id === s.id)
    ),
    ...dbRoutines,
  ]
  return all
}

export async function saveRoutine(r: Routine): Promise<void> {
  const userId = await getUserId()
  if (!userId) return

  const supabase = createClient()

  // Upsert routine
  const { error: routineError } = await supabase
    .from("routines")
    .upsert({
      id: r.id,
      user_id: userId,
      name: r.name,
      description: r.description,
      is_suggested: r.isSuggested || false,
    })

  if (routineError) {
    console.error("Error saving routine:", routineError)
    return
  }

  // Delete existing exercises for this routine and re-insert
  await supabase
    .from("exercises")
    .delete()
    .eq("routine_id", r.id)

  if (r.exercises.length > 0) {
    const { error: exError } = await supabase
      .from("exercises")
      .insert(
        r.exercises.map((e, idx) => ({
          id: e.id,
          routine_id: r.id,
          user_id: userId,
          name: e.name,
          muscle_group: e.muscleGroup,
          sets: e.sets,
          sort_order: idx,
        }))
      )

    if (exError) console.error("Error saving exercises:", exError)
  }
}

export async function deleteRoutine(id: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase
    .from("routines")
    .delete()
    .eq("id", id)

  if (error) console.error("Error deleting routine:", error)
}

// ---- Workout Logs ----
export async function getWorkoutLogs(): Promise<WorkoutLog[]> {
  const userId = await getUserId()
  if (!userId) return []

  const supabase = createClient()
  const { data, error } = await supabase
    .from("workout_logs")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: false })

  if (error || !data) return []

  return data.map((log) => ({
    id: log.id,
    routineId: log.routine_id || "",
    date: log.date,
    exercises: log.exercises || [],
    duration: log.duration ?? undefined,
    notes: log.notes ?? undefined,
  }))
}

export async function saveWorkoutLog(log: WorkoutLog): Promise<void> {
  const userId = await getUserId()
  if (!userId) return

  const supabase = createClient()
  const { error } = await supabase
    .from("workout_logs")
    .upsert({
      id: log.id,
      user_id: userId,
      routine_id: log.routineId || null,
      date: log.date,
      exercises: log.exercises,
      duration: log.duration ?? null,
      notes: log.notes ?? null,
    })

  if (error) console.error("Error saving workout log:", error)
}

// ---- Meal Logs ----
export async function getMealLogs(): Promise<DailyMealLog[]> {
  const userId = await getUserId()
  if (!userId) return []

  const supabase = createClient()
  const { data, error } = await supabase
    .from("daily_meal_logs")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: false })

  if (error || !data) return []

  return data.map((log) => ({
    id: log.id,
    date: log.date,
    meals: log.meals || { breakfast: [], lunch: [], dinner: [], snacks: [] },
  }))
}

export async function saveMealLog(log: DailyMealLog): Promise<void> {
  const userId = await getUserId()
  if (!userId) return

  const supabase = createClient()
  const { error } = await supabase
    .from("daily_meal_logs")
    .upsert({
      id: log.id,
      user_id: userId,
      date: log.date,
      meals: log.meals,
    })

  if (error) console.error("Error saving meal log:", error)
}

// ---- Food Database ----
export async function getFoods(): Promise<FoodItem[]> {
  const userId = await getUserId()
  if (!userId) return defaultFoods

  const supabase = createClient()
  const { data, error } = await supabase
    .from("custom_foods")
    .select("*")
    .eq("user_id", userId)

  if (error || !data) return defaultFoods

  const customFoods: FoodItem[] = data.map((f) => ({
    id: f.id,
    name: f.name,
    calories: Number(f.calories),
    protein: Number(f.protein),
    carbs: Number(f.carbs),
    fat: Number(f.fat),
    serving: f.serving,
  }))

  return [...defaultFoods, ...customFoods]
}

export async function addFood(food: FoodItem): Promise<void> {
  const userId = await getUserId()
  if (!userId) return

  const supabase = createClient()
  const { error } = await supabase
    .from("custom_foods")
    .insert({
      id: food.id,
      user_id: userId,
      name: food.name,
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fat: food.fat,
      serving: food.serving,
    })

  if (error) console.error("Error adding food:", error)
}

// ---- Sign Out ----
export async function signOutUser(): Promise<void> {
  const supabase = createClient()
  await supabase.auth.signOut()
  window.location.href = "/auth/login"
}
