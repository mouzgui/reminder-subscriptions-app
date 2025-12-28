# Supabase Setup Guide

## 1. Create Database Tables

Go to your Supabase Dashboard → SQL Editor → Run this:

```sql
-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    renewal_date DATE NOT NULL,
    category TEXT,
    notes TEXT,
    is_active BOOLEAN DEFAULT true,
    reminder_days INTEGER[] DEFAULT '{7,1}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own subscriptions"
    ON subscriptions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscriptions"
    ON subscriptions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscriptions"
    ON subscriptions FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own subscriptions"
    ON subscriptions FOR DELETE
    USING (auth.uid() = user_id);
```

---

## 2. Configure Email Redirect URL

1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Set **Site URL** to your app's URL:
   - For development: `exp://` (or your tunnel URL)
   - For web: `http://localhost:8081`
3. Add to **Redirect URLs**:
   - `exp://`
   - `http://localhost:8081`
   - Your production URL later

---

## 3. Email Template (Optional)

Go to Authentication → Email Templates → Confirm Signup

Change the redirect link from:
```
{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=signup
```
To just:
```
{{ .SiteURL }}
```

This will redirect users to your site URL after confirmation.
