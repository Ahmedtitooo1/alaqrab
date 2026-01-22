
import { FinanceConfig, FinanceTransaction } from '../../types';

const STORAGE_KEY_TRANSACTIONS = 'aleaqrab_finance_transactions_v2';
const STORAGE_KEY_CONFIG = 'aleaqrab_finance_config_v2';

const defaultConfig: FinanceConfig = {
    companyName: 'My Institution',
    taxNumber: '',
    vatRate: 14,
    currency: 'EGP',
    isTaxIncluded: true
};

export const getFinanceConfig = (): FinanceConfig => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY_CONFIG);
        return saved ? JSON.parse(saved) : defaultConfig;
    } catch (error) {
        console.error("Failed to load finance config", error);
        return defaultConfig;
    }
};

export const saveConfig = (config: FinanceConfig) => {
    localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(config));
};

export const getTransactions = (): FinanceTransaction[] => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY_TRANSACTIONS);
        return saved ? JSON.parse(saved) : [];
    } catch (error) {
        console.error("Failed to load transactions", error);
        return [];
    }
};

export const addTransaction = (
    data: Omit<FinanceTransaction, 'id' | 'taxAmount' | 'baseAmount' | 'status'>,
    config: FinanceConfig
): FinanceTransaction => {
    const { amount } = data;
    let taxAmount = 0;
    let baseAmount = amount;

    if (config.isTaxIncluded) {
        // Amount = Base + (Base * Rate/100) = Base * (1 + Rate/100)
        // Base = Amount / (1 + Rate/100)
        baseAmount = amount / (1 + config.vatRate / 100);
        taxAmount = amount - baseAmount;
    } else {
        // Base = Amount (entered)
        // Tax = Base * Rate/100
        // Total (not stored primarily as amount but implied? No, usually amount is total. Prompt says amount is number.)
        // Let's assume 'amount' passed here is the Base if tax NOT included, or Total if included.
        // If tax NOT included, the final TOTAL is calculated?
        // Wait, prompt says: "auto-calculate tax based on config".
        // If IS_TAX_INCLUDED: Input 114, Rate 14% -> Base 100, Tax 14.
        // If NOT_INCLUDED: Input 100, Rate 14% -> Base 100, Tax 14. (Total 114).

        // BUT the 'amount' field in Transaction usually represents the NOMINAL amount.
        // Let's assume 'amount' IS THE TOTAL PAID/RECEIVED.
        if (!config.isTaxIncluded) {
            // If user entered BASE amount, we calculate tax and Add it to Total.
            // Let's assume the UI sends the 'User Input Amount'.
            // If not included, Input=100 -> Base=100, Tax=14, Total=114.
            baseAmount = amount;
            taxAmount = amount * (config.vatRate / 100);
        }
    }

    // To be safe and consistent, we store the 'amount' as the Total Value (Base + Tax) if we want consistent ledger.
    // Or we just store what was passed. The prompt requires 'auto-calculate tax'.
    // Let's finalize:
    // Transaction.amount = The Total Final Value.

    let finalTotal = amount;
    if (!config.isTaxIncluded) {
        finalTotal = amount + taxAmount;
    }

    const newTransaction: FinanceTransaction = {
        ...data,
        id: `TRX-${Date.now()}`,
        baseAmount: parseFloat(baseAmount.toFixed(2)),
        taxAmount: parseFloat(taxAmount.toFixed(2)),
        amount: parseFloat(finalTotal.toFixed(2)), // Ensure amount is the Total
        status: 'COMPLETED'
    };

    const current = getTransactions();
    localStorage.setItem(STORAGE_KEY_TRANSACTIONS, JSON.stringify([newTransaction, ...current]));
    return newTransaction;
};

// --- DATA SEEDING (9 MONTHS) ---
export const seedMockData = () => {
    if (getTransactions().length > 0) return; // Don't seed if data exists

    const categories = ['رسوم دراسية', 'كتب وملازم', 'زي مدرسي', 'رواتب', 'كهرباء', 'إنترنت', 'صيانة', 'ضيافة'];
    const types = ['INCOME', 'INCOME', 'INCOME', 'EXPENSE', 'EXPENSE', 'EXPENSE', 'EXPENSE', 'EXPENSE'];

    let mockData: FinanceTransaction[] = [];
    const config = getFinanceConfig();
    const today = new Date();

    // Generate data for past 9 months
    for (let i = 0; i < 270; i++) {
        const date = new Date();
        date.setDate(today.getDate() - i);

        // Random number of transactions per day (0-3)
        const dailyCount = Math.floor(Math.random() * 4);

        for (let j = 0; j < dailyCount; j++) {
            const index = Math.floor(Math.random() * categories.length);
            const type = types[index] as 'INCOME' | 'EXPENSE';
            const amount = Math.floor(Math.random() * 5000) + 100;

            // Tax Logic (Simplified for Seed)
            const baseAmount = amount / 1.14;
            const taxAmount = amount - baseAmount;

            mockData.push({
                id: `MOCK-${Date.now()}-${i}-${j}`,
                description: `عملية ${categories[index]} - تجريبية`,
                amount: amount,
                baseAmount: Number(baseAmount.toFixed(2)),
                taxAmount: Number(taxAmount.toFixed(2)),
                category: categories[index],
                date: date.toISOString().split('T')[0],
                type: type,
                status: 'COMPLETED'
            });
        }
    }

    localStorage.setItem(STORAGE_KEY_TRANSACTIONS, JSON.stringify(mockData));
    console.log(`Seeded ${mockData.length} mock transactions.`);
};
