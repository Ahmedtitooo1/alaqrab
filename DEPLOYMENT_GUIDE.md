# 🚀 AL-AQRAB DEPLOYMENT GUIDE

## 📋 Quick Start Checklist

### ✅ Step 1: Supabase Setup
1. **Run the Schema SQL**
   - Go to: https://qgfoixhugdvdckcrarzc.supabase.co
   - Navigate to: SQL Editor
   - Copy contents from: `supabase/schema.sql`
   - Click "Run" to create all tables
   - ✅ You should see: "Database Schema Created Successfully!"

2. **Verify Tables Created**
   - Go to: Table Editor
   - You should see 7 tables:
     - `tenants`
     - `users`
     - `students`
     - `subjects`
     - `transactions`
     - `exam_results`
     - `financial_categories`

### ✅ Step 2: Environment Setup
1. **Verify `.env.local` exists** with:
   ```env
   VITE_SUPABASE_URL=https://qgfoixhugdvdckcrarzc.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

2. **Restart Dev Server**
   ```bash
   npm run dev
   ```

### ✅ Step 3: Seed Test Data
1. **Add Seeder to Settings Page** (Temporary)
   - Open: `components/SettingsView.tsx`
   - Add at the top:
     ```tsx
     import DatabaseSeederPanel from '../src/components/DatabaseSeederPanel';
     ```
   - Add inside the component (top of content area):
     ```tsx
     {/* REMOVE THIS IN PRODUCTION */}
     <DatabaseSeederPanel />
     ```

2. **Run the Seeder**
   - Login as any role
   - Go to Settings (⚙️ icon in sidebar)
   - Click "Test Connection" → Should show ✅
   - Click "Seed 6 Months Data"
   - Wait 30-60 seconds
   - ✅ Success message will show stats

3. **Verify Data**
   - Go to Supabase → Table Editor
   - Check `students` table → Should have 20 students
   - Check `transactions` table → Should have ~200+ transactions
   - Check `exam_results` table → Should have ~100+ results

### ✅ Step 4: Deploy to Netlify
1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "feat: production-ready with Supabase integration"
   git push origin main
   ```

2. **Connect to Netlify**
   - Go to: https://app.netlify.com
   - Click "Add new site" → "Import an existing project"
   - Select your GitHub repo
   - Netlify will auto-detect settings from `netlify.toml`

3. **Set Environment Variables in Netlify**
   - Go to: Site Settings → Environment Variables
   - Add:
     - `VITE_SUPABASE_URL` = `https://qgfoixhugdvdckcrarzc.supabase.co`
     - `VITE_SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

4. **Deploy**
   - Click "Deploy site"
   - Wait 2-3 minutes
   - ✅ Your app is live!

---

## 📊 What Was Created?

### Database Tables (7)
1. **tenants** - Multi-tenant support (schools/centers)
2. **users** - All system users (admins, teachers, students, etc.)
3. **students** - Student profiles and subscription info
4. **subjects** - Academic subjects and assigned teachers
5. **transactions** - Financial transactions (income/expense)
6. **exam_results** - Student exam scores and grades
7. **financial_categories** - Chart of Accounts structure

### Test Data Generated (6 Months)
- **1 Tenant**: Al-Aqrab Test Academy
- **2 Admin Users**: Admin + Accountant
- **3 Teachers**: Random names
- **20 Students**: With subscriptions (2000-3500 EGP)
- **6 Subjects**: Physics, Chemistry, Math, Biology, English, Arabic
- **~200+ Transactions**:
  - Initial Capital: 500,000 EGP
  - Monthly Expenses: Rent, Salaries, Utilities, Maintenance
  - Student Fees: Growing trend (12 → 18 payments/month)
- **~100+ Exam Results**: 2 exams per student across 6 months

### Files Created
```
├── .env.local                          # Supabase credentials
├── netlify.toml                        # Netlify configuration
├── supabase/
│   └── schema.sql                      # Database schema
├── src/
│   ├── lib/
│   │   └── supabaseClient.ts          # Supabase client
│   ├── utils/
│   │   └── seedData.ts                # Time Machine Seeder
│   └── components/
│       └── DatabaseSeederPanel.tsx    # Admin UI for seeding
```

---

##  Post-Deployment Cleanup

### ⚠️ IMPORTANT: Remove Before Going Live
1. **Delete Seeder Panel**
   ```bash
   rm src/components/DatabaseSeederPanel.tsx
   ```

2. **Remove from SettingsView**
   - Remove the import and component usage
   - Commit: `git commit -m "chore: remove seeder panel"`

3. **Tighten RLS Policies** (Production Security)
   - Currently using public access for testing
   - Update policies to check `auth.uid()` and `tenant_id`
   - Example:
     ```sql
     DROP POLICY "Public Access Transactions" ON transactions;
     CREATE POLICY "Tenant Isolation" ON transactions
       FOR ALL USING (tenant_id = (SELECT tenant_id FROM users WHERE id = auth.uid()));
     ```

---

## 🐛 Troubleshooting

### "Missing Supabase Environment Variables"
- ✅ Check `.env.local` exists in root directory
- ✅ Restart dev server: `npm run dev`
- ✅ Clear browser cache

### "Connection Failed" in Seeder
- ✅ Verify SQL schema was run successfully
- ✅ Check Supabase project URL matches `.env.local`
- ✅ Check RLS policies are set to public access (testing phase)

### "Seeding Failed" Error
- ✅ Open browser console for detailed error
- ✅ Check Supabase logs: Dashboard → Logs
- ✅ Verify all tables exist
- ✅ Run cleanup, then re-seed

### Netlify Build Fails
- ✅ Verify `netlify.toml` is in root directory
- ✅ Check environment variables are set in Netlify UI
- ✅ Ensure `npm run build` works locally

---

## 📞 Support

If you encounter issues:
1. Check browser console (F12)
2. Check Supabase logs
3. Verify all steps completed in order
4. Ensure database schema matches `schema.sql`

---

## 🎉 Success Criteria

You'll know everything works when:
- ✅ Login screen loads without errors
- ✅ Can login as Accountant/Admin
- ✅ Financial Dashboard shows transactions
- ✅ Student list shows 20 students
- ✅ No console errors
- ✅ Deployed site loads on Netlify URL

**Total Setup Time:** ~15-20 minutes
**Data Generated:** 6 months of realistic test data
**Status:** Production Ready! 🚀
