-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ==========================================
-- 1. CORE & AUTH
-- ==========================================

-- Institutions (Tenants)
create table if not exists "institutions" (
  "id" text primary key,
  "name" text not null,
  "type" text,
  "subdomain" text,
  "logo" text,
  "permissions" jsonb default '{}',
  "limits" jsonb default '{}',
  "pricing" jsonb default '{}',
  "paymentHistory" jsonb default '[]',
  "expiryDate" text,
  "status" text,
  "revenue" numeric default 0,
  "defaultCurrency" text,
  "currencies" jsonb default '[]',
  "created_at" timestamp with time zone default timezone('utc'::text, now())
);

-- Users
create table if not exists "users" (
  "id" text primary key,
  "code" text,
  "firstName" text,
  "lastName" text,
  "username" text,
  "password" text, -- Added for migration compatibility
  "role" text,
  "institutionId" text references "institutions"("id"),
  "teacherId" text,
  "parentId" text,
  "email" text,
  "phone" text,
  "aiQuestionsCount" integer default 0,
  "salary" numeric,
  "allowances" numeric,
  "deductions" numeric,
  "jobTitle" text,
  "balance" numeric default 0,
  "subscriptionAmount" numeric,
  "paidAmount" numeric,
  "nextRenewalDate" text,
  "created_at" timestamp with time zone default timezone('utc'::text, now())
);

-- ==========================================
-- 2. FINANCIAL SYSTEM
-- ==========================================

-- Fiscal Years
create table if not exists "fiscal_years" (
  "id" text primary key,
  "name" text,
  "startDate" text,
  "endDate" text,
  "status" text,
  "institutionId" text references "institutions"("id"),
  "created_at" timestamp with time zone default timezone('utc'::text, now())
);

-- Financial Categories
create table if not exists "financial_categories" (
  "id" text primary key,
  "name" text,
  "code" text,
  "type" text,
  "parentId" text,
  "level" integer,
  "isDynamic" boolean default false,
  "institutionId" text references "institutions"("id"),
  "created_at" timestamp with time zone default timezone('utc'::text, now())
);

-- Financial Funds (Banks/Safes)
create table if not exists "financial_funds" (
  "id" text primary key,
  "name" text,
  "type" text,
  "balance" numeric default 0,
  "accountCode" text,
  "publicAccountNumber" text,
  "isPublicToGuardians" boolean default false,
  "institutionId" text references "institutions"("id"),
  "accountDescription" text,
  "created_at" timestamp with time zone default timezone('utc'::text, now())
);

-- Financial Entries (Journal/Transactions)
create table if not exists "financial_entries" (
  "id" text primary key,
  "date" text,
  "description" text,
  "amount" numeric,
  "debitAccount" text,
  "creditAccount" text,
  "institutionId" text references "institutions"("id"),
  "refType" text,
  "attachment" text,
  "lines" jsonb default '[]',
  "costCenter" text,
  "currency" text,
  "exchangeRate" numeric,
  "isPosted" boolean default true,
  "isCanceled" boolean default false,
  "targetId" text, -- Links to User/Supplier
  "created_at" timestamp with time zone default timezone('utc'::text, now())
);

-- Liabilities
create table if not exists "liabilities" (
  "id" text primary key,
  "title" text,
  "category" text,
  "amount" numeric,
  "dueDate" text,
  "status" text,
  "notes" text,
  "institutionId" text references "institutions"("id"),
  "created_at" timestamp with time zone default timezone('utc'::text, now())
);

-- Payroll Records
create table if not exists "payroll_records" (
  "id" text primary key,
  "userId" text references "users"("id"),
  "amount" numeric,
  "date" text,
  "status" text,
  "month" integer,
  "year" integer,
  "institutionId" text references "institutions"("id"),
  "created_at" timestamp with time zone default timezone('utc'::text, now())
);

-- Family Wallets
create table if not exists "family_wallets" (
  "parentId" text primary key, -- Assuming parentId is unique
  "balance" numeric default 0,
  "linkedStudentIds" jsonb default '[]',
  "institutionId" text references "institutions"("id"),
  "transactions" jsonb default '[]',
  "created_at" timestamp with time zone default timezone('utc'::text, now())
);

-- Payment Requests
create table if not exists "payment_requests" (
  "id" text primary key,
  "studentId" text,
  "studentName" text,
  "parentId" text,
  "parentName" text,
  "amount" numeric,
  "paymentMethod" text,
  "fundId" text,
  "fundName" text,
  "status" text,
  "submittedDate" text,
  "reviewedDate" text,
  "reviewedBy" text,
  "receiptData" jsonb,
  "notes" text,
  "institutionId" text references "institutions"("id"),
  "created_at" timestamp with time zone default timezone('utc'::text, now())
);

-- Adjustment Requests
create table if not exists "adjustment_requests" (
  "id" text primary key,
  "studentId" text references "users"("id"),
  "amount" numeric,
  "reasonCategory" text,
  "description" text,
  "requestedBy" text,
  "approvedBy" text,
  "status" text,
  "date" text,
  "institutionId" text references "institutions"("id"),
  "created_at" timestamp with time zone default timezone('utc'::text, now())
);

-- ==========================================
-- 3. INVENTORY & SUPPLY
-- ==========================================

-- Suppliers
create table if not exists "suppliers" (
  "id" text primary key,
  "code" text,
  "name" text,
  "phone" text,
  "email" text,
  "address" text,
  "balance" numeric default 0,
  "institutionId" text references "institutions"("id"),
  "created_at" timestamp with time zone default timezone('utc'::text, now())
);

-- Inventory Items
create table if not exists "inventory_items" (
  "id" text primary key,
  "code" text,
  "name" text,
  "category" text,
  "quantity" numeric default 0,
  "unitPrice" numeric default 0,
  "minQuantity" numeric default 0,
  "location" text,
  "accountCode" text,
  "supplierId" text references "suppliers"("id"),
  "institutionId" text references "institutions"("id"),
  "created_at" timestamp with time zone default timezone('utc'::text, now())
);

-- Inventory Transactions
create table if not exists "inventory_transactions" (
  "id" text primary key,
  "itemId" text references "inventory_items"("id"),
  "type" text, 
  "quantity" numeric,
  "date" text,
  "description" text,
  "supplierId" text,
  "refNo" text,
  "unitPrice" numeric,
  "institutionId" text references "institutions"("id"),
  "created_at" timestamp with time zone default timezone('utc'::text, now())
);

-- ==========================================
-- 4. ACADEMIC & OPERATIONS
-- ==========================================

-- Behavior Records
create table if not exists "behavior_records" (
  "id" text primary key,
  "studentId" text references "users"("id"),
  "studentName" text,
  "date" text,
  "type" text,
  "category" text,
  "severity" text,
  "description" text,
  "actionTaken" text,
  "reportedBy" text,
  "institutionId" text references "institutions"("id"),
  "created_at" timestamp with time zone default timezone('utc'::text, now())
);

-- Exams
create table if not exists "exams" (
  "id" text primary key,
  "title" text,
  "subject" text,
  "duration" integer,
  "totalPoints" numeric,
  "questions" jsonb default '[]',
  "status" text,
  "institutionId" text references "institutions"("id"),
  "teacherId" text references "users"("id"),
  "created_at" timestamp with time zone default timezone('utc'::text, now())
);

-- Assignments
create table if not exists "assignments" (
  "id" text primary key,
  "title" text,
  "description" text,
  "dueDate" text,
  "courseId" text,
  "subject" text,
  "teacherId" text references "users"("id"),
  "status" text,
  "points" numeric,
  "questions" jsonb default '[]',
  "studentsSubmitted" integer default 0,
  "institutionId" text references "institutions"("id"),
  "created_at" timestamp with time zone default timezone('utc'::text, now())
);

-- Assignment Submissions
create table if not exists "assignment_submissions" (
  "id" text primary key,
  "assignmentId" text references "assignments"("id"),
  "studentId" text references "users"("id"),
  "studentName" text,
  "fileUrl" text,
  "files" jsonb,
  "submittedAt" text,
  "status" text,
  "grade" numeric,
  "institutionId" text references "institutions"("id"),
  "created_at" timestamp with time zone default timezone('utc'::text, now())
);

-- Learning Paths
create table if not exists "learning_paths" (
  "id" text primary key,
  "studentId" text references "users"("id"),
  "title" text,
  "description" text,
  "modules" jsonb default '[]',
  "steps" jsonb default '[]',
  "progress" numeric default 0,
  "institutionId" text references "institutions"("id"),
  "created_at" timestamp with time zone default timezone('utc'::text, now())
);

-- Announcements
create table if not exists "announcements" (
  "id" text primary key,
  "title" text,
  "content" text,
  "type" text,
  "status" text,
  "date" text,
  "authorId" text,
  "authorName" text,
  "authorRole" text,
  "mediaUrl" text,
  "mediaType" text,
  "eventDate" text,
  "institutionId" text references "institutions"("id"),
  "created_at" timestamp with time zone default timezone('utc'::text, now())
);

-- Tickets (Maintenance/IT)
create table if not exists "tickets" (
  "id" text primary key,
  "title" text,
  "description" text,
  "priority" text,
  "status" text,
  "category" text,
  "createdBy" text,
  "assignedTo" text,
  "createdAt" text,
  "updatedAt" text,
  "comments" jsonb,
  "institutionId" text references "institutions"("id")
);

-- Notifications
create table if not exists "notifications" (
  "id" text primary key,
  "title" text,
  "content" text,
  "date" text,
  "isRead" boolean default false,
  "type" text,
  "userId" text references "users"("id"),
  "institutionId" text references "institutions"("id"),
  "created_at" timestamp with time zone default timezone('utc'::text, now())
);

-- Certificates
create table if not exists "certificate_templates" (
  "id" text primary key,
  "name" text,
  "type" text,
  "backgroundImage" text,
  "elements" jsonb default '[]',
  "layout" jsonb,
  "createdAt" text,
  "institutionId" text references "institutions"("id")
);

-- Grading Formulas
create table if not exists "grading_formulas" (
  "id" text primary key,
  "name" text,
  "subjectId" text,
  "components" jsonb default '[]',
  "createdAt" text,
  "institutionId" text references "institutions"("id")
);

-- Custom Fields
create table if not exists "custom_field_definitions" (
  "id" text primary key,
  "label" text,
  "key" text,
  "type" text,
  "required" boolean default false,
  "options" jsonb default '[]',
  "targetRole" text,
  "institutionId" text references "institutions"("id")
);

-- ==========================================
-- 5. ANALYTICS & MARKETPLACE
-- ==========================================

-- Student Progress
create table if not exists "student_progress" (
  "userId" text references "users"("id"),
  "subject" text,
  "monthlyScores" jsonb default '[]',
  "attendanceRate" numeric,
  "strengths" jsonb default '[]',
  "weaknesses" jsonb default '[]',
  "recommendations" jsonb default '[]',
  "institutionId" text references "institutions"("id"),
  primary key ("userId", "subject")
);

-- Proctoring Logs
create table if not exists "proctoring_logs" (
  "id" text primary key,
  "studentId" text references "users"("id"),
  "examId" text references "exams"("id"),
  "action" text,
  "timestamp" text,
  "severity" text,
  "institutionId" text references "institutions"("id"),
  "created_at" timestamp with time zone default timezone('utc'::text, now())
);

-- Marketplace Items
create table if not exists "marketplace_items" (
  "id" text primary key,
  "title" text,
  "description" text,
  "price" numeric default 0,
  "author" text,
  "rating" numeric,
  "sales" integer default 0,
  "image" text,
  "category" text,
  "teacherName" text,
  "type" text,
  "thumbnail" text,
  "institutionId" text references "institutions"("id"),
  "created_at" timestamp with time zone default timezone('utc'::text, now())
);

-- Achievements
create table if not exists "achievements" (
  "id" text primary key,
  "title" text,
  "description" text,
  "icon" text,
  "points" integer,
  "type" text,
  "institutionId" text references "institutions"("id"),
  "created_at" timestamp with time zone default timezone('utc'::text, now())
);

-- ==========================================
-- 6. SECURITY & REALTIME
-- ==========================================

-- Enable RLS
DO $$ 
DECLARE 
    tbl text;
BEGIN 
    FOR tbl IN 
        SELECT tablename FROM pg_tables WHERE schemaname = 'public' 
    LOOP 
        EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY;', tbl);
        BEGIN
            EXECUTE format('CREATE POLICY "Enable all access" ON %I FOR ALL USING (true) WITH CHECK (true);', tbl);
        EXCEPTION WHEN duplicate_object THEN NULL;
        END;
    END LOOP; 
END $$;

-- ENABLE REALTIME FOR ALL TABLES
begin;
  -- If publication exists, we will add tables. If not, create it.
  -- Supabase defaults to 'supabase_realtime' publication.
  
  -- Core
  alter publication supabase_realtime add table institutions;
  alter publication supabase_realtime add table users;
  
  -- Financials
  alter publication supabase_realtime add table financial_entries;
  alter publication supabase_realtime add table financial_funds;
  alter publication supabase_realtime add table financial_categories;
  alter publication supabase_realtime add table suppliers;
  alter publication supabase_realtime add table inventory_items;
  alter publication supabase_realtime add table inventory_transactions;
  
  -- Operations
  alter publication supabase_realtime add table tickets;
  alter publication supabase_realtime add table behavior_records;
  alter publication supabase_realtime add table exams;
  alter publication supabase_realtime add table announcements;
  alter publication supabase_realtime add table assignments;
  alter publication supabase_realtime add table notifications;
  
  -- Analytics
  alter publication supabase_realtime add table student_progress;
  alter publication supabase_realtime add table marketplace_items;
commit;
