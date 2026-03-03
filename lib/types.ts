// ========================================
// Core types for the fitness application
// ========================================

export interface UserProfile {
  id: string
  name: string
  age: number
  gender: "male" | "female"
  height: number // cm
  weight: number // kg
  goal: "lose_weight" | "gain_muscle" | "maintain" | "recomposition"
  level: "beginner" | "intermediate" | "advanced"
  activityLevel: "sedentary" | "light" | "moderate" | "active" | "very_active"
  startDate: string
  usesSupplements: boolean
  supplements: string[]
}

export interface BodyMeasurement {
  id: string
  date: string
  weight: number
  bodyFat?: number
  chest?: number
  waist?: number
  hips?: number
  bicepsLeft?: number
  bicepsRight?: number
  thighLeft?: number
  thighRight?: number
  calfLeft?: number
  calfRight?: number
}

export interface Exercise {
  id: string
  name: string
  muscleGroup: string
  sets: ExerciseSet[]
}

export interface ExerciseSet {
  reps: number
  weight: number
}

export interface Routine {
  id: string
  name: string
  description: string
  exercises: Exercise[]
  createdAt: string
  isSuggested?: boolean
}

export interface WorkoutLog {
  id: string
  routineId: string
  date: string
  exercises: Exercise[]
  duration?: number
  notes?: string
}

export interface MealEntry {
  id: string
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
}

export interface DailyMealLog {
  id: string
  date: string
  meals: {
    breakfast: MealEntry[]
    lunch: MealEntry[]
    dinner: MealEntry[]
    snacks: MealEntry[]
  }
}

export interface NutritionTarget {
  calories: number
  protein: number
  carbs: number
  fat: number
}

export interface FoodItem {
  id: string
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  serving: string
}

export type AppView =
  | "dashboard"
  | "profile"
  | "measurements"
  | "routines"
  | "nutrition"
  | "projections"
  | "supplements"
  | "help"
