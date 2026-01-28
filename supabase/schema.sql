-- Clean up existing tables if they exist (Be careful: this deletes existing data!)
DROP TABLE IF EXISTS public.attendance_logs CASCADE;
DROP TABLE IF EXISTS public.payments CASCADE;
DROP TABLE IF EXISTS public.scholarship_applications CASCADE;
DROP TABLE IF EXISTS public.scholarships CASCADE;
DROP TABLE IF EXISTS public.student_journeys CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  student_id TEXT UNIQUE,
  name TEXT,
  email TEXT UNIQUE,
  avatar_url TEXT,
  role TEXT DEFAULT 'student' CHECK (role IN ('student', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create sequence for Student ID
CREATE SEQUENCE IF NOT EXISTS public.student_id_seq START 1;

-- Function to generate formatted Student ID (e.g., RFB-2026-0001)
CREATE OR REPLACE FUNCTION public.generate_student_id()
RETURNS TEXT AS $$
BEGIN
  RETURN 'RFB-' || to_char(CURRENT_DATE, 'YYYY') || '-' || LPAD(nextval('public.student_id_seq')::text, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- Create student_journeys table
CREATE TABLE public.student_journeys (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  readiness_percent INTEGER DEFAULT 0,
  attendance_rate INTEGER DEFAULT 0,
  pending_assignments INTEGER DEFAULT 0,
  last_mock_score DECIMAL(3, 1),
  tuition_status TEXT DEFAULT 'Pending' CHECK (tuition_status IN ('Cleared', 'Pending', 'Overdue')),
  registration_date DATE DEFAULT CURRENT_DATE,
  course_study_status TEXT DEFAULT 'In Progress',
  mock_exams_date DATE,
  target_exam_date DATE,
  study_days_count INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create attendance log table
CREATE TABLE public.attendance_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  check_in TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  status TEXT DEFAULT 'Present'
);

-- Create payments table
CREATE TABLE public.payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'Paid',
  paid_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create scholarships table
CREATE TABLE public.scholarships (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  university TEXT NOT NULL,
  country TEXT NOT NULL,
  country_code TEXT,
  amount TEXT,
  deadline DATE,
  category TEXT,
  description TEXT,
  requirements TEXT[],
  slots INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create scholarship_applications table
CREATE TABLE public.scholarship_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  scholarship_id UUID REFERENCES public.scholarships(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Reviewing', 'Accepted', 'Rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for scholarship_applications
ALTER TABLE public.scholarship_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own applications" ON public.scholarship_applications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all applications" ON public.scholarship_applications
  FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Enable RLS for scholarships
ALTER TABLE public.scholarships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to scholarships" ON public.scholarships
  FOR SELECT USING (true);

-- Trigger to create a profile automatically when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, student_id, name, avatar_url, role, email)
  VALUES (
    new.id, 
    CASE WHEN new.email = 'eleazerlagat60@gmail.com' THEN NULL ELSE public.generate_student_id() END,
    new.raw_user_meta_data->>'name', 
    new.raw_user_meta_data->>'avatar_url', 
    CASE WHEN new.email = 'eleazerlagat60@gmail.com' THEN 'admin' ELSE 'student' END,
    new.email
  )
  ON CONFLICT (id) DO NOTHING;
  
  -- Also create an initial journey record only for students
  IF (new.email != 'eleazerlagat60@gmail.com') THEN
    INSERT INTO public.student_journeys (user_id)
    VALUES (new.id)
    ON CONFLICT DO NOTHING;
  END IF;
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable RLS and basic policies for other tables
ALTER TABLE public.attendance_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_journeys ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile." ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Students can view their own journey." ON public.student_journeys
  FOR SELECT USING (auth.uid() = user_id);

-- Helper function to check admin role without recursion
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Admin Global Policies (Fixed recursion using SECURITY DEFINER helper)
CREATE POLICY "Admins have full access to profiles" ON public.profiles
  FOR ALL USING (public.is_admin());

CREATE POLICY "Admins have full access to journeys" ON public.student_journeys
  FOR ALL USING (public.is_admin());

CREATE POLICY "Admins can manage logs" ON public.attendance_logs
  FOR ALL USING (public.is_admin());

CREATE POLICY "Admins can manage payments" ON public.payments
  FOR ALL USING (public.is_admin());

-- Function to sync existing users (Run this once if users aren't appearing)
DROP FUNCTION IF EXISTS public.sync_missing_profiles();
CREATE OR REPLACE FUNCTION public.sync_missing_profiles()
RETURNS TEXT 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  prof_count INTEGER;
  journ_count INTEGER;
BEGIN
  -- 1. Ensure every auth user has a profile
  WITH inserted_profiles AS (
    INSERT INTO public.profiles (id, student_id, email, name, role)
    SELECT 
      id, 
      CASE WHEN email = 'eleazerlagat60@gmail.com' THEN NULL ELSE public.generate_student_id() END,
      email, 
      COALESCE(raw_user_meta_data->>'name', split_part(email, '@', 1)),
      CASE WHEN email = 'eleazerlagat60@gmail.com' THEN 'admin' ELSE 'student' END
    FROM auth.users
    WHERE id NOT IN (SELECT id FROM public.profiles)
    ON CONFLICT (id) DO NOTHING
    RETURNING id
  )
  SELECT count(*) INTO prof_count FROM inserted_profiles;

  -- 1.1 Backfill missing student_ids for students
  UPDATE public.profiles 
  SET student_id = public.generate_student_id() 
  WHERE student_id IS NULL AND role = 'student';

  -- 2. Ensure every profile has a journey
  WITH inserted_journeys AS (
    INSERT INTO public.student_journeys (user_id)
    SELECT id FROM public.profiles
    WHERE id NOT IN (SELECT user_id FROM public.student_journeys)
    AND role = 'student'
    ON CONFLICT DO NOTHING
    RETURNING id
  )
  SELECT count(*) INTO journ_count FROM inserted_journeys;

  RETURN 'Sync Successful: ' || prof_count || ' profiles and ' || journ_count || ' journeys created.';
END;
$$;

-- Run sync immediately one time and show result
SELECT public.sync_missing_profiles() AS sync_result;

-- Update Admin Role specifically for the account in the screenshot
UPDATE public.profiles SET role = 'admin' WHERE email = 'eleazerlagat60@gmail.com';
