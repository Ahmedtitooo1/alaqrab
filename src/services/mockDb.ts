import {
    User, UserRole, Institution, ClientType, PricingModel,
    Announcement, AnnouncementStatus, AnnouncementType,
    FinancialCategory, FinancialFund, BehaviorRecord,
    InternalTicket, FamilyWallet, FinancialEntry,
    Exam, InventoryItem, InventoryTransaction, Supplier, GradeLevel, Subject
} from '../../types';

// ==========================================
// 🏭 DATA FACTORY / GENERATOR
// ==========================================

// --- Utils ---
const getRandomElement = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const getRandomDate = (start: Date, end: Date): string => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString().split('T')[0];
};

const NAMES = {
    first: ['Ahmed', 'Mohamed', 'Mahmoud', 'Omar', 'Ali', 'Youssef', 'Ibrahim', 'Khaled', 'Hassan', 'Hussein', 'Sara', 'Nour', 'Laila', 'Hana', 'Malak', 'Salma', 'Mariam', 'Jana', 'Karim', 'Tarek', 'Mona', 'Dina', 'Rania'],
    last: ['Ali', 'Ibrahim', 'Mohamed', 'Ahmed', 'Khaled', 'Hassan', 'Hussein', 'Mostafa', 'Adel', 'Samy', 'Ezzat', 'Nabil', 'Fawzy', 'Salem', 'Rizk', 'Kamal', 'Zaki', 'Maher', 'Saeed']
};

const generateUsers = (count: number, role: UserRole, startId: number): User[] => {
    return Array.from({ length: count }).map((_, i) => {
        const id = startId + i;
        const first = getRandomElement(NAMES.first);
        const last = getRandomElement(NAMES.last);
        return {
            id: `usr-${role.toLowerCase()}-${id}`,
            code: `${role === UserRole.STUDENT ? 'STU' : role === UserRole.TEACHER ? 'TCH' : 'EMP'}-2025-${id}`,
            firstName: first,
            lastName: last,
            username: `${first.toLowerCase()}.${last.toLowerCase()}${id}`,
            role,
            email: `${first.toLowerCase()}.${last.toLowerCase()}${id}@school.com`,
            institutionId: 'tenant-a',
            aiQuestionsCount: role === UserRole.TEACHER ? 100 : 10,
            subscriptionAmount: role === UserRole.STUDENT ? (Math.random() > 0.5 ? 3500 : 2000) : undefined,
            paidAmount: role === UserRole.STUDENT ? 0 : undefined,
            balance: 0,
            salary: role === UserRole.TEACHER ? 5000 + Math.floor(Math.random() * 5000) : undefined
        };
    });
};

// --- CORE DATA ---

const students = generateUsers(40, UserRole.STUDENT, 1000);
const teachers = generateUsers(5, UserRole.TEACHER, 2000);

const staff: User[] = [
    { id: 'usr-admin', code: 'ADM-001', firstName: 'Sameh', lastName: 'Admin', role: UserRole.ADMIN, institutionId: 'tenant-a', email: 'admin@school.com', aiQuestionsCount: 100 },
    { id: 'usr-acc', code: 'ACC-001', firstName: 'Mona', lastName: 'Accountant', role: UserRole.ACCOUNTANT, institutionId: 'tenant-a', email: 'acc@school.com', aiQuestionsCount: 20 },
    { id: 'usr-sec', code: 'SEC-001', firstName: 'Hoda', lastName: 'Office', role: UserRole.SECRETARY, institutionId: 'tenant-a', email: 'sec@school.com', aiQuestionsCount: 0 },
];

const allUsers = [...staff, ...teachers, ...students];

const categories: FinancialCategory[] = [
    // 1. Assets
    { id: '100', name: 'الأصول (Assets)', code: '100', type: 'asset', level: 1, institutionId: 'tenant-a' },
    { id: '110', name: 'الأصول المتداولة', code: '110', type: 'asset', parentId: '100', level: 2, institutionId: 'tenant-a' },
    { id: '111', name: 'النقدية وما في حكمها', code: '111', type: 'asset', parentId: '110', level: 3, institutionId: 'tenant-a' },
    { id: '11101', name: 'الخزينة الرئيسية', code: '11101', type: 'asset', parentId: '111', level: 4, institutionId: 'tenant-a' },
    { id: '11102', name: 'البنك الأهلي', code: '11102', type: 'asset', parentId: '111', level: 4, institutionId: 'tenant-a' },
    { id: '11103', name: 'فودافون كاش', code: '11103', type: 'asset', parentId: '111', level: 4, institutionId: 'tenant-a' },
    { id: '112', name: 'العملاء (الطلاب)', code: '112', type: 'asset', parentId: '110', level: 3, institutionId: 'tenant-a' },
    { id: '113', name: 'المخزون', code: '113', type: 'asset', parentId: '110', level: 3, institutionId: 'tenant-a' },
    { id: '120', name: 'الأصول الثابتة', code: '120', type: 'asset', parentId: '100', level: 2, institutionId: 'tenant-a' },
    { id: '121', name: 'أثاث وتجهيزات', code: '121', type: 'asset', parentId: '120', level: 3, institutionId: 'tenant-a' },

    // 2. Liabilities
    { id: '200', name: 'الخصوم (Liabilities)', code: '200', type: 'liability', level: 1, institutionId: 'tenant-a' },
    { id: '210', name: 'الخصوم المتداولة', code: '210', type: 'liability', parentId: '200', level: 2, institutionId: 'tenant-a' },
    { id: '211', name: 'الموردين', code: '211', type: 'liability', parentId: '210', level: 3, institutionId: 'tenant-a' },
    { id: '212', name: 'رواتب مستحقة', code: '212', type: 'liability', parentId: '210', level: 3, institutionId: 'tenant-a' },

    // 3. Equity
    { id: '300', name: 'حقوق الملكية (Equity)', code: '300', type: 'equity', level: 1, institutionId: 'tenant-a' },
    { id: '310', name: 'رأس المال', code: '310', type: 'equity', parentId: '300', level: 2, institutionId: 'tenant-a' },

    // 4. Revenue
    { id: '400', name: 'الإيرادات (Revenue)', code: '400', type: 'income', level: 1, institutionId: 'tenant-a' },
    { id: '410', name: 'إيرادات النشاط', code: '410', type: 'income', parentId: '400', level: 2, institutionId: 'tenant-a' },
    { id: '41001', name: 'رسوم دراسية', code: '41001', type: 'income', parentId: '410', level: 3, institutionId: 'tenant-a' },
    { id: '41002', name: 'مبيعات كتب ومذكرات', code: '41002', type: 'income', parentId: '410', level: 3, institutionId: 'tenant-a' },

    // 5. Expenses
    { id: '500', name: 'المصروفات (Expenses)', code: '500', type: 'expense', level: 1, institutionId: 'tenant-a' },
    { id: '510', name: 'مصروفات التشغيل', code: '510', type: 'expense', parentId: '500', level: 2, institutionId: 'tenant-a' },
    { id: '51001', name: 'رواتب وأجور', code: '51001', type: 'expense', parentId: '510', level: 3, institutionId: 'tenant-a' },
    { id: '51002', name: 'إيجار', code: '51002', type: 'expense', parentId: '510', level: 3, institutionId: 'tenant-a' },
    { id: '51003', name: 'كهرباء ومياه', code: '51003', type: 'expense', parentId: '510', level: 3, institutionId: 'tenant-a' },
    { id: '51004', name: 'صيانة ونظافة', code: '51004', type: 'expense', parentId: '510', level: 3, institutionId: 'tenant-a' },
];

const suppliers: Supplier[] = [
    { id: 'sup-1', code: 'SUP-001', name: 'مكتبة الفجر', phone: '01011111111', balance: 0, institutionId: 'tenant-a' },
    { id: 'sup-2', code: 'SUP-002', name: 'شركة النور للتوريدات', phone: '01222222222', balance: 2500, institutionId: 'tenant-a' },
];

// --- 9-MONTH SIMULATOR ---

const entries: FinancialEntry[] = [];
const startDate = new Date('2025-05-01'); // 9 Months ago (May 2025)
const endDate = new Date('2026-01-22'); // Now (approx)

// 1. Initial Capital (May 1st - Start of 9-month period)
entries.push({ id: 'VCH-INIT-001', date: '2025-05-01', description: 'إيداع رأس المال الافتتاحي', amount: 500000, debitAccount: '11102', creditAccount: '310', status: 'posted', institutionId: 'tenant-a' });

// 2. Monthly Expenses Loop
let current = new Date(startDate);
let vchCounter = 1;
const getVchId = () => `VCH-${Date.now()}-${vchCounter++}`;

while (current <= endDate) {
    const month = current.toISOString().slice(0, 7); // YYYY-MM

    // Rent
    entries.push({ id: getVchId(), date: `${month}-01`, description: `إيجار المقر - ${month}`, amount: 5000, debitAccount: '51002', creditAccount: '11102', status: 'posted', institutionId: 'tenant-a' });

    // Utilities (Random Day)
    entries.push({ id: getVchId(), date: `${month}-05`, description: `فواتير كهرباء ومياه - ${month}`, amount: 800 + Math.floor(Math.random() * 500), debitAccount: '51003', creditAccount: '11101', status: 'posted', institutionId: 'tenant-a' });

    // Salaries
    entries.push({ id: getVchId(), date: `${month}-28`, description: `رواتب وأجور الموظفين - ${month}`, amount: 25000, debitAccount: '51001', creditAccount: '11102', status: 'posted', institutionId: 'tenant-a' });

    // --- STUDENT REVENUE SIMULATION ---
    // For each student, 50% chance they pay something this month
    students.forEach(std => {
        if (Math.random() > 0.4) {
            const payAmount = std.subscriptionAmount === 3500 ? 500 : 300;
            // Charge (Invoice) - Maybe assumed at start of year, but let's say Books sales
            if (Math.random() > 0.7) {
                // Buy Books
                const itemPrice = 150;
                entries.push({
                    id: getVchId(),
                    date: getRandomDate(new Date(month + '-01'), new Date(month + '-28')),
                    description: `شراء مذكرات - ${std.firstName}`,
                    amount: itemPrice,
                    debitAccount: '11101', // Cash
                    creditAccount: '41002', // Books Sales
                    status: 'posted',
                    institutionId: 'tenant-a',
                    targetId: std.id
                });
            }

            // Fee Payment
            entries.push({
                id: getVchId(),
                date: getRandomDate(new Date(month + '-05'), new Date(month + '-25')),
                description: `قسط مصروفات - ${std.firstName} ${std.lastName}`,
                amount: payAmount,
                debitAccount: Math.random() > 0.6 ? '11102' : '11101', // Bank or Cash
                creditAccount: '112', // Student Receivable
                status: 'posted',
                institutionId: 'tenant-a',
                targetId: std.id
            });

            // Update Student Paid Amount
            std.paidAmount = (std.paidAmount || 0) + payAmount;
        }
    });

    // Move to next month
    current.setMonth(current.getMonth() + 1);
}

// Calculate remaining balance for students
students.forEach(std => {
    std.balance = (std.subscriptionAmount || 0) - (std.paidAmount || 0);
});

// Calculate Fund Balances
const fundsBalances = { '11101': 0, '11102': 0, '11103': 0 };
entries.forEach(e => {
    if (fundsBalances[e.debitAccount as keyof typeof fundsBalances] !== undefined) fundsBalances[e.debitAccount as keyof typeof fundsBalances] += e.amount;
    if (fundsBalances[e.creditAccount as keyof typeof fundsBalances] !== undefined) fundsBalances[e.creditAccount as keyof typeof fundsBalances] -= e.amount;
});

// --- EXAMS & ACADEMIC ---
const exams: Exam[] = [
    { id: 'EX-2025-01', title: 'Physics Mid-Term', subject: 'Physics', duration: 60, totalPoints: 50, status: 'published', institutionId: 'tenant-a', teacherId: teachers[0].id, questions: [] },
    { id: 'EX-2025-02', title: 'Chemistry Quiz', subject: 'Chemistry', duration: 30, totalPoints: 20, status: 'published', institutionId: 'tenant-a', teacherId: teachers[1].id, questions: [] },
];

const inventoryItems: InventoryItem[] = [
    { id: 'ITM-1', code: 'BOOK-PHY', name: 'Physics Book G10', quantity: 120, unitPrice: 150, category: 'books', location: 'Store A', minQuantity: 10, institutionId: 'tenant-a' },
    { id: 'ITM-2', code: 'UNI-S', name: 'Uniform T-Shirt Small', quantity: 50, unitPrice: 200, category: 'uniform', location: 'Store B', minQuantity: 5, institutionId: 'tenant-a' },
];

const announcements: Announcement[] = [
    { id: 'ANN-1', title: 'Welcome Back!', content: 'School year starts on Sept 1st.', date: '2025-08-20', type: AnnouncementType.ANNOUNCEMENT, status: AnnouncementStatus.APPROVED, authorId: staff[0].id, authorName: 'Admin', authorRole: 'admin', institutionId: 'tenant-a' }
];

export const mockDb = {
    users: allUsers,
    financialEntries: entries,
    categories,
    funds: [
        { id: 'fund-1', name: 'الخزينة الرئيسية', code: '11101', accountCode: '11101', type: 'cash', balance: fundsBalances['11101'], institutionId: 'tenant-a' },
        { id: 'fund-2', name: 'البنك الأهلي', code: '11102', accountCode: '11102', type: 'bank', balance: fundsBalances['11102'], institutionId: 'tenant-a' },
        { id: 'fund-3', name: 'فودافون كاش', code: '11103', accountCode: '11103', type: 'cash', balance: fundsBalances['11103'], institutionId: 'tenant-a' },
    ] as FinancialFund[],
    tenants: [{
        id: 'tenant-a', name: 'Al-Aqrab Academy', type: ClientType.INSTITUTION, subdomain: 'alaqrab', status: 'active', expiryDate: '2030-01-01',
        permissions: { allowCustomBranding: true, allowAiCorrection: true, allowSmartAnalyst: true, allowAiUsage: true, allowFinancialLedger: true, allowLiveStreaming: true },
        limits: { admins: 10, teachers: 50, accountants: 5, students: 5000 },
        pricing: { model: PricingModel.YEARLY, totalAmount: 10000, paidAmount: 10000 },
        paymentHistory: [], currencies: [{ code: 'EGP', name: 'Egyptian Pound', symbol: 'EGP', exchangeRate: 1, isBase: true }]
    }] as Institution[],
    inventoryItems,
    inventoryTransactions: [] as InventoryTransaction[],
    suppliers,
    behaviorRecords: [] as BehaviorRecord[],
    tickets: [] as InternalTicket[],
    exams,
    announcements,
    familyWallets: [] as FamilyWallet[],
    gradeLevels: [
        { id: 'gl-1', name: 'Grade 10', institutionId: 'tenant-a', subjects: [] },
        { id: 'gl-2', name: 'Grade 11', institutionId: 'tenant-a', subjects: [] }
    ] as GradeLevel[],
    subjects: [
        { id: 'sub-1', name: 'Physics', gradeLevelId: 'gl-1', institutionId: 'tenant-a' },
        { id: 'sub-2', name: 'Chemistry', gradeLevelId: 'gl-2', institutionId: 'tenant-a' }
    ] as Subject[]
};
