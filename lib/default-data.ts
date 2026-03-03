// ========================================
// Default data: food database, suggested
// routines, supplement info, and FAQ content
// ========================================

import type { FoodItem, Routine } from "./types"

// ---- Food Database ----
export const defaultFoods: FoodItem[] = [
  { id: "f1", name: "Pechuga de pollo (100g)", calories: 165, protein: 31, carbs: 0, fat: 3.6, serving: "100g" },
  { id: "f2", name: "Arroz blanco cocido (100g)", calories: 130, protein: 2.7, carbs: 28, fat: 0.3, serving: "100g" },
  { id: "f3", name: "Huevo entero", calories: 155, protein: 13, carbs: 1.1, fat: 11, serving: "100g" },
  { id: "f4", name: "Avena (100g)", calories: 389, protein: 16.9, carbs: 66, fat: 6.9, serving: "100g" },
  { id: "f5", name: "Platano", calories: 89, protein: 1.1, carbs: 23, fat: 0.3, serving: "1 unidad" },
  { id: "f6", name: "Atun en agua (100g)", calories: 116, protein: 26, carbs: 0, fat: 1, serving: "100g" },
  { id: "f7", name: "Papa cocida (100g)", calories: 77, protein: 2, carbs: 17, fat: 0.1, serving: "100g" },
  { id: "f8", name: "Leche entera (250ml)", calories: 149, protein: 8, carbs: 12, fat: 8, serving: "250ml" },
  { id: "f9", name: "Pan integral (rebanada)", calories: 69, protein: 3.6, carbs: 12, fat: 1.1, serving: "1 rebanada" },
  { id: "f10", name: "Aguacate (100g)", calories: 160, protein: 2, carbs: 9, fat: 15, serving: "100g" },
  { id: "f11", name: "Pasta cocida (100g)", calories: 131, protein: 5, carbs: 25, fat: 1.1, serving: "100g" },
  { id: "f12", name: "Carne de res magra (100g)", calories: 250, protein: 26, carbs: 0, fat: 15, serving: "100g" },
  { id: "f13", name: "Salmon (100g)", calories: 208, protein: 20, carbs: 0, fat: 13, serving: "100g" },
  { id: "f14", name: "Brocoli (100g)", calories: 34, protein: 2.8, carbs: 7, fat: 0.4, serving: "100g" },
  { id: "f15", name: "Queso cottage (100g)", calories: 98, protein: 11, carbs: 3.4, fat: 4.3, serving: "100g" },
  { id: "f16", name: "Yogur griego (100g)", calories: 59, protein: 10, carbs: 3.6, fat: 0.7, serving: "100g" },
  { id: "f17", name: "Almendras (30g)", calories: 164, protein: 6, carbs: 6, fat: 14, serving: "30g" },
  { id: "f18", name: "Batata/Camote (100g)", calories: 86, protein: 1.6, carbs: 20, fat: 0.1, serving: "100g" },
  { id: "f19", name: "Whey Protein (scoop)", calories: 120, protein: 24, carbs: 3, fat: 1.5, serving: "30g" },
  { id: "f20", name: "Aceite de oliva (1 cda)", calories: 119, protein: 0, carbs: 0, fat: 14, serving: "15ml" },
]

// ---- Suggested Routines ----
export const suggestedRoutines: Routine[] = [
  {
    id: "sr1",
    name: "Push (Empuje)",
    description: "Pecho, hombros y triceps. Ideal para principiantes e intermedios.",
    isSuggested: true,
    createdAt: new Date().toISOString(),
    exercises: [
      { id: "e1", name: "Press de banca", muscleGroup: "Pecho", sets: [{ reps: 10, weight: 40 }, { reps: 8, weight: 45 }, { reps: 6, weight: 50 }] },
      { id: "e2", name: "Press militar", muscleGroup: "Hombros", sets: [{ reps: 10, weight: 25 }, { reps: 8, weight: 30 }, { reps: 8, weight: 30 }] },
      { id: "e3", name: "Aperturas con mancuernas", muscleGroup: "Pecho", sets: [{ reps: 12, weight: 12 }, { reps: 12, weight: 12 }, { reps: 10, weight: 14 }] },
      { id: "e4", name: "Elevaciones laterales", muscleGroup: "Hombros", sets: [{ reps: 15, weight: 8 }, { reps: 12, weight: 10 }, { reps: 12, weight: 10 }] },
      { id: "e5", name: "Fondos en paralelas", muscleGroup: "Triceps", sets: [{ reps: 12, weight: 0 }, { reps: 10, weight: 0 }, { reps: 10, weight: 0 }] },
    ],
  },
  {
    id: "sr2",
    name: "Pull (Jalon)",
    description: "Espalda y biceps. Complemento perfecto del dia Push.",
    isSuggested: true,
    createdAt: new Date().toISOString(),
    exercises: [
      { id: "e6", name: "Dominadas", muscleGroup: "Espalda", sets: [{ reps: 8, weight: 0 }, { reps: 6, weight: 0 }, { reps: 6, weight: 0 }] },
      { id: "e7", name: "Remo con barra", muscleGroup: "Espalda", sets: [{ reps: 10, weight: 40 }, { reps: 8, weight: 45 }, { reps: 8, weight: 45 }] },
      { id: "e8", name: "Jalon al pecho", muscleGroup: "Espalda", sets: [{ reps: 12, weight: 35 }, { reps: 10, weight: 40 }, { reps: 10, weight: 40 }] },
      { id: "e9", name: "Curl de biceps", muscleGroup: "Biceps", sets: [{ reps: 12, weight: 10 }, { reps: 10, weight: 12 }, { reps: 10, weight: 12 }] },
      { id: "e10", name: "Curl martillo", muscleGroup: "Biceps", sets: [{ reps: 12, weight: 10 }, { reps: 10, weight: 12 }, { reps: 10, weight: 12 }] },
    ],
  },
  {
    id: "sr3",
    name: "Legs (Piernas)",
    description: "Cuadriceps, isquiotibiales y gluteos. Nunca saltes el dia de piernas.",
    isSuggested: true,
    createdAt: new Date().toISOString(),
    exercises: [
      { id: "e11", name: "Sentadilla", muscleGroup: "Cuadriceps", sets: [{ reps: 10, weight: 50 }, { reps: 8, weight: 60 }, { reps: 6, weight: 70 }] },
      { id: "e12", name: "Peso muerto rumano", muscleGroup: "Isquiotibiales", sets: [{ reps: 10, weight: 40 }, { reps: 8, weight: 50 }, { reps: 8, weight: 50 }] },
      { id: "e13", name: "Prensa de piernas", muscleGroup: "Cuadriceps", sets: [{ reps: 12, weight: 80 }, { reps: 10, weight: 90 }, { reps: 10, weight: 100 }] },
      { id: "e14", name: "Extension de cuadriceps", muscleGroup: "Cuadriceps", sets: [{ reps: 15, weight: 25 }, { reps: 12, weight: 30 }, { reps: 12, weight: 30 }] },
      { id: "e15", name: "Elevacion de talones", muscleGroup: "Pantorrillas", sets: [{ reps: 20, weight: 30 }, { reps: 15, weight: 35 }, { reps: 15, weight: 35 }] },
    ],
  },
]

// ---- Supplement Information ----
export const supplementInfo = [
  {
    id: "whey",
    name: "Whey Protein",
    description: "Proteina de suero de leche de rapida absorcion. Ideal para despues de entrenar.",
    benefits: ["Favorece la recuperacion muscular", "Alto valor biologico", "Rapida absorcion", "Facil de preparar"],
    dosage: "1-2 scoops (25-50g) post-entrenamiento",
    proteinPerScoop: 24,
  },
  {
    id: "creatine",
    name: "Creatina Monohidrato",
    description: "Uno de los suplementos mas estudiados y efectivos para aumentar fuerza y rendimiento.",
    benefits: ["Aumenta la fuerza maxima", "Mejora el rendimiento en series cortas", "Favorece la ganancia muscular", "Segura y bien tolerada"],
    dosage: "3-5g diarios, todos los dias",
    proteinPerScoop: 0,
  },
  {
    id: "omega3",
    name: "Omega 3",
    description: "Acidos grasos esenciales con multiples beneficios para la salud.",
    benefits: ["Reduce la inflamacion", "Mejora la salud cardiovascular", "Favorece la recuperacion", "Mejora la funcion cerebral"],
    dosage: "1-3g diarios con comidas",
    proteinPerScoop: 0,
  },
  {
    id: "multivitamin",
    name: "Multivitaminico",
    description: "Complemento para cubrir micronutrientes que pueden faltar en la dieta.",
    benefits: ["Cubre deficiencias nutricionales", "Apoya el sistema inmune", "Mejora niveles de energia", "Favorece la salud general"],
    dosage: "1 capsula diaria con el desayuno",
    proteinPerScoop: 0,
  },
]

// ---- FAQ Content ----
export const faqContent = [
  {
    question: "Como calculo mi 1RM?",
    answer: "El 1RM (Repeticion Maxima) se calcula con la formula de Epley: 1RM = Peso x (1 + Repeticiones / 30). Esta formula estima el peso maximo que puedes levantar una sola vez basandose en el peso y repeticiones que realizas.",
  },
  {
    question: "Que es la TMB?",
    answer: "La Tasa Metabolica Basal (TMB) es la cantidad de energia que tu cuerpo necesita en reposo para mantener funciones vitales. Se calcula con la formula de Mifflin-St Jeor considerando peso, altura, edad y genero.",
  },
  {
    question: "Como saber si estoy en superavit o deficit calorico?",
    answer: "Si tu objetivo es ganar musculo, necesitas un superavit calorico (comer mas de lo que gastas, +300-500 kcal). Si quieres perder grasa, necesitas un deficit calorico (comer menos, -300-500 kcal).",
  },
  {
    question: "Cada cuanto debo medir mi progreso?",
    answer: "Se recomienda pesarte 1 vez por semana, siempre en las mismas condiciones (por la manana, en ayunas). Las medidas corporales cada 2-4 semanas.",
  },
  {
    question: "Cuanta proteina necesito al dia?",
    answer: "Para ganar musculo: 1.6-2.2g por kg de peso corporal. Para mantener: 1.2-1.6g por kg. Para perder grasa: 1.8-2.4g por kg (mas alta para preservar musculo).",
  },
  {
    question: "Es necesario tomar suplementos?",
    answer: "No son estrictamente necesarios si tu dieta es completa. Sin embargo, la creatina y la proteina whey son los mas respaldados por la ciencia para mejorar rendimiento y recuperacion.",
  },
  {
    question: "Que es el IMC y como se interpreta?",
    answer: "El Indice de Masa Corporal (IMC) = peso(kg) / altura(m)^2. Bajo peso: <18.5, Normal: 18.5-24.9, Sobrepeso: 25-29.9, Obesidad: >30. Nota: no distingue entre masa muscular y grasa.",
  },
  {
    question: "Cuantos dias a la semana debo entrenar?",
    answer: "Principiantes: 3-4 dias. Intermedios: 4-5 dias. Avanzados: 5-6 dias. Siempre incluye al menos 1-2 dias de descanso por semana.",
  },
]

// ---- Educational Guides ----
export const guides = [
  {
    title: "Guia de Principiante",
    content: "Si acabas de empezar, enfocate en aprender la tecnica correcta de los ejercicios basicos (sentadilla, peso muerto, press de banca, press militar). Usa pesos ligeros las primeras 2-4 semanas. Entrena 3 veces por semana con al menos 1 dia de descanso entre sesiones.",
  },
  {
    title: "Sobrecarga Progresiva",
    content: "El principio mas importante para progresar: incrementar gradualmente la demanda sobre tus musculos. Puedes hacerlo aumentando peso, repeticiones, series o reduciendo tiempos de descanso. Intenta aumentar el peso un 2.5-5% cada 1-2 semanas.",
  },
  {
    title: "Importancia del Descanso",
    content: "El musculo crece durante el descanso, no durante el entrenamiento. Duerme 7-9 horas por noche. Deja al menos 48 horas entre entrenamientos del mismo grupo muscular. Los dias de descanso activo (caminar, estirar) favorecen la recuperacion.",
  },
  {
    title: "Nutricion para el Gimnasio",
    content: "Come suficiente proteina (1.6-2.2g/kg), distribuida en 3-5 comidas al dia. Los carbohidratos son tu combustible para entrenar con intensidad. Las grasas saludables regulan tus hormonas. Hidratate bien: 2-3 litros de agua al dia.",
  },
]
