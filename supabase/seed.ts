
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

// Load env vars
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase URL or Key in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// --- HELPERS ---
const getRandomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const generateDate = (start: Date, end: Date) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString().split('T')[0];
};

const INSTITUTION_ID = 'tenant-a';

// --- DATA GENERATORS ---

const generateUsers = () => {
    const firstNames = ['Ahmed', 'Mohamed', 'Mahmoud', 'Omar', 'Ali', 'Youssef', 'Ibrahim', 'Khaled', 'Hassan', 'Hussein', 'Sara', 'Nour', 'Laila', 'Hana', 'Malak', 'Salma', 'Mariam', 'Jana', 'Fatima', 'Aya'];
    const lastNames = ['Ali', 'Ibrahim', 'Mohamed', 'Ahmed', 'Khaled', 'Hassan', 'Hussein', 'Mostafa', 'Adel', 'Samy', 'Ezzat', 'Nabil', 'Fawzy', 'Salem', 'Rizk', 'Kamal', 'Osman', 'Saad'];

    const users = [];

    // 1. Admin & Staff (Default Accounts)
    users.push({ id: 'usr-admin', code: 'ADM-001', firstName: 'Sameh', lastName: 'Manager', role: 'admin', email: 'admin@school.com', institutionId: INSTITUTION_ID, password: 'password123' });
    users.push({ id: 'usr-acc-1', code: 'ACC-001', firstName: 'Mona', lastName: 'Accountant', role: 'accountant', email: 'acc@school.com', institutionId: INSTITUTION_ID, password: 'password123' });
    users.push({ id: 'usr-sec-1', code: 'SEC-001', firstName: 'Hoda', lastName: 'Secretary', role: 'secretary', email: 'sec@school.com', institutionId: INSTITUTION_ID, password: 'password123' });

    // 2. Teachers (10)
    for (let i = 1; i <= 10; i++) {
        users.push({
            id: `usr-tch-${i}`,
            code: `TCH-${2000 + i}`,
            firstName: getRandomItem(firstNames),
            lastName: getRandomItem(lastNames),
            role: 'teacher',
            email: `teacher${i}@school.com`,
            institutionId: INSTITUTION_ID,
            salary: getRandomInt(3000, 7000),
            jobTitle: 'Senior Teacher',
            password: 'password123'
        });
    }

    // 3. Students (50)
    for (let i = 1; i <= 50; i++) {
        users.push({
            id: `usr-stu-${i}`,
            code: `STU-${1000 + i}`,
            firstName: getRandomItem(firstNames),
            lastName: getRandomItem(lastNames),
            role: 'student',
            email: `student${i}@school.com`,
            institutionId: INSTITUTION_ID,
            subscriptionAmount: 5000,
            paidAmount: 0,
            balance: 5000,
            aiQuestionsCount: getRandomInt(0, 20),
            password: 'password123'
        });
    }

    return users;
};

const generateFinancials = (users: any[]) => {
    const entries: any[] = [];
    const PAYROLL_ACCOUNT = '51001';
    const TUITION_INCOME = '41001';
    const CASH_FUND = '11101'; // Safe
    const BANK_FUND = '11102'; // Bank
    const RECEIVABLES = '112'; // Clients (Students)

    // Suppliers (Accounts Payable)
    const SUPPLIERS_ACCOUNTS = '211';

    const students = users.filter(u => u.role === 'student');
    const staff = users.filter(u => ['admin', 'teacher', 'accountant', 'secretary'].includes(u.role));

    // 1. Initial Capital (6 months ago)
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 6);

    entries.push({
        id: uuidv4(),
        date: startDate.toISOString().split('T')[0],
        description: 'Capital Deposit',
        amount: 500000,
        debitAccount: BANK_FUND,
        creditAccount: '310', // Capital
        refType: 'journal',
        institutionId: INSTITUTION_ID
    });

    // 2. Monthly Cycles
    for (let i = 0; i < 6; i++) {
        const cycleDate = new Date(startDate);
        cycleDate.setMonth(startDate.getMonth() + i);
        const dateStr = cycleDate.toISOString().split('T')[0];

        // A. Monthly Tuition Accrual
        if (i === 0) { // Start of 'Year'
            students.forEach(st => {
                entries.push({
                    id: uuidv4(),
                    date: dateStr,
                    description: `Tuition Fees 2025/2026 - ${st.firstName} ${st.lastName}`,
                    amount: st.subscriptionAmount,
                    debitAccount: RECEIVABLES,
                    creditAccount: TUITION_INCOME,
                    refType: 'invoice',
                    targetId: st.id,
                    institutionId: INSTITUTION_ID
                });
            });
        }

        // B. Salary Payments
        staff.forEach(emp => {
            const salary = emp.salary || 3000;
            entries.push({
                id: uuidv4(),
                date: dateStr,
                description: `Salary ${cycleDate.toLocaleString('default', { month: 'short' })} - ${emp.firstName}`,
                amount: salary,
                debitAccount: PAYROLL_ACCOUNT,
                creditAccount: BANK_FUND,
                refType: 'payroll',
                institutionId: INSTITUTION_ID
            });
        });

        // C. Student Payments
        students.forEach(st => {
            if (st.balance > 0 && Math.random() > 0.4) {
                const amount = Math.min(st.balance, getRandomInt(500, 1500));
                st.paidAmount += amount;
                st.balance -= amount;
                entries.push({
                    id: uuidv4(),
                    date: generateDate(cycleDate, new Date(cycleDate.getTime() + 86400000 * 25)),
                    description: `Tuition Payment - ${st.firstName}`,
                    amount: amount,
                    debitAccount: CASH_FUND,
                    creditAccount: RECEIVABLES,
                    refType: 'payment',
                    targetId: st.id,
                    institutionId: INSTITUTION_ID
                });
            }
        });

        // D. Expenses & Purchasing
        if (i % 2 === 0) {
            entries.push({
                id: uuidv4(),
                date: dateStr,
                description: `Stationery & Supplies`,
                amount: getRandomInt(2000, 5000),
                debitAccount: '51004', // Maintenance/Supplies
                creditAccount: CASH_FUND,
                refType: 'expense',
                institutionId: INSTITUTION_ID
            });
        }
    }

    return entries;
};

// --- DATA GENERATORS (NEW) ---

const generateStudentProgress = (students: any[]) => {
    return students.map(st => ({
        userId: st.id,
        subject: 'Physics',
        monthlyScores: [
            { month: 'Sep', score: getRandomInt(60, 95) },
            { month: 'Oct', score: getRandomInt(65, 98) },
            { month: 'Nov', score: getRandomInt(70, 92) }
        ],
        attendanceRate: getRandomInt(80, 100),
        strengths: ['Mechanics', 'Problem Solving'],
        weaknesses: ['Thermodynamics'],
        recommendations: ['Review Chapter 3', 'More practice tests'],
        institutionId: INSTITUTION_ID
    }));
};

const generateAssignments = (teachers: any[]) => {
    return [{
        id: 'ass-1',
        title: 'Weekly Homework #1',
        description: 'Solve page 20-22',
        dueDate: '2025-10-15',
        courseId: 'phys-101',
        subject: 'Physics',
        teacherId: teachers[0].id,
        status: 'published',
        points: 10,
        institutionId: INSTITUTION_ID
    },
    {
        id: 'ass-2',
        title: 'Weekly Homework #2',
        description: 'Solve page 30-35',
        dueDate: '2025-11-20',
        courseId: 'phys-101',
        subject: 'Physics',
        teacherId: teachers[0].id,
        status: 'published',
        points: 10,
        institutionId: INSTITUTION_ID
    }];
};

const generateNotifications = (users: any[]) => {
    const notifs = [];
    users.forEach(u => {
        notifs.push({
            id: uuidv4(),
            title: 'System Update',
            content: 'The system has been updated with new features.',
            date: new Date().toISOString().split('T')[0],
            isRead: false,
            type: 'info',
            userId: u.id,
            institutionId: INSTITUTION_ID
        });
    });
    return notifs;
};

const generateMarketplaceItems = () => {
    return [
        { id: 'mkt-1', title: 'Physics Summary 2025', description: 'Complete revision notes', price: 50, author: 'Mr. Ahmed', rating: 4.8, sales: 120, category: 'summary', type: 'summary', institutionId: INSTITUTION_ID },
        { id: 'mkt-2', title: 'Advanced Mechanics Course', description: 'Video course', price: 200, author: 'Mr. Mohamed', rating: 4.9, sales: 50, category: 'course', type: 'course', institutionId: INSTITUTION_ID }
    ];
};

// --- SEED FUNCTION ---

async function seed() {
    console.log('Starting Full Data Seed (Including ALL VIEWS)...');

    const insert = async (table: string, data: any[]) => {
        if (!data || data.length === 0) return;
        const CHUNK_SIZE = 100;
        for (let i = 0; i < data.length; i += CHUNK_SIZE) {
            const chunk = data.slice(i, i + CHUNK_SIZE);
            const { error } = await supabase.from(table).upsert(chunk);
            if (error) {
                console.error(`Error inserting into ${table} (chunk ${i}):`, error);
            }
        }
        console.log(`✓ ${table}: Processed ${data.length} records`);
    };

    try {
        // 1. Institution
        await insert('institutions', [{
            id: INSTITUTION_ID,
            name: 'Al-Hoda International School',
            type: 'school',
            status: 'active',
            expiryDate: '2030-01-01',
            permissions: { allowCustomBranding: true },
            created_at: new Date().toISOString()
        }]);

        // 2. Fiscal Years
        await insert('fiscal_years', [{
            id: 'fy-2025',
            name: '2025-2026',
            startDate: '2025-09-01',
            endDate: '2026-08-31',
            status: 'active',
            institutionId: INSTITUTION_ID
        }]);

        // 3. Users
        const users = generateUsers();
        await insert('users', users);

        // 4. Suppliers
        const suppliers = [
            { id: 'sup-1', code: 'SUP-001', name: 'Al-Fajr Bookstore', phone: '01011111111', balance: 0, institutionId: INSTITUTION_ID },
            { id: 'sup-2', code: 'SUP-002', name: 'Tech Supplies Co.', phone: '01222222222', balance: 5000, institutionId: INSTITUTION_ID }
        ];
        await insert('suppliers', suppliers);

        // 5. Financials
        const entries = generateFinancials(users);
        await insert('financial_entries', entries);

        // Funds
        let cashBalance = 0;
        let bankBalance = 0;
        entries.forEach(e => {
            if (e.debitAccount === '11101') cashBalance += e.amount;
            if (e.creditAccount === '11101') cashBalance -= e.amount;
            if (e.debitAccount === '11102') bankBalance += e.amount;
            if (e.creditAccount === '11102') bankBalance -= e.amount;
        });

        await insert('financial_funds', [
            { id: 'fund-1', name: 'Main Safe', type: 'cash', accountCode: '11101', balance: cashBalance, institutionId: INSTITUTION_ID },
            { id: 'fund-2', name: 'NBE Bank', type: 'bank', accountCode: '11102', balance: bankBalance, institutionId: INSTITUTION_ID }
        ]);


        // Categories
        const categories = [
            { id: '100', name: 'Assets', code: '100', type: 'asset', level: 1, institutionId: INSTITUTION_ID },
            { id: '110', name: 'Current Assets', code: '110', type: 'asset', parentId: '100', level: 2, institutionId: INSTITUTION_ID },
            { id: '111', name: 'Cash & Banks', code: '111', type: 'asset', parentId: '110', level: 3, institutionId: INSTITUTION_ID },
            { id: '11101', name: 'Main Safe', code: '11101', type: 'asset', parentId: '111', level: 4, institutionId: INSTITUTION_ID },
            { id: '11102', name: 'Bank NBE', code: '11102', type: 'asset', parentId: '111', level: 4, institutionId: INSTITUTION_ID },
            { id: '112', name: 'Accounts Receivable', code: '112', type: 'asset', parentId: '110', level: 3, institutionId: INSTITUTION_ID },
            { id: '200', name: 'Liabilities', code: '200', type: 'liability', level: 1, institutionId: INSTITUTION_ID },
            { id: '210', name: 'Current Liabilities', code: '210', type: 'liability', parentId: '200', level: 2, institutionId: INSTITUTION_ID },
            { id: '211', name: 'Suppliers', code: '211', type: 'liability', parentId: '210', level: 3, institutionId: INSTITUTION_ID },
            { id: '300', name: 'Equity', code: '300', type: 'equity', level: 1, institutionId: INSTITUTION_ID },
            { id: '310', name: 'Capital', code: '310', type: 'equity', parentId: '300', level: 2, institutionId: INSTITUTION_ID },
            { id: '400', name: 'Revenue', code: '400', type: 'income', level: 1, institutionId: INSTITUTION_ID },
            { id: '41001', name: 'Tuition Fees', code: '41001', type: 'income', parentId: '400', level: 2, institutionId: INSTITUTION_ID },
            { id: '500', name: 'Expenses', code: '500', type: 'expense', level: 1, institutionId: INSTITUTION_ID },
            { id: '51001', name: 'Salaries', code: '51001', type: 'expense', parentId: '500', level: 2, institutionId: INSTITUTION_ID },
            { id: '51002', name: 'Rent', code: '51002', type: 'expense', parentId: '500', level: 2, institutionId: INSTITUTION_ID },
            { id: '51004', name: 'Supplies', code: '51004', type: 'expense', parentId: '500', level: 2, institutionId: INSTITUTION_ID },
        ];
        await insert('financial_categories', categories);

        // 6. Inventory
        const items = [
            { id: 'itm-1', name: 'Physics Book', code: 'BK-PHY', quantity: 200, unitPrice: 150, institutionId: INSTITUTION_ID, category: 'books', supplierId: 'sup-1', accountCode: '113' },
            { id: 'itm-2', name: 'Math Book', code: 'BK-MTH', quantity: 180, unitPrice: 150, institutionId: INSTITUTION_ID, category: 'books', supplierId: 'sup-1', accountCode: '113' },
            { id: 'itm-3', name: 'School Uniform', code: 'UNF-001', quantity: 50, unitPrice: 300, institutionId: INSTITUTION_ID, category: 'uniforms', supplierId: 'sup-2', accountCode: '113' },
        ];
        await insert('inventory_items', items);

        // 7. Announcements
        const announcements = [
            { id: 'ann-1', title: 'Welcome Back to School!', content: 'We are excited to start the new 2025/2026 academic year. Please check your schedules.', type: 'announcement', status: 'approved', date: '2025-09-01', institutionId: INSTITUTION_ID, authorName: 'Admin' },
            { id: 'ann-2', title: 'Physics Mid-Term Schedule', content: 'The physics mid-term exam will be held on Nov 15th.', type: 'announcement', status: 'approved', date: '2025-11-01', institutionId: INSTITUTION_ID, authorName: 'Admin' },
            { id: 'ann-3', title: 'Science Fair Registration', content: 'Register your team for the annual Science Fair by next week.', type: 'event', status: 'approved', date: '2025-12-01', eventDate: '2025-12-20', institutionId: INSTITUTION_ID, authorName: 'Activity Coordinator' }
        ];
        await insert('announcements', announcements);

        // 8. Exams
        const exams = [
            { id: 'ex-1', title: 'Physics Mid-Term', subject: 'Physics', duration: 60, totalPoints: 50, status: 'published', institutionId: INSTITUTION_ID, teacherId: users.find(u => u.role === 'teacher')?.id },
            { id: 'ex-2', title: 'Mathematics Quiz 1', subject: 'Math', duration: 30, totalPoints: 20, status: 'published', institutionId: INSTITUTION_ID, teacherId: users.find(u => u.role === 'teacher')?.id }
        ];
        await insert('exams', exams);

        // 9. Tickets
        const tickets = [
            { id: 'tik-1', title: 'AC Not Working', description: 'Room 3C AC is down.', priority: 'high', status: 'open', category: 'maintenance', createdBy: 'Admin', institutionId: INSTITUTION_ID },
            { id: 'tik-2', title: 'Printer Paper Jam', description: 'Staff room printer is stuck.', priority: 'medium', status: 'resolved', category: 'it', createdBy: 'Admin', institutionId: INSTITUTION_ID }
        ];
        await insert('tickets', tickets);

        // 10. Student Progress & Analytics
        const progress = generateStudentProgress(users.filter(u => u.role === 'student'));
        await insert('student_progress', progress);

        // 11. Assignments
        const assignments = generateAssignments(users.filter(u => u.role === 'teacher'));
        await insert('assignments', assignments);

        // 12. Notifications
        const notifs = generateNotifications(users);
        await insert('notifications', notifs);

        // 13. Marketplace
        const market = generateMarketplaceItems();
        await insert('marketplace_items', market);

        console.log('Seeding Complete with COMPREHENSIVE data covering ALL views!');

    } catch (err) {
        console.error('Seeding failed:', err);
    }
}

seed();
