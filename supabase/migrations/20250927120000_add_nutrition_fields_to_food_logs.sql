-- Add nutrition columns to food_logs table
ALTER TABLE food_logs
  ADD COLUMN custom_food_carbs numeric,
  ADD COLUMN custom_food_protein numeric,
  ADD COLUMN custom_food_fats numeric,
  ADD COLUMN custom_food_fibre numeric,
  ADD COLUMN custom_food_sugar numeric,
  ADD COLUMN custom_food_sodium numeric,
  ADD COLUMN custom_food_calcium numeric,
  ADD COLUMN custom_food_iron numeric,
  ADD COLUMN custom_food_vitamin_c numeric,
  ADD COLUMN custom_food_folate numeric;
