-- Enable Row Level Security on new tables only (avoid issues with existing chat_messages)
ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipe_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gyan_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gyan_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies for chats
CREATE POLICY "Users can view their own chats" ON public.chats
FOR SELECT USING (auth.uid() = patient_id OR auth.uid() = doctor_id);

CREATE POLICY "Patients can create chats with doctors" ON public.chats
FOR INSERT WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Users can update their own chats" ON public.chats
FOR UPDATE USING (auth.uid() = patient_id OR auth.uid() = doctor_id);

-- RLS Policies for food_logs
CREATE POLICY "Patients can view their own food logs" ON public.food_logs
FOR SELECT USING (auth.uid() = patient_id);

CREATE POLICY "Patients can create their own food logs" ON public.food_logs
FOR INSERT WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Patients can update their own food logs" ON public.food_logs
FOR UPDATE USING (auth.uid() = patient_id);

CREATE POLICY "Patients can delete their own food logs" ON public.food_logs
FOR DELETE USING (auth.uid() = patient_id);

-- RLS Policies for recipe_favorites
CREATE POLICY "Users can view their own favorites" ON public.recipe_favorites
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own favorites" ON public.recipe_favorites
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites" ON public.recipe_favorites
FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for gyan_modules (public read)
CREATE POLICY "Anyone can view gyan modules" ON public.gyan_modules
FOR SELECT USING (true);

-- RLS Policies for gyan_progress
CREATE POLICY "Patients can view their own progress" ON public.gyan_progress
FOR SELECT USING (auth.uid() = patient_id);

CREATE POLICY "Patients can create their own progress" ON public.gyan_progress
FOR INSERT WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Patients can update their own progress" ON public.gyan_progress
FOR UPDATE USING (auth.uid() = patient_id);

CREATE POLICY "Patients can delete their own progress" ON public.gyan_progress
FOR DELETE USING (auth.uid() = patient_id);

-- Create triggers for updated_at
CREATE TRIGGER update_food_logs_updated_at
  BEFORE UPDATE ON public.food_logs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_gyan_modules_updated_at
  BEFORE UPDATE ON public.gyan_modules
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_chats_patient_doctor ON public.chats(patient_id, doctor_id);
CREATE INDEX idx_food_logs_patient_date ON public.food_logs(patient_id, date);
CREATE INDEX idx_recipes_search ON public.recipes USING gin(to_tsvector('english', title || ' ' || COALESCE(description, '')));
CREATE INDEX idx_gyan_modules_topic ON public.gyan_modules(topic);
CREATE INDEX idx_gyan_progress_patient ON public.gyan_progress(patient_id);