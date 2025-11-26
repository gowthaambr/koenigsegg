# How to Export Real User Profiles from Supabase

## Method 1: Using Supabase Dashboard (Recommended)

1. **Go to Supabase Dashboard:**
   - Visit https://supabase.com/dashboard
   - Select your project

2. **Navigate to Table Editor:**
   - Click "Table Editor" in the left sidebar
   - Select the `profiles` table

3. **Export to CSV:**
   - Click the "..." menu (three dots) at the top right of the table
   - Select "Download as CSV"
   - Save the file

## Method 2: Using SQL Query

1. **Go to SQL Editor:**
   - Click "SQL Editor" in the left sidebar
   - Create a new query

2. **Run this query:**
   ```sql
   SELECT 
       p.id,
       p.full_name,
       u.email,
       p.phone,
       p.country,
       p.is_ghost_squadron,
       p.created_at,
       p.updated_at
   FROM public.profiles p
   LEFT JOIN auth.users u ON p.id = u.id
   ORDER BY p.created_at DESC;
   ```

3. **Export Results:**
   - After running the query, click "Download CSV"

## Method 3: Using Supabase CLI

If you have Supabase CLI installed:

```bash
# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# Export profiles table
supabase db dump --data-only --table profiles > profiles.sql
```

## Method 4: Using JavaScript/TypeScript

Create a script to export data programmatically:

```typescript
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role key
)

async function exportProfiles() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
  
  if (error) {
    console.error('Error:', error)
    return
  }

  // Convert to CSV
  const headers = Object.keys(data[0]).join(',')
  const rows = data.map(row => Object.values(row).join(','))
  const csv = [headers, ...rows].join('\n')
  
  fs.writeFileSync('profiles-export.csv', csv)
  console.log('Export complete!')
}

exportProfiles()
```

## Notes:

- **Privacy:** Be careful with user data - ensure you comply with GDPR/privacy laws
- **Security:** Never commit CSV files with real user data to version control
- **Backup:** Regular exports are good for backup purposes
- **Sample Data:** The `profiles-sample.csv` file contains mock data for reference

## Current Status:

Since your database might not be set up yet (based on the earlier error), you may not have any real profiles to export. Once you:

1. Run the `supabase-complete-setup.sql` script
2. Have users sign up on your website
3. Profiles will be automatically created (via the trigger)

Then you can export real data using any of the methods above.
