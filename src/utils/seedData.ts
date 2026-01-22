import { supabase } from '../lib/supabaseClient';

/**
 * 🎰 AL-AQRAB TIME MACHINE SEEDER
 * Generates 6 months of realistic historical data for testing
 */

// === CONFIGURATION ===
const MONTHS_TO_GENERATE = 6;
const NUM_STUDENTS = 20;
const NUM_TEACHERS = 3;
const TENANT_NAME = 'Al-Aqrab Test Academy';

// Helper Functions
const getRandomElement = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomAmount = (min: number, max: number) => parseFloat((Math.random() * (max - min) + min).toFixed(2));

const arabicNames = {
    first: ['أحمد', 'محمد', 'عمر', 'علي', 'يوسف', 'إبراهيم', 'خالد', 'حسن', 'سارة', 'نور', 'ليلى', 'هناء', 'ملاك', 'سلمى', 'مريم'],
    last: ['علي', 'إبراهيم', 'محمد', 'أحمد', 'خالد', 'حسن', 'حسين', 'مصطفى', 'عادل', 'سامي', 'عزت', 'نبيل']
};

const subjects = ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'English', 'Arabic'];
const expenseCategories = [
    { name: 'Rent', code: '51002', amount: 5000 },
    { name: 'Salaries', code: '51001', amount: 25000 },
    { name: 'Utilities', code: '51003', amount: 1200 },
    { name: 'Maintenance', code: '51004', amount: 800 }
];

// === MAIN SEEDER FUNCTION ===
export const seedTestDatabase = async () => {
    console.log('🚀 Starting Time Machine Seeder...');
    console.log(`📅 Generating ${MONTHS_TO_GENERATE} months of historical data`);

    try {
        // STEP 1: Create Tenant
        console.log('1️⃣ Creating test tenant...');
        const { data: tenant, error: tenantError } = await supabase
            .from('tenants')
            .insert([{
                name: TENANT_NAME,
                type: 'center',
                subdomain: 'alaqrab-test',
                subscription_end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                status: 'active'
            }])
            .select()
            .single();

        if (tenantError) throw tenantError;
        const tenantId = tenant.id;
        console.log(`✅ Tenant created: ${tenant.name} (ID: ${tenantId})`);

        // STEP 2: Create Admin & Accountant
        console.log('2️⃣ Creating admin users...');
        const adminUsers = [
            {
                tenant_id: tenantId,
                email: 'admin@alaqrab.test',
                username: 'admin',
                full_name: 'سامح الإداري',
                role: 'admin'
            },
            {
                tenant_id: tenantId,
                email: 'accountant@alaqrab.test',
                username: 'accountant',
                full_name: 'منى المحاسبة',
                role: 'accountant'
            }
        ];

        const { error: adminError } = await supabase.from('users').insert(adminUsers);
        if (adminError) throw adminError;
        console.log('✅ Admin users created');

        // STEP 3: Create Teachers
        console.log('3️⃣ Creating teachers...');
        const teachersData = Array.from({ length: NUM_TEACHERS }).map((_, i) => ({
            tenant_id: tenantId,
            email: `teacher${i + 1}@alaqrab.test`,
            username: `teacher${i + 1}`,
            full_name: `${getRandomElement(arabicNames.first)} ${getRandomElement(arabicNames.last)}`,
            role: 'teacher'
        }));

        const { data: teachers, error: teacherError } = await supabase
            .from('users')
            .insert(teachersData)
            .select();

        if (teacherError) throw teacherError;
        console.log(`✅ Created ${teachers?.length} teachers`);

        // STEP 4: Create Subjects
        console.log('4️⃣ Creating subjects...');
        const subjectsData = subjects.map((name, i) => ({
            tenant_id: tenantId,
            name,
            code: `SUB-${i + 1}`,
            teacher_id: teachers?.[i % teachers.length]?.id,
            grade_level: 'Grade 10'
        }));

        const { data: subjectRecords, error: subjectError } = await supabase
            .from('subjects')
            .insert(subjectsData)
            .select();

        if (subjectError) throw subjectError;
        console.log(`✅ Created ${subjectRecords?.length} subjects`);

        // STEP 5: Create Students
        console.log('5️⃣ Creating students...');
        const studentsData = Array.from({ length: NUM_STUDENTS }).map((_, i) => ({
            tenant_id: tenantId,
            student_code: `STU-2025-${(i + 1).toString().padStart(3, '0')}`,
            name: `${getRandomElement(arabicNames.first)} ${getRandomElement(arabicNames.last)}`,
            grade_level: 'Grade 10',
            subscription_amount: getRandomElement([2000, 2500, 3000, 3500]),
            balance: 0,
            parent_phone: `0100000${(i + 1).toString().padStart(4, '0')}`,
            parent_email: `parent${i + 1}@example.com`,
            joined_at: new Date(Date.now() - MONTHS_TO_GENERATE * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        }));

        const { data: students, error: studentError } = await supabase
            .from('students')
            .insert(studentsData)
            .select();

        if (studentError) throw studentError;
        console.log(`✅ Created ${students?.length} students`);

        // STEP 6: Generate Historical Data (6 Months Loop)
        console.log('6️⃣ Generating 6 months of historical data...');
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - MONTHS_TO_GENERATE);

        const transactions: any[] = [];
        const examResults: any[] = [];

        // Initial Capital
        transactions.push({
            tenant_id: tenantId,
            transaction_code: 'INIT-001',
            amount: 500000,
            type: 'income',
            category: 'Capital',
            description: 'رأس المال الافتتاحي',
            debit_account: '11102',
            credit_account: '310',
            transaction_date: startDate.toISOString().split('T')[0],
            status: 'completed'
        });

        // Monthly Loop
        for (let month = 0; month < MONTHS_TO_GENERATE; month++) {
            const currentDate = new Date(startDate);
            currentDate.setMonth(currentDate.getMonth() + month);
            const monthStr = currentDate.toISOString().slice(0, 7);

            console.log(`   📆 Processing ${monthStr}...`);

            // Monthly Expenses
            expenseCategories.forEach(cat => {
                const variance = getRandomInt(-200, 200);
                transactions.push({
                    tenant_id: tenantId,
                    transaction_code: `EXP-${monthStr}-${cat.code}`,
                    amount: cat.amount + variance,
                    type: 'expense',
                    category: cat.name,
                    description: `${cat.name} - ${monthStr}`,
                    debit_account: cat.code,
                    credit_account: '11102',
                    transaction_date: `${monthStr}-${getRandomInt(1, 28).toString().padStart(2, '0')}`,
                    status: 'completed'
                });
            });

            // Student Fees (Growing Trend)
            const basePayments = 12 + month; // Increasing trend
            for (let i = 0; i < basePayments && i < NUM_STUDENTS; i++) {
                const student = students![i % students!.length];
                const feeAmount = getRandomInt(300, 600);

                transactions.push({
                    tenant_id: tenantId,
                    transaction_code: `FEE-${monthStr}-${student.student_code}`,
                    amount: feeAmount,
                    type: 'income',
                    category: 'Student Fees',
                    description: `رسوم دراسية - ${student.name}`,
                    student_id: student.id,
                    debit_account: '11101',
                    credit_account: '41001',
                    transaction_date: `${monthStr}-${getRandomInt(1, 28).toString().padStart(2, '0')}`,
                    status: 'completed'
                });
            }

            // Exam Results (Random, 2 per student per month)
            students!.forEach(student => {
                if (Math.random() > 0.3) { // 70% chance of having exam
                    const subject = getRandomElement(subjectRecords!);
                    examResults.push({
                        tenant_id: tenantId,
                        student_id: student.id,
                        subject_id: subject.id,
                        exam_name: `${subject.name} Mid-Term`,
                        score: getRandomAmount(40, 100),
                        max_score: 100,
                        exam_date: `${monthStr}-${getRandomInt(10, 25).toString().padStart(2, '0')}`,
                        grade: getRandomElement(['A', 'A-', 'B+', 'B', 'C+', 'C'])
                    });
                }
            });
        }

        // Insert Transactions
        console.log(`7️⃣ Inserting ${transactions.length} transactions...`);
        const { error: transError } = await supabase.from('transactions').insert(transactions);
        if (transError) throw transError;
        console.log('✅ Transactions inserted');

        // Insert Exam Results
        console.log(`8️⃣ Inserting ${examResults.length} exam results...`);
        const { error: examError } = await supabase.from('exam_results').insert(examResults);
        if (examError) throw examError;
        console.log('✅ Exam results inserted');

        // Final Summary
        console.log('\n🎉 SEEDING COMPLETE!');
        console.log('═'.repeat(50));
        console.log(`📊 Summary:`);
        console.log(`   • Tenant: ${TENANT_NAME}`);
        console.log(`   • Users: ${NUM_TEACHERS + 2} (${NUM_TEACHERS} teachers + 2 admins)`);
        console.log(`   • Students: ${NUM_STUDENTS}`);
        console.log(`   • Subjects: ${subjects.length}`);
        console.log(`   • Transactions: ${transactions.length}`);
        console.log(`   • Exam Results: ${examResults.length}`);
        console.log(`   • Time Period: ${MONTHS_TO_GENERATE} months`);
        console.log('═'.repeat(50));

        return {
            success: true,
            data: {
                tenantId,
                stats: {
                    users: NUM_TEACHERS + 2,
                    students: NUM_STUDENTS,
                    subjects: subjects.length,
                    transactions: transactions.length,
                    examResults: examResults.length
                }
            }
        };

    } catch (error) {
        console.error('❌ Seeding failed:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
};

// === CLEANUP FUNCTION ===
export const cleanupTestData = async () => {
    console.log('🧹 Cleaning up test data...');
    try {
        const { error } = await supabase
            .from('tenants')
            .delete()
            .eq('subdomain', 'alaqrab-test');

        if (error) throw error;
        console.log('✅ Cleanup complete (cascade delete will remove all related data)');
        return { success: true };
    } catch (error) {
        console.error('❌ Cleanup failed:', error);
        return { success: false, error };
    }
};
