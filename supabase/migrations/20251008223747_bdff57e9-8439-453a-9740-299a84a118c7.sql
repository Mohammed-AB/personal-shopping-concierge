-- Create weekly_drops table
CREATE TABLE public.weekly_drops (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  price TEXT,
  drop_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.weekly_drops ENABLE ROW LEVEL SECURITY;

-- RLS Policies for weekly_drops (public read)
CREATE POLICY "Anyone can view active drops"
  ON public.weekly_drops FOR SELECT
  USING (is_active = true);

CREATE POLICY "Anyone can view all drops"
  ON public.weekly_drops FOR SELECT
  USING (true);

-- Create indexes
CREATE INDEX idx_weekly_drops_active ON public.weekly_drops(is_active, drop_date DESC);

-- Create trigger for updated_at
CREATE TRIGGER update_weekly_drops_updated_at
  BEFORE UPDATE ON public.weekly_drops
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();