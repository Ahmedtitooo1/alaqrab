// Mock Accounting Service - Double-Entry Bookkeeping Engine

import {
    Account,
    AccountType,
    JournalEntry,
    JournalLine,
    TrialBalanceRow,
    IncomeStatement,
    BalanceSheet
} from '../types/accounting';

// Storage Keys
const STORAGE_KEY_ACCOUNTS = 'aleaqrab_coa_v1';
const STORAGE_KEY_JOURNAL = 'aleaqrab_journal_v1';

// ===========================
// 1. STANDARD CHART OF ACCOUNTS (COA) SEED DATA
// ===========================

const standardCOA: Account[] = [
    // ASSETS (1xxx)
    { id: 'acc-101', code: '101', name: 'صندوق النقدية (Cash on Hand)', type: 'ASSET', level: 1, isActive: true },
    { id: 'acc-102', code: '102', name: 'البنك (Bank Account)', type: 'ASSET', level: 1, isActive: true },
    { id: 'acc-103', code: '103', name: 'العملاء (Accounts Receivable)', type: 'ASSET', level: 1, isActive: true },
    { id: 'acc-104', code: '104', name: 'الأصول الثابتة (Fixed Assets)', type: 'ASSET', level: 1, isActive: true },
    { id: 'acc-105', code: '105', name: 'المخزون (Inventory)', type: 'ASSET', level: 1, isActive: true },

    // LIABILITIES (2xxx)
    { id: 'acc-201', code: '201', name: 'الموردون (Accounts Payable)', type: 'LIABILITY', level: 1, isActive: true },
    { id: 'acc-202', code: '202', name: 'ضريبة القيمة المضافة المستحقة (VAT Payable)', type: 'LIABILITY', level: 1, isActive: true },
    { id: 'acc-203', code: '203', name: 'القروض قصيرة الأجل (Short-term Loans)', type: 'LIABILITY', level: 1, isActive: true },
    { id: 'acc-204', code: '204', name: 'المصروفات المستحقة (Accrued Expenses)', type: 'LIABILITY', level: 1, isActive: true },

    // EQUITY (3xxx)
    { id: 'acc-301', code: '301', name: 'رأس المال (Owner\'s Equity)', type: 'EQUITY', level: 1, isActive: true },
    { id: 'acc-302', code: '302', name: 'الأرباح المحتجزة (Retained Earnings)', type: 'EQUITY', level: 1, isActive: true },
    { id: 'acc-303', code: '303', name: 'المسحوبات الشخصية (Drawings)', type: 'EQUITY', level: 1, isActive: true },

    // REVENUE (4xxx)
    { id: 'acc-401', code: '401', name: 'إيرادات الرسوم الدراسية (Tuition Fees)', type: 'REVENUE', level: 1, isActive: true },
    { id: 'acc-402', code: '402', name: 'إيرادات رسوم الامتحانات (Exam Fees)', type: 'REVENUE', level: 1, isActive: true },
    { id: 'acc-403', code: '403', name: 'إيرادات متنوعة (Miscellaneous Revenue)', type: 'REVENUE', level: 1, isActive: true },
    { id: 'acc-404', code: '404', name: 'إيرادات الكتب والمطبوعات (Books Revenue)', type: 'REVENUE', level: 1, isActive: true },

    // EXPENSES (5xxx)
    { id: 'acc-501', code: '501', name: 'مصروفات الرواتب (Salaries Expense)', type: 'EXPENSE', level: 1, isActive: true },
    { id: 'acc-502', code: '502', name: 'مصروفات الإيجار (Rent Expense)', type: 'EXPENSE', level: 1, isActive: true },
    { id: 'acc-503', code: '503', name: 'مصروفات المرافق (Utilities Expense)', type: 'EXPENSE', level: 1, isActive: true },
    { id: 'acc-504', code: '504', name: 'مصروفات الصيانة (Maintenance Expense)', type: 'EXPENSE', level: 1, isActive: true },
    { id: 'acc-505', code: '505', name: 'مصروفات القرطاسية (Stationery Expense)', type: 'EXPENSE', level: 1, isActive: true },
    { id: 'acc-506', code: '506', name: 'مصروفات التنظيف (Cleaning Expense)', type: 'EXPENSE', level: 1, isActive: true },
    { id: 'acc-507', code: '507', name: 'مصروفات التسويق (Marketing Expense)', type: 'EXPENSE', level: 1, isActive: true },
    { id: 'acc-508', code: '508', name: 'مصروفات متنوعة (Miscellaneous Expense)', type: 'EXPENSE', level: 1, isActive: true },
];

// ===========================
// 2. STORAGE HELPERS
// ===========================

export const initializeAccounts = (): Account[] => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY_ACCOUNTS);
        if (saved) {
            return JSON.parse(saved);
        }
        // First time - seed with standard COA
        localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(standardCOA));
        return standardCOA;
    } catch (error) {
        console.error('Failed to load COA', error);
        return standardCOA;
    }
};

export const saveAccounts = (accounts: Account[]) => {
    localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(accounts));
};

export const getAccounts = (): Account[] => {
    return initializeAccounts();
};

export const addAccount = (account: Account) => {
    const accounts = getAccounts();
    accounts.push(account);
    saveAccounts(accounts);
};

export const getJournalEntries = (): JournalEntry[] => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY_JOURNAL);
        return saved ? JSON.parse(saved) : [];
    } catch (error) {
        console.error('Failed to load journal entries', error);
        return [];
    }
};

export const saveJournalEntry = (entry: JournalEntry) => {
    const entries = getJournalEntries();
    entries.push(entry);
    localStorage.setItem(STORAGE_KEY_JOURNAL, JSON.stringify(entries));
};

export const updateJournalEntry = (id: string, updatedEntry: JournalEntry) => {
    const entries = getJournalEntries();
    const index = entries.findIndex(e => e.id === id);
    if (index !== -1) {
        entries[index] = updatedEntry;
        localStorage.setItem(STORAGE_KEY_JOURNAL, JSON.stringify(entries));
    }
};

export const deleteJournalEntry = (id: string) => {
    const entries = getJournalEntries().filter(e => e.id !== id);
    localStorage.setItem(STORAGE_KEY_JOURNAL, JSON.stringify(entries));
};

// ===========================
// 3. ACCOUNTING CALCULATIONS
// ===========================

/**
 * Get Trial Balance - Aggregates all Debits and Credits per Account
 */
export const getTrialBalance = (): TrialBalanceRow[] => {
    const accounts = getAccounts();
    const journalEntries = getJournalEntries().filter(e => e.posted);

    // Create a map to accumulate debits and credits
    const balances = new Map<string, { debit: number; credit: number; account: Account }>();

    // Initialize all accounts with zero balances
    accounts.forEach(account => {
        balances.set(account.code, {
            debit: 0,
            credit: 0,
            account
        });
    });

    // Accumulate from journal entries
    journalEntries.forEach(entry => {
        entry.lines.forEach(line => {
            const account = accounts.find(a => a.id === line.accountId);
            if (account) {
                const current = balances.get(account.code) || { debit: 0, credit: 0, account };
                current.debit += line.debit;
                current.credit += line.credit;
                balances.set(account.code, current);
            }
        });
    });

    // Convert to array and calculate net balances
    const trialBalance: TrialBalanceRow[] = [];
    balances.forEach((value, code) => {
        const netDebit = value.debit - value.credit;
        const netCredit = value.credit - value.debit;

        trialBalance.push({
            accountCode: code,
            accountName: value.account.name,
            accountType: value.account.type,
            debitBalance: netDebit > 0 ? netDebit : 0,
            creditBalance: netCredit > 0 ? netCredit : 0
        });
    });

    return trialBalance.sort((a, b) => a.accountCode.localeCompare(b.accountCode));
};

/**
 * Get Income Statement - Calculates (Revenue - Expenses)
 */
export const getIncomeStatement = (fromDate?: string, toDate?: string): IncomeStatement => {
    const accounts = getAccounts();
    const journalEntries = getJournalEntries().filter(e => {
        if (!e.posted) return false;
        if (fromDate && e.date < fromDate) return false;
        if (toDate && e.date > toDate) return false;
        return true;
    });

    // Accumulate revenue and expense balances
    const revenueMap = new Map<string, number>();
    const expenseMap = new Map<string, number>();

    journalEntries.forEach(entry => {
        entry.lines.forEach(line => {
            const account = accounts.find(a => a.id === line.accountId);
            if (!account) return;

            if (account.type === 'REVENUE') {
                // Revenue increases with CREDIT
                const current = revenueMap.get(account.code) || 0;
                revenueMap.set(account.code, current + line.credit - line.debit);
            } else if (account.type === 'EXPENSE') {
                // Expenses increase with DEBIT
                const current = expenseMap.get(account.code) || 0;
                expenseMap.set(account.code, current + line.debit - line.credit);
            }
        });
    });

    // Build revenue accounts array
    const revenueAccounts: { code: string; name: string; amount: number }[] = [];
    let totalRevenue = 0;
    revenueMap.forEach((amount, code) => {
        const account = accounts.find(a => a.code === code);
        if (account && amount > 0) {
            revenueAccounts.push({ code, name: account.name, amount });
            totalRevenue += amount;
        }
    });

    // Build expense accounts array
    const expenseAccounts: { code: string; name: string; amount: number }[] = [];
    let totalExpenses = 0;
    expenseMap.forEach((amount, code) => {
        const account = accounts.find(a => a.code === code);
        if (account && amount > 0) {
            expenseAccounts.push({ code, name: account.name, amount });
            totalExpenses += amount;
        }
    });

    return {
        revenues: {
            accounts: revenueAccounts.sort((a, b) => a.code.localeCompare(b.code)),
            total: totalRevenue
        },
        expenses: {
            accounts: expenseAccounts.sort((a, b) => a.code.localeCompare(b.code)),
            total: totalExpenses
        },
        netProfit: totalRevenue - totalExpenses,
        period: {
            from: fromDate || 'البداية',
            to: toDate || 'اليوم'
        }
    };
};

/**
 * Get Balance Sheet - Calculates (Assets = Liabilities + Equity)
 */
export const getBalanceSheet = (asOfDate?: string): BalanceSheet => {
    const accounts = getAccounts();
    const journalEntries = getJournalEntries().filter(e => {
        if (!e.posted) return false;
        if (asOfDate && e.date > asOfDate) return false;
        return true;
    });

    // Accumulate balances by type
    const assetMap = new Map<string, number>();
    const liabilityMap = new Map<string, number>();
    const equityMap = new Map<string, number>();

    journalEntries.forEach(entry => {
        entry.lines.forEach(line => {
            const account = accounts.find(a => a.id === line.accountId);
            if (!account) return;

            const netAmount = line.debit - line.credit; // Asset/Expense increase with debit

            if (account.type === 'ASSET') {
                const current = assetMap.get(account.code) || 0;
                assetMap.set(account.code, current + netAmount);
            } else if (account.type === 'LIABILITY') {
                // Liabilities increase with credit (so net is credit - debit)
                const current = liabilityMap.get(account.code) || 0;
                liabilityMap.set(account.code, current - netAmount);
            } else if (account.type === 'EQUITY') {
                // Equity increases with credit
                const current = equityMap.get(account.code) || 0;
                equityMap.set(account.code, current - netAmount);
            }
        });
    });

    // Calculate retained earnings (net profit)
    const incomeStatement = getIncomeStatement(undefined, asOfDate);
    const retainedEarnings = incomeStatement.netProfit;

    // Build arrays
    const assetAccounts: { code: string; name: string; amount: number }[] = [];
    let totalAssets = 0;
    assetMap.forEach((amount, code) => {
        const account = accounts.find(a => a.code === code);
        if (account) {
            assetAccounts.push({ code, name: account.name, amount });
            totalAssets += amount;
        }
    });

    const liabilityAccounts: { code: string; name: string; amount: number }[] = [];
    let totalLiabilities = 0;
    liabilityMap.forEach((amount, code) => {
        const account = accounts.find(a => a.code === code);
        if (account) {
            liabilityAccounts.push({ code, name: account.name, amount });
            totalLiabilities += amount;
        }
    });

    const equityAccounts: { code: string; name: string; amount: number }[] = [];
    let totalEquity = 0;
    equityMap.forEach((amount, code) => {
        const account = accounts.find(a => a.code === code);
        if (account) {
            equityAccounts.push({ code, name: account.name, amount });
            totalEquity += amount;
        }
    });

    // Add retained earnings to equity
    totalEquity += retainedEarnings;

    const balanced = Math.abs(totalAssets - (totalLiabilities + totalEquity)) < 0.01;

    return {
        assets: {
            accounts: assetAccounts.sort((a, b) => a.code.localeCompare(b.code)),
            total: totalAssets
        },
        liabilities: {
            accounts: liabilityAccounts.sort((a, b) => a.code.localeCompare(b.code)),
            total: totalLiabilities
        },
        equity: {
            accounts: equityAccounts.sort((a, b) => a.code.localeCompare(b.code)),
            total: totalEquity,
            retainedEarnings
        },
        asOfDate: asOfDate || new Date().toISOString().split('T')[0],
        balanced
    };
};

/**
 * Validate that a journal entry is balanced (Debits = Credits)
 */
export const validateJournalEntry = (entry: JournalEntry): { valid: boolean; message?: string } => {
    if (!entry.lines || entry.lines.length < 2) {
        return { valid: false, message: 'يجب أن يحتوي القيد على سطرين على الأقل' };
    }

    const totalDebits = entry.lines.reduce((sum, line) => sum + (line.debit || 0), 0);
    const totalCredits = entry.lines.reduce((sum, line) => sum + (line.credit || 0), 0);

    if (Math.abs(totalDebits - totalCredits) > 0.01) {
        return {
            valid: false,
            message: `القيد غير متوازن! المدين: ${totalDebits.toFixed(2)} - الدائن: ${totalCredits.toFixed(2)}`
        };
    }

    return { valid: true };
};
