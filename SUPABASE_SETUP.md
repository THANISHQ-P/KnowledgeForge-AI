# Supabase Setup Guide for KnowForge AI

## Prerequisites
- A Supabase account (sign up at https://supabase.com)
- Access to your Supabase project

## Step 1: Create Supabase Project
1. Go to https://supabase.com
2. Sign in or create an account
3. Click "New Project"
4. Fill in the project name (e.g., "KnowForge AI")
5. Create a strong database password
6. Wait for the project to initialize

## Step 2: Get Your Credentials
1. Go to **Settings** → **API** in your Supabase dashboard
2. Copy:
   - **Project URL** → This is your `VITE_SUPABASE_URL`
   - **anon public key** → This is your `VITE_SUPABASE_ANON_KEY`

## Step 3: Add Credentials to Your Project
1. Open `frontend/.env.local`
2. Replace the placeholder values:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## Step 4: Create Database Tables
Run the following SQL in your Supabase SQL Editor (Go to **SQL Editor** → **New Query**):

### Users Profile Table
```sql
CREATE TABLE public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR NOT NULL,
  full_name VARCHAR,
  role VARCHAR CHECK (role IN ('Employee', 'Expert', 'Manager', 'Admin')) DEFAULT 'Employee',
  department VARCHAR,
  employee_id VARCHAR UNIQUE,
  avatar_url VARCHAR,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policy for users to read their own profile
CREATE POLICY "Users can read their own profile" 
ON public.user_profiles 
FOR SELECT 
USING (auth.uid() = id);

-- Create policy for users to update their own profile
CREATE POLICY "Users can update their own profile" 
ON public.user_profiles 
FOR UPDATE 
USING (auth.uid() = id);
```

### Machines Table
```sql
CREATE TABLE public.machines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  machine_id VARCHAR UNIQUE NOT NULL,
  machine_name VARCHAR NOT NULL,
  department VARCHAR,
  status VARCHAR CHECK (status IN ('Running', 'Maintenance', 'Offline', 'Idle')) DEFAULT 'Idle',
  location VARCHAR,
  last_maintenance TIMESTAMP,
  next_maintenance TIMESTAMP,
  manufacturer VARCHAR,
  model VARCHAR,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE public.machines ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users to read machines
CREATE POLICY "Authenticated users can read machines" 
ON public.machines 
FOR SELECT 
USING (auth.role() = 'authenticated');
```

### Knowledge Articles Table
```sql
CREATE TABLE public.knowledge_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR,
  tags TEXT[],
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  machine_id UUID REFERENCES public.machines(id) ON DELETE CASCADE,
  views INT DEFAULT 0,
  helpful_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE public.knowledge_articles ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users to read articles
CREATE POLICY "Authenticated users can read articles" 
ON public.knowledge_articles 
FOR SELECT 
USING (auth.role() = 'authenticated');
```

### Maintenance Logs Table
```sql
CREATE TABLE public.maintenance_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  machine_id UUID NOT NULL REFERENCES public.machines(id) ON DELETE CASCADE,
  maintenance_type VARCHAR CHECK (maintenance_type IN ('Preventive', 'Corrective', 'Predictive')),
  description TEXT,
  performed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  duration_hours INT,
  cost DECIMAL(10, 2),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE public.maintenance_logs ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users to read logs
CREATE POLICY "Authenticated users can read maintenance logs" 
ON public.maintenance_logs 
FOR SELECT 
USING (auth.role() = 'authenticated');
```

## Step 5: Enable Authentication
1. Go to **Authentication** → **Providers**
2. Enable "Email" provider (usually enabled by default)
3. Configure email templates if needed

## Step 6: Test the Setup
1. Restart your development server: `npm run dev`
2. Navigate to http://localhost:5173/login
3. Try signing up with a test account
4. Verify the user is created in Supabase **Authentication** → **Users**

## Available Authentication Functions

### In Your App
```javascript
import { useAuth } from './contexts/AuthContext';

function MyComponent() {
  const { user, login, signup, logout, isAuthenticated, loading } = useAuth();

  // Use these functions as needed
  const handleLogin = async () => {
    const result = await login('user@example.com', 'password');
    if (result.success) {
      // User logged in
    }
  };

  return (
    // Your component
  );
}
```

## Security Best Practices
1. **Never commit `.env.local`** - It's already in `.gitignore`
2. **Keep your anon key safe** - It's public-facing but has limited permissions
3. **Use Row Level Security (RLS)** - Enabled on all tables above
4. **Set strong passwords** - For your Supabase database
5. **Configure CORS** - In Supabase Settings if needed

## Troubleshooting

### "Supabase credentials not found" error
- Ensure `.env.local` exists with correct keys
- Restart the dev server after adding environment variables

### Authentication not working
- Check browser console for errors
- Verify email is registered in Supabase
- Ensure RLS policies are correct

### Tables not appearing
- Check SQL queries ran without errors
- Verify you're in the correct project
- Check the "Tables" section in Supabase dashboard

## Next Steps
1. Add logout functionality to Navbar
2. Create user profile page
3. Add role-based access control
4. Implement password reset functionality
5. Add two-factor authentication
