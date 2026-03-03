// ========================================
// Fitness calculation utilities
// Contains all formulas: BMI, BMR, 1RM,
// macros, projections, etc.
// ========================================

import type { UserProfile, NutritionTarget, BodyMeasurement, Exercise } from "./types"

/**
 * Calculate BMI (Body Mass Index)
 * Formula: weight(kg) / height(m)^2
 */
export function calculateBMI(weight: number, heightCm: number): number {
  const heightM = heightCm / 100
  return Math.round((weight / (heightM * heightM)) * 10) / 10
}

/**
 * Get BMI category label
 */
export function getBMICategory(bmi: number): { label: string; color: string } {
  if (bmi < 18.5) return { label: "Bajo peso", color: "text-info" }
  if (bmi < 25) return { label: "Normal", color: "text-success" }
  if (bmi < 30) return { label: "Sobrepeso", color: "text-warning" }
  return { label: "Obesidad", color: "text-destructive" }
}

/**
 * Calculate BMR (Basal Metabolic Rate) using Mifflin-St Jeor
 * Men: 10 * weight + 6.25 * height - 5 * age + 5
 * Women: 10 * weight + 6.25 * height - 5 * age - 161
 */
export function calculateBMR(weight: number, heightCm: number, age: number, gender: "male" | "female"): number {
  const base = 10 * weight + 6.25 * heightCm - 5 * age
  return Math.round(gender === "male" ? base + 5 : base - 161)
}

/**
 * Get activity multiplier for TDEE
 */
export function getActivityMultiplier(level: string): number {
  const multipliers: Record<string, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  }
  return multipliers[level] || 1.55
}

/**
 * Calculate TDEE (Total Daily Energy Expenditure)
 */
export function calculateTDEE(bmr: number, activityLevel: string): number {
  return Math.round(bmr * getActivityMultiplier(activityLevel))
}

/**
 * Calculate target calories based on goal
 */
export function calculateTargetCalories(tdee: number, goal: string): number {
  switch (goal) {
    case "lose_weight":
      return tdee - 400
    case "gain_muscle":
      return tdee + 350
    case "recomposition":
      return tdee // slight surplus on training days
    default:
      return tdee
  }
}

/**
 * Calculate macronutrient distribution
 */
export function calculateMacros(calories: number, weight: number, goal: string): NutritionTarget {
  let proteinPerKg: number
  switch (goal) {
    case "lose_weight":
      proteinPerKg = 2.2
      break
    case "gain_muscle":
      proteinPerKg = 2.0
      break
    default:
      proteinPerKg = 1.8
  }

  const protein = Math.round(weight * proteinPerKg)
  const fatCalories = calories * 0.25
  const fat = Math.round(fatCalories / 9)
  const proteinCalories = protein * 4
  const carbs = Math.round((calories - proteinCalories - fatCalories) / 4)

  return { calories, protein, carbs, fat }
}

/**
 * Calculate 1RM using Epley formula
 * 1RM = weight * (1 + reps / 30)
 */
export function calculate1RM(weight: number, reps: number): number {
  if (reps === 1) return weight
  return Math.round(weight * (1 + reps / 30))
}

/**
 * Generate intensity percentage table based on 1RM
 */
export function getIntensityTable(oneRM: number): { percentage: number; weight: number; reps: string }[] {
  return [
    { percentage: 100, weight: Math.round(oneRM), reps: "1" },
    { percentage: 95, weight: Math.round(oneRM * 0.95), reps: "2" },
    { percentage: 90, weight: Math.round(oneRM * 0.9), reps: "3-4" },
    { percentage: 85, weight: Math.round(oneRM * 0.85), reps: "5-6" },
    { percentage: 80, weight: Math.round(oneRM * 0.8), reps: "7-8" },
    { percentage: 75, weight: Math.round(oneRM * 0.75), reps: "9-10" },
    { percentage: 70, weight: Math.round(oneRM * 0.7), reps: "11-12" },
    { percentage: 65, weight: Math.round(oneRM * 0.65), reps: "13-15" },
    { percentage: 60, weight: Math.round(oneRM * 0.6), reps: "16-20" },
  ]
}

/**
 * Calculate body fat percentage estimate (US Navy method simplified)
 */
export function estimateBodyFat(
  gender: "male" | "female",
  waist: number,
  height: number,
  neck?: number,
  hips?: number
): number | null {
  if (!neck) return null
  if (gender === "male") {
    const bf = 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height)) - 450
    return Math.round(bf * 10) / 10
  } else {
    if (!hips) return null
    const bf = 495 / (1.29579 - 0.35004 * Math.log10(waist + hips - neck) + 0.22100 * Math.log10(height)) - 450
    return Math.round(bf * 10) / 10
  }
}

/**
 * Project strength improvement over months
 * Beginners: ~2.5% per week, Intermediate: ~1% per week, Advanced: ~0.5% per week
 */
export function projectStrength(
  current1RM: number,
  level: string,
  months: number
): number {
  const weeklyGain: Record<string, number> = {
    beginner: 0.025,
    intermediate: 0.01,
    advanced: 0.005,
  }
  const rate = weeklyGain[level] || 0.01
  const weeks = months * 4.33
  return Math.round(current1RM * Math.pow(1 + rate, weeks))
}

/**
 * Project body weight change over months
 */
export function projectWeight(
  currentWeight: number,
  goal: string,
  months: number
): number {
  // Healthy rates: lose ~0.5kg/week, gain ~0.25kg/week
  const weeklyChange: Record<string, number> = {
    lose_weight: -0.45,
    gain_muscle: 0.25,
    maintain: 0,
    recomposition: 0,
  }
  const weekly = weeklyChange[goal] || 0
  const weeks = months * 4.33
  return Math.round((currentWeight + weekly * weeks) * 10) / 10
}

/**
 * Get the best set from an exercise (highest estimated 1RM)
 */
export function getBest1RMFromExercise(exercise: Exercise): number {
  if (!exercise.sets.length) return 0
  return Math.max(...exercise.sets.map((s) => calculate1RM(s.weight, s.reps)))
}

/**
 * Format date to locale string
 */
export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}
