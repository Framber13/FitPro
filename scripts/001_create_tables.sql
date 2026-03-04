-- ========================================
-- FitPro Database Schema
-- Tables: profiles, body_measurements, routines, exercises, 
--         workout_logs, workout_log_exercises, daily_meal_logs, 
--         meal_entries, custom_foods
-- ========================================

-- 1. Profiles table (references auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  age integer not null,
  gender text not null check (gender in ('male', 'female')),
  height numeric not null,
  weight numeric not null,
  goal text not null check (goal in ('lose_weight', 'gain_muscle', 'maintain', 'recomposition')),
  level text not null check (level in ('beginner', 'intermediate', 'advanced')),
  activity_level text not null check (activity_level in ('sedentary', 'light', 'moderate', 'active', 'very_active')),
  uses_supplements boolean default false,
  supplements text[] default '{}',
  start_date timestamptz default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);
create policy "profiles_delete_own" on public.profiles for delete using (auth.uid() = id);

-- 2. Body measurements
create table if not exists public.body_measurements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null default current_date,
  weight numeric not null,
  body_fat numeric,
  chest numeric,
  waist numeric,
  hips numeric,
  biceps_left numeric,
  biceps_right numeric,
  thigh_left numeric,
  thigh_right numeric,
  calf_left numeric,
  calf_right numeric,
  created_at timestamptz default now()
);

alter table public.body_measurements enable row level security;
create policy "measurements_select_own" on public.body_measurements for select using (auth.uid() = user_id);
create policy "measurements_insert_own" on public.body_measurements for insert with check (auth.uid() = user_id);
create policy "measurements_update_own" on public.body_measurements for update using (auth.uid() = user_id);
create policy "measurements_delete_own" on public.body_measurements for delete using (auth.uid() = user_id);

-- 3. Routines
create table if not exists public.routines (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text default '',
  is_suggested boolean default false,
  created_at timestamptz default now()
);

alter table public.routines enable row level security;
create policy "routines_select_own" on public.routines for select using (auth.uid() = user_id);
create policy "routines_insert_own" on public.routines for insert with check (auth.uid() = user_id);
create policy "routines_update_own" on public.routines for update using (auth.uid() = user_id);
create policy "routines_delete_own" on public.routines for delete using (auth.uid() = user_id);

-- 4. Exercises (belong to a routine)
create table if not exists public.exercises (
  id uuid primary key default gen_random_uuid(),
  routine_id uuid not null references public.routines(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  muscle_group text not null,
  sets jsonb not null default '[]',
  sort_order integer default 0,
  created_at timestamptz default now()
);

alter table public.exercises enable row level security;
create policy "exercises_select_own" on public.exercises for select using (auth.uid() = user_id);
create policy "exercises_insert_own" on public.exercises for insert with check (auth.uid() = user_id);
create policy "exercises_update_own" on public.exercises for update using (auth.uid() = user_id);
create policy "exercises_delete_own" on public.exercises for delete using (auth.uid() = user_id);

-- 5. Workout logs
create table if not exists public.workout_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  routine_id uuid references public.routines(id) on delete set null,
  date date not null default current_date,
  exercises jsonb not null default '[]',
  duration integer,
  notes text,
  created_at timestamptz default now()
);

alter table public.workout_logs enable row level security;
create policy "workout_logs_select_own" on public.workout_logs for select using (auth.uid() = user_id);
create policy "workout_logs_insert_own" on public.workout_logs for insert with check (auth.uid() = user_id);
create policy "workout_logs_update_own" on public.workout_logs for update using (auth.uid() = user_id);
create policy "workout_logs_delete_own" on public.workout_logs for delete using (auth.uid() = user_id);

-- 6. Daily meal logs
create table if not exists public.daily_meal_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null default current_date,
  meals jsonb not null default '{"breakfast":[],"lunch":[],"dinner":[],"snacks":[]}',
  created_at timestamptz default now()
);

alter table public.daily_meal_logs enable row level security;
create policy "meal_logs_select_own" on public.daily_meal_logs for select using (auth.uid() = user_id);
create policy "meal_logs_insert_own" on public.daily_meal_logs for insert with check (auth.uid() = user_id);
create policy "meal_logs_update_own" on public.daily_meal_logs for update using (auth.uid() = user_id);
create policy "meal_logs_delete_own" on public.daily_meal_logs for delete using (auth.uid() = user_id);

-- 7. Custom foods (user-added foods beyond defaults)
create table if not exists public.custom_foods (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  calories numeric not null,
  protein numeric not null,
  carbs numeric not null,
  fat numeric not null,
  serving text not null,
  created_at timestamptz default now()
);

alter table public.custom_foods enable row level security;
create policy "foods_select_own" on public.custom_foods for select using (auth.uid() = user_id);
create policy "foods_insert_own" on public.custom_foods for insert with check (auth.uid() = user_id);
create policy "foods_update_own" on public.custom_foods for update using (auth.uid() = user_id);
create policy "foods_delete_own" on public.custom_foods for delete using (auth.uid() = user_id);
