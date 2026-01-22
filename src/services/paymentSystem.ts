// نظام الحسابات البنكية وطلبات الدفع - منظومة العقرب

// ============= الأنواع =============

export interface BankAccount {
    id: string;
    bankName: string;  // اسم البنك
    accountNumber: string;  // رقم الحساب
    accountName: string;  // اسم صاحب الحساب
    iban?: string;  // IBAN (اختياري)
    swiftCode?: string;  // SWIFT Code (اختياري)
    branchName?: string;  // اسم الفرع
    isActive: boolean;  // مفعّل/معطل
    logo?: string;  // شعار البنك
    description?: string;  // وصف أو ملاحظات
    createdAt: Date;
}

export interface PaymentRequest {
    id: string;

    // معلومات الطالب وولي الأمر
    studentId: string;
    studentName: string;
    parentId: string;
    parentName: string;

    // تفاصيل الدفع
    amount: number;
    currency: 'EGP' | 'USD' | 'SAR' | 'AED';
    bankAccountId: string;  // الحساب المحول إليه
    transferDate: Date;  // تاريخ التحويل
    notes: string;  // ملاحظات من ولي الأمر
    receiptImage: string;  // base64 or URL

    // الحالة والمراجعة
    status: 'pending' | 'approved' | 'rejected';
    reviewedBy?: string;  // معرف المحاسب
    reviewedByName?: string;
    reviewedAt?: Date;
    rejectionReason?: string;

    // ربط مع السند المحاسبي
    linkedJournalEntryId?: string;

    createdAt: Date;
    updatedAt: Date;
}

// ============= خدمة الحسابات البنكية =============

class BankAccountService {
    private accounts: BankAccount[] = [
        // حسابات افتراضية
        {
            id: 'bank_1',
            bankName: 'البنك الأهلي المصري',
            accountNumber: '1234567890',
            accountName: 'مركز العقرب التعليمي',
            iban: 'EG380019000100123456789012345',
            isActive: true,
            logo: 'https://via.placeholder.com/100x50/003366/ffffff?text=NBE',
            createdAt: new Date()
        },
        {
            id: 'bank_2',
            bankName: 'بنك مصر',
            accountNumber: '0987654321',
            accountName: 'مركز العقرب التعليمي',
            iban: 'EG210037000100098765432112345',
            isActive: true,
            logo: 'https://via.placeholder.com/100x50/C8102E/ffffff?text=BM',
            createdAt: new Date()
        }
    ];

    getActiveAccounts(): BankAccount[] {
        this.loadAccounts();
        return this.accounts.filter(acc => acc.isActive);
    }

    getAllAccounts(): BankAccount[] {
        this.loadAccounts();
        return this.accounts;
    }

    addAccount(account: Omit<BankAccount, 'id' | 'createdAt'>): BankAccount {
        const newAccount: BankAccount = {
            ...account,
            id: `bank_${Date.now()}`,
            createdAt: new Date()
        };
        this.accounts.push(newAccount);
        this.saveAccounts();
        return newAccount;
    }

    updateAccount(id: string, updates: Partial<BankAccount>): void {
        const index = this.accounts.findIndex(acc => acc.id === id);
        if (index !== -1) {
            this.accounts[index] = { ...this.accounts[index], ...updates };
            this.saveAccounts();
        }
    }

    toggleActive(id: string): void {
        const account = this.accounts.find(acc => acc.id === id);
        if (account) {
            account.isActive = !account.isActive;
            this.saveAccounts();
        }
    }

    private saveAccounts(): void {
        try {
            localStorage.setItem('aleaqrab_bank_accounts', JSON.stringify(this.accounts));
        } catch (e) {
            console.error('Failed to save bank accounts:', e);
        }
    }

    private loadAccounts(): void {
        try {
            const saved = localStorage.getItem('aleaqrab_bank_accounts');
            if (saved) {
                this.accounts = JSON.parse(saved);
            }
        } catch (e) {
            console.error('Failed to load bank accounts:', e);
        }
    }

    constructor() {
        this.loadAccounts();
    }
}

// ============= خدمة طلبات الدفع =============

class PaymentRequestService {
    private requests: PaymentRequest[] = [];

    createRequest(data: {
        studentId: string;
        studentName: string;
        parentId: string;
        parentName: string;
        amount: number;
        bankAccountId: string;
        transferDate: Date;
        notes: string;
        receiptImage: string;
    }): PaymentRequest {
        const request: PaymentRequest = {
            ...data,
            id: `pay_req_${Date.now()}`,
            currency: 'EGP',
            status: 'pending',
            createdAt: new Date(),
            updatedAt: new Date()
        };

        this.requests.push(request);
        this.saveRequests();
        return request;
    }

    getPendingRequests(): PaymentRequest[] {
        this.loadRequests();
        return this.requests.filter(req => req.status === 'pending')
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    getAllRequests(): PaymentRequest[] {
        this.loadRequests();
        return this.requests.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    getRequestsByParent(parentId: string): PaymentRequest[] {
        this.loadRequests();
        return this.requests.filter(req => req.parentId === parentId)
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    approveRequest(
        requestId: string,
        accountantId: string,
        accountantName: string,
        onCreateJournalEntry: (request: PaymentRequest) => string
    ): void {
        const request = this.requests.find(req => req.id === requestId);
        if (!request) return;

        // إنشاء السند المحاسبي
        const journalEntryId = onCreateJournalEntry(request);

        // تحديث الطلب
        request.status = 'approved';
        request.reviewedBy = accountantId;
        request.reviewedByName = accountantName;
        request.reviewedAt = new Date();
        request.linkedJournalEntryId = journalEntryId;
        request.updatedAt = new Date();

        this.saveRequests();

        // إشعار ولي الأمر
        alert(`✅ تم قبول الطلب وإنشاء السند المحاسبي\nرقم السند: ${journalEntryId}`);
    }

    rejectRequest(requestId: string, accountantId: string, accountantName: string, reason: string): void {
        const request = this.requests.find(req => req.id === requestId);
        if (!request) return;

        request.status = 'rejected';
        request.reviewedBy = accountantId;
        request.reviewedByName = accountantName;
        request.reviewedAt = new Date();
        request.rejectionReason = reason;
        request.updatedAt = new Date();

        this.saveRequests();

        // إشعار ولي الأمر
        alert(`⚠️ تم رفض الطلب\nالسبب: ${reason}`);
    }

    private saveRequests(): void {
        try {
            localStorage.setItem('aleaqrab_payment_requests', JSON.stringify(this.requests));
        } catch (e) {
            console.error('Failed to save payment requests:', e);
        }
    }

    private loadRequests(): void {
        try {
            const saved = localStorage.getItem('aleaqrab_payment_requests');
            if (saved) {
                this.requests = JSON.parse(saved);
            }
        } catch (e) {
            console.error('Failed to load payment requests:', e);
        }
    }

    constructor() {
        this.loadRequests();
    }
}

// ============= Exports =============

export const bankAccountService = new BankAccountService();
export const paymentRequestService = new PaymentRequestService();

export default {
    bankAccountService,
    paymentRequestService
};
