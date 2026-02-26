-- Website Analytics Table
-- Track visitor traffic to the public website

CREATE TABLE IF NOT EXISTS public.website_page_views (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    page_path TEXT NOT NULL,
    user_agent TEXT,
    referrer TEXT,
    session_id UUID, -- For tracking unique sessions
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.website_page_views ENABLE ROW LEVEL SECURITY;

-- Allow public to INSERT (log views)
CREATE POLICY "Allow public inserts for analytics" ON public.website_page_views
    FOR INSERT 
    WITH CHECK (true);

-- Allow admins to read analytics
CREATE POLICY "Allow admins to read analytics" ON public.website_page_views
    FOR SELECT 
    USING (public.is_admin());

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON public.website_page_views(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_views_session_id ON public.website_page_views(session_id);
