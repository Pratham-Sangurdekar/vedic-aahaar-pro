-- Create patients table
CREATE TABLE public.patients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  age INTEGER NOT NULL CHECK (age > 0 AND age <= 120),
  gender TEXT NOT NULL CHECK (gender IN ('male', 'female', 'other')),
  email TEXT NOT NULL UNIQUE,
  height FLOAT CHECK (height > 0),
  weight FLOAT CHECK (weight > 0),
  medical_history TEXT,
  food_preferences TEXT,
  food_restrictions TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create doctors table
CREATE TABLE public.doctors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  degree TEXT NOT NULL,
  institution TEXT NOT NULL,
  experience_years INTEGER NOT NULL CHECK (experience_years >= 0),
  specialization TEXT NOT NULL,
  certifications TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create recipes table
CREATE TABLE public.recipes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  ingredients TEXT[],
  instructions TEXT,
  author_id UUID REFERENCES public.doctors(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create doctor_posts table
CREATE TABLE public.doctor_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create diet_charts table
CREATE TABLE public.diet_charts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  generated_diet JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diet_charts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for patients (patients can only see their own data)
CREATE POLICY "Patients can view their own profile" 
ON public.patients 
FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Patients can update their own profile" 
ON public.patients 
FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Patients can insert their own profile" 
ON public.patients 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Create RLS policies for doctors (doctors can view their own data)
CREATE POLICY "Doctors can view their own profile" 
ON public.doctors 
FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Doctors can update their own profile" 
ON public.doctors 
FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Doctors can insert their own profile" 
ON public.doctors 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Create RLS policies for recipes (everyone can view, only author doctors can modify)
CREATE POLICY "Anyone can view recipes" 
ON public.recipes 
FOR SELECT 
USING (true);

CREATE POLICY "Doctors can insert their own recipes" 
ON public.recipes 
FOR INSERT 
WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Doctors can update their own recipes" 
ON public.recipes 
FOR UPDATE 
USING (auth.uid() = author_id);

CREATE POLICY "Doctors can delete their own recipes" 
ON public.recipes 
FOR DELETE 
USING (auth.uid() = author_id);

-- Create RLS policies for doctor_posts (everyone can view, only author can modify)
CREATE POLICY "Anyone can view doctor posts" 
ON public.doctor_posts 
FOR SELECT 
USING (true);

CREATE POLICY "Doctors can insert their own posts" 
ON public.doctor_posts 
FOR INSERT 
WITH CHECK (auth.uid() = doctor_id);

CREATE POLICY "Doctors can update their own posts" 
ON public.doctor_posts 
FOR UPDATE 
USING (auth.uid() = doctor_id);

CREATE POLICY "Doctors can delete their own posts" 
ON public.doctor_posts 
FOR DELETE 
USING (auth.uid() = doctor_id);

-- Create RLS policies for diet_charts (patients can only see their own)
CREATE POLICY "Patients can view their own diet charts" 
ON public.diet_charts 
FOR SELECT 
USING (auth.uid() = patient_id);

CREATE POLICY "Patients can insert their own diet charts" 
ON public.diet_charts 
FOR INSERT 
WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Patients can update their own diet charts" 
ON public.diet_charts 
FOR UPDATE 
USING (auth.uid() = patient_id);

-- Create function to handle automatic timestamp updates
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create indexes for better performance
CREATE INDEX idx_patients_email ON public.patients(email);
CREATE INDEX idx_doctors_email ON public.doctors(email);
CREATE INDEX idx_recipes_author ON public.recipes(author_id);
CREATE INDEX idx_doctor_posts_doctor ON public.doctor_posts(doctor_id);
CREATE INDEX idx_diet_charts_patient ON public.diet_charts(patient_id);