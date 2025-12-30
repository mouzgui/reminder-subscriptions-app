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

## 2. Disable Email Confirmation (Recommended for Mobile Apps)

Email confirmation redirects don't work well with mobile apps because Supabase can't redirect to app custom URL schemes.

**To disable email confirmation:**

1. Go to your **Supabase Project Dashboard**
2. Click **Authentication** in the left sidebar
3. Click **Providers** tab (at the top)
4. Expand the **Email** section
5. Toggle OFF **"Confirm email"**
6. Click **Save**

Now users will be logged in immediately after sign up without needing to confirm their email.

---

## 3. Alternative: Keep Email Confirmation (Advanced)

If you need email confirmation, you'll need to:

1. Set up a web page that handles the confirmation redirect
2. That web page then opens your app using the custom URL scheme
3. This requires hosting a simple redirect page

For most mobile apps, disabling email confirmation (Option 2 above) is simpler and sufficient.

