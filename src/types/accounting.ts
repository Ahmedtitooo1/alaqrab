// Advanced Accounting Types for Double-Entry Bookkeeping System

export type AccountType = 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE';

export interface Account {
    id: string;
    code: string; // e.g., "1010"
    name: string; // e.g., "Cash on Hand"
    type: AccountType;
    parentId?: string;
    level: number;
    balance?: number; // Current balance
    isActive?: boolean;
}

export interface JournalLine {
    accountId: string;
    accountCode?: string;
    accountName?: string;
    debit: number;
    credit: number;
    note?: string;
}

export interface JournalEntry {
    id: string;
    date: string;
    description: string;
    lines: JournalLine[]; // Sum of Debits must equal Sum of Credits
    posted: boolean;
    createdBy?: string;
    createdAt?: string;
    institutionId?: string;
    voucherNumber?: string;
    attachments?: string[];
}

export interface TrialBalanceRow {
    accountCode: string;
    accountName: string;
    accountType: AccountType;
    debitBalance: number;
    creditBalance: number;
}

export interface IncomeStatement {
    revenues: {
        accounts: { code: string; name: string; amount: number }[];
        total: number;
    };
    expenses: {
        accounts: { code: string; name: string; amount: number }[];
        total: number;
    };
    netProfit: number; // Positive = profit, Negative = loss
    period: {
        from: string;
        to: string;
    };
}

export interface BalanceSheet {
    assets: {
        accounts: { code: string; name: string; amount: number }[];
        total: number;
    };
    liabilities: {
        accounts: { code: string; name: string; amount: number }[];
        total: number;
    };
    equity: {
        accounts: { code: string; name: string; amount: number }[];
        total: number;
        retainedEarnings?: number;
    };
    asOfDate: string;
    balanced: boolean; // Assets = Liabilities + Equity
}
