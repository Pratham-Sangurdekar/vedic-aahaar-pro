-- Fix RLS policy for doctors table to allow patients to view all doctors
-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Doctors can view their own profile" ON public.doctors;

-- Create a new policy that allows doctors to view their own profile
CREATE POLICY "Doctors can view their own profile" 
ON public.doctors 
FOR SELECT 
USING (auth.uid() = id);

-- Create a new policy that allows patients to view all doctors
CREATE POLICY "Patients can view all doctors" 
ON public.doctors 
FOR SELECT 
USING (auth.uid() IN (SELECT id FROM public.patients));

-- Create a policy that allows anyone to view doctors (for public doctor listings)
-- This is more permissive and allows the chat interface to work
CREATE POLICY "Anyone can view doctors" 
ON public.doctors 
FOR SELECT 
USING (true);


