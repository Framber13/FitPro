// ========================================
// Centralized state management using SWR
// This module provides hooks and utilities
// for managing all app data with SWR's
// cache-based reactive state management.
// ========================================

import type {
  UserProfile,
  BodyMeasurement,
  Routine,
  WorkoutLog,
  DailyMealLog,
  FoodItem,
} from "./types"
import { defaultFoods, suggestedRoutines } from "./default-data"

// ---- Storage Keys ----
const KEYS = {
  profile: "fitpro-profile",
  measurements: "fitpro-measurements",
  routines: "fitpro-routines",
  workoutLogs: "fitpro-workout-logs",
  mealLogs: "fitpro-meal-logs",
  foods: "fitpro-foods",
} as const

// ---- Generic helpers ----
function getItem<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function setItem<T>(key: string, value: T) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(key, JSON.stringify(value))
}

// ---- Profile ----
export function getProfile(): UserProfile | null {
  return getItem<UserProfile | null>(KEYS.profile, null)
}

export function saveProfile(profile: UserProfile) {
  setItem(KEYS.profile, profile)
}

// ---- Measurements ----
export function getMeasurements(): BodyMeasurement[] {
  return getItem<BodyMeasurement[]>(KEYS.measurements, [])
}

export function saveMeasurement(m: BodyMeasurement) {
  const all = getMeasurements()
  const idx = all.findIndex((x) => x.id === m.id)
  if (idx >= 0) all[idx] = m
  else all.push(m)
  setItem(KEYS.measurements, all)
}

export function deleteMeasurement(id: string) {
  const all = getMeasurements().filter((x) => x.id !== id)
  setItem(KEYS.measurements, all)
}

// ---- Routines ----
export function getRoutines(): Routine[] {
  const custom = getItem<Routine[]>(KEYS.routines, [])
  // Merge suggested routines if not already present
  const all = [...suggestedRoutines.filter((s) => !custom.find((c) => c.id === s.id)), ...custom]
  return all
}

export function saveRoutine(r: Routine) {
  const all = getItem<Routine[]>(KEYS.routines, [])
  const idx = all.findIndex((x) => x.id === r.id)
  if (idx >= 0) all[idx] = r
  else all.push(r)
  setItem(KEYS.routines, all)
}

export function deleteRoutine(id: string) {
  const all = getItem<Routine[]>(KEYS.routines, []).filter((x) => x.id !== id)
  setItem(KEYS.routines, all)
}

// ---- Workout Logs ----
export function getWorkoutLogs(): WorkoutLog[] {
  return getItem<WorkoutLog[]>(KEYS.workoutLogs, [])
}

export function saveWorkoutLog(log: WorkoutLog) {
  const all = getWorkoutLogs()
  const idx = all.findIndex((x) => x.id === log.id)
  if (idx >= 0) all[idx] = log
  else all.push(log)
  setItem(KEYS.workoutLogs, all)
}

// ---- Meal Logs ----
export function getMealLogs(): DailyMealLog[] {
  return getItem<DailyMealLog[]>(KEYS.mealLogs, [])
}

export function saveMealLog(log: DailyMealLog) {
  const all = getMealLogs()
  const idx = all.findIndex((x) => x.id === log.id)
  if (idx >= 0) all[idx] = log
  else all.push(log)
  setItem(KEYS.mealLogs, all)
}

// ---- Food Database ----
export function getFoods(): FoodItem[] {
  const custom = getItem<FoodItem[]>(KEYS.foods, [])
  return [...defaultFoods, ...custom]
}

export function addFood(food: FoodItem) {
  const custom = getItem<FoodItem[]>(KEYS.foods, [])
  custom.push(food)
  setItem(KEYS.foods, custom)
}
