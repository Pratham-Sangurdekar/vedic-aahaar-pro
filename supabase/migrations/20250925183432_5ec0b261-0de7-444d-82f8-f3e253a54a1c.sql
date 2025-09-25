-- Only create buckets if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'chat-files') THEN
        INSERT INTO storage.buckets (id, name, public) VALUES ('chat-files', 'chat-files', false);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'profile-pictures') THEN
        INSERT INTO storage.buckets (id, name, public) VALUES ('profile-pictures', 'profile-pictures', true);
    END IF;
END $$;

-- Create chats table for patient-doctor associations
CREATE TABLE IF NOT EXISTS public.chats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL,
  doctor_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(patient_id, doctor_id)
);

-- Add new columns to chat_messages table
ALTER TABLE public.chat_messages ADD COLUMN IF NOT EXISTS chat_id UUID REFERENCES public.chats(id);
ALTER TABLE public.chat_messages ADD COLUMN IF NOT EXISTS attachment_url TEXT;
ALTER TABLE public.chat_messages ADD COLUMN IF NOT EXISTS attachment_type TEXT;
ALTER TABLE public.chat_messages ADD COLUMN IF NOT EXISTS read_at TIMESTAMP WITH TIME ZONE;

-- Create food_logs table
CREATE TABLE IF NOT EXISTS public.food_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  recipe_id UUID REFERENCES public.recipes(id),
  custom_food_name TEXT,
  custom_food_calories INTEGER,
  quantity DECIMAL(5,2) DEFAULT 1.0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Update recipes table for better search and filtering
ALTER TABLE public.recipes ADD COLUMN IF NOT EXISTS rasa TEXT;
ALTER TABLE public.recipes ADD COLUMN IF NOT EXISTS cuisine TEXT;
ALTER TABLE public.recipes ADD COLUMN IF NOT EXISTS diet_type TEXT;
ALTER TABLE public.recipes ADD COLUMN IF NOT EXISTS calories_per_serving INTEGER;
ALTER TABLE public.recipes ADD COLUMN IF NOT EXISTS cooking_time_minutes INTEGER;
ALTER TABLE public.recipes ADD COLUMN IF NOT EXISTS difficulty_level TEXT;
ALTER TABLE public.recipes ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Create recipe_favorites table
CREATE TABLE IF NOT EXISTS public.recipe_favorites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  recipe_id UUID NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, recipe_id)
);

-- Add profile picture columns to patients and doctors
ALTER TABLE public.patients ADD COLUMN IF NOT EXISTS profile_pic_url TEXT;
ALTER TABLE public.doctors ADD COLUMN IF NOT EXISTS profile_pic_url TEXT;

-- Create gyan_modules table
CREATE TABLE IF NOT EXISTS public.gyan_modules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content_html TEXT NOT NULL,
  image_url TEXT,
  video_url TEXT,
  topic TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create gyan_progress table to track completion
CREATE TABLE IF NOT EXISTS public.gyan_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL,
  module_id UUID NOT NULL REFERENCES public.gyan_modules(id) ON DELETE CASCADE,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(patient_id, module_id)
);

-- Add theme preference to patients and doctors
ALTER TABLE public.patients ADD COLUMN IF NOT EXISTS theme_preference TEXT DEFAULT 'light';
ALTER TABLE public.doctors ADD COLUMN IF NOT EXISTS theme_preference TEXT DEFAULT 'light';