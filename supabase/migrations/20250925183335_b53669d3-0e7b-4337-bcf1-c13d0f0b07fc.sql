-- First, create storage buckets for chat files and profile pictures
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('chat-files', 'chat-files', false),
  ('profile-pictures', 'profile-pictures', true);

-- Create chats table for patient-doctor associations
CREATE TABLE public.chats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL,
  doctor_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(patient_id, doctor_id)
);

-- Add new columns to chat_messages table one by one
ALTER TABLE public.chat_messages ADD COLUMN chat_id UUID;
ALTER TABLE public.chat_messages ADD COLUMN attachment_url TEXT;
ALTER TABLE public.chat_messages ADD COLUMN attachment_type TEXT;
ALTER TABLE public.chat_messages ADD COLUMN read_at TIMESTAMP WITH TIME ZONE;

-- Now add the foreign key constraint
ALTER TABLE public.chat_messages ADD CONSTRAINT fk_chat_messages_chat_id 
  FOREIGN KEY (chat_id) REFERENCES public.chats(id);

-- Create food_logs table
CREATE TABLE public.food_logs (
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
ALTER TABLE public.recipes ADD COLUMN rasa TEXT;
ALTER TABLE public.recipes ADD COLUMN cuisine TEXT;
ALTER TABLE public.recipes ADD COLUMN diet_type TEXT; -- veg, vegan, non-veg
ALTER TABLE public.recipes ADD COLUMN calories_per_serving INTEGER;
ALTER TABLE public.recipes ADD COLUMN cooking_time_minutes INTEGER;
ALTER TABLE public.recipes ADD COLUMN difficulty_level TEXT; -- easy, medium, hard
ALTER TABLE public.recipes ADD COLUMN image_url TEXT;

-- Create recipe_favorites table
CREATE TABLE public.recipe_favorites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  recipe_id UUID NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, recipe_id)
);

-- Add profile picture columns to patients and doctors
ALTER TABLE public.patients ADD COLUMN profile_pic_url TEXT;
ALTER TABLE public.doctors ADD COLUMN profile_pic_url TEXT;

-- Create gyan_modules table
CREATE TABLE public.gyan_modules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content_html TEXT NOT NULL,
  image_url TEXT,
  video_url TEXT,
  topic TEXT, -- Diet, Digestion, Dinacharya, Seasonal food
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create gyan_progress table to track completion
CREATE TABLE public.gyan_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL,
  module_id UUID NOT NULL REFERENCES public.gyan_modules(id) ON DELETE CASCADE,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(patient_id, module_id)
);

-- Add theme preference to patients and doctors
ALTER TABLE public.patients ADD COLUMN theme_preference TEXT DEFAULT 'light';
ALTER TABLE public.doctors ADD COLUMN theme_preference TEXT DEFAULT 'light';