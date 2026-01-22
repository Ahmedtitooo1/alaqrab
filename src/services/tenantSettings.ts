// إعدادات البيئة (Tenant Settings) - منظومة العقرب

export interface TenantSettings {
    // معلومات أساسية
    id: string;
    name: string;
    slug: string;
    type: 'center' | 'individual';

    // الهوية البصرية (Branding)
    branding: {
        logo: string;  // URL أو base64
        primaryColor: string;  // #3B82F6
        secondaryColor: string;  // #10B981
        accentColor: string;  // #F59E0B
        font: 'Cairo' | 'Tajawal' | 'Almarai' | 'custom';
        customFontUrl?: string;
    };

    // الصلاحيات والأعداد المسموحة
    limits: {
        maxStudents: number;  // -1 = غير محدود
        maxTeachers: number;
        maxAccountants: number;
        maxSecretaries: number;  // ✅ إضافة السكرتارية
        maxParents: number;
        maxAdmins: number;
    };

    // الميزات المفعلة
    features: {
        financialModule: boolean;
        inventoryModule: boolean;
        examsModule: boolean;
        aiFeatures: boolean;
        certificatesModule: boolean;
        marketplaceModule: boolean;
        liveClassesModule: boolean;
    };

    // إعدادات مالية
    financial: {
        currency: 'EGP' | 'USD' | 'SAR' | 'AED';
        fiscalYearStart: string;  // 'MM-DD' format
        taxRate: number;  // نسبة الضريبة
    };

    // إعدادات الإشعارات
    notifications: {
        channels: {
            whatsapp: boolean;
            sms: boolean;
            email: boolean;
        };
        apiKeys: {
            whatsappToken?: string;
            smsProvider?: string;
            smsApiKey?: string;
            emailProvider?: string;
            emailApiKey?: string;
        };
    };

    // الاشتراك
    subscription: {
        plan: 'trial' | 'basic' | 'premium' | 'enterprise';
        startDate: Date;
        endDate: Date;
        status: 'active' | 'trial' | 'grace' | 'suspended';
        daysRemaining: number;
    };

    // معلومات الاتصال
    contact: {
        phone: string;
        email: string;
        address: string;
        city: string;
        country: string;
    };
}

// نموذج البيانات الافتراضية
export const defaultTenantSettings = (tenantId: string, name: string, type: 'center' | 'individual'): TenantSettings => ({
    id: tenantId,
    name,
    slug: name.toLowerCase().replace(/\s+/g, '-'),
    type,

    branding: {
        logo: '/default-logo.svg',
        primaryColor: '#3B82F6',
        secondaryColor: '#10B981',
        accentColor: '#F59E0B',
        font: 'Cairo'
    },

    limits: type === 'individual' ? {
        // معلم فردي
        maxStudents: 50,
        maxTeachers: 1,
        maxAccountants: 0,
        maxSecretaries: 0,
        maxParents: 50,
        maxAdmins: 1
    } : {
        // مركز
        maxStudents: -1,  // غير محدود
        maxTeachers: -1,
        maxAccountants: 5,
        maxSecretaries: 3,  // ✅ السكرتارية
        maxParents: -1,
        maxAdmins: 10
    },

    features: {
        financialModule: type === 'center',  // المالية فقط للمراكز
        inventoryModule: type === 'center',
        examsModule: true,
        aiFeatures: true,
        certificatesModule: true,
        marketplaceModule: false,
        liveClassesModule: true
    },

    financial: {
        currency: 'EGP',
        fiscalYearStart: '07-01',  // أول يوليو
        taxRate: 0  // لا ضرائب افتراضياً
    },

    notifications: {
        channels: {
            whatsapp: false,
            sms: false,
            email: false
        },
        apiKeys: {}
    },

    subscription: {
        plan: 'trial',
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),  // 7 أيام
        status: 'trial',
        daysRemaining: 7
    },

    contact: {
        phone: '',
        email: '',
        address: '',
        city: '',
        country: 'مصر'
    }
});

// خدمة إدارة إعدادات البيئة
class TenantSettingsService {
    private settings: Map<string, TenantSettings> = new Map();

    /**
     * إنشاء بيئة جديدة
     */
    createTenant(name: string, type: 'center' | 'individual'): TenantSettings {
        const tenantId = `tenant_${Date.now()}`;
        const newSettings = defaultTenantSettings(tenantId, name, type);
        this.settings.set(tenantId, newSettings);
        this.save();
        return newSettings;
    }

    /**
     * الحصول على إعدادات بيئة
     */
    getTenantSettings(tenantId: string): TenantSettings | null {
        return this.settings.get(tenantId) || null;
    }

    /**
     * تحديث الهوية البصرية
     */
    updateBranding(tenantId: string, branding: Partial<TenantSettings['branding']>): void {
        const current = this.settings.get(tenantId);
        if (current) {
            current.branding = { ...current.branding, ...branding };
            this.settings.set(tenantId, current);
            this.save();
        }
    }

    /**
     * تحديث الحدود والصلاحيات
     */
    updateLimits(tenantId: string, limits: Partial<TenantSettings['limits']>): void {
        const current = this.settings.get(tenantId);
        if (current) {
            current.limits = { ...current.limits, ...limits };
            this.settings.set(tenantId, current);
            this.save();
        }
    }

    /**
     * التحقق من إمكانية إضافة مستخدم جديد
     */
    canAddUser(tenantId: string, role: 'STUDENT' | 'TEACHER' | 'ACCOUNTANT' | 'SECRETARY' | 'ADMIN'): {
        allowed: boolean;
        reason?: string;
        currentCount?: number;
        maxCount?: number;
    } {
        const settings = this.settings.get(tenantId);
        if (!settings) {
            return { allowed: false, reason: 'البيئة غير موجودة' };
        }

        // حساب العدد الحالي (في الإنتاج سيكون من قاعدة البيانات)
        const currentCounts = this.getCurrentUserCounts(tenantId);

        let maxCount: number;
        let currentCount: number;
        let roleLabel: string;

        switch (role) {
            case 'STUDENT':
                maxCount = settings.limits.maxStudents;
                currentCount = currentCounts.students;
                roleLabel = 'الطلاب';
                break;
            case 'TEACHER':
                maxCount = settings.limits.maxTeachers;
                currentCount = currentCounts.teachers;
                roleLabel = 'المعلمين';
                break;
            case 'ACCOUNTANT':
                maxCount = settings.limits.maxAccountants;
                currentCount = currentCounts.accountants;
                roleLabel = 'المحاسبين';
                break;
            case 'SECRETARY':
                maxCount = settings.limits.maxSecretaries;
                currentCount = currentCounts.secretaries;
                roleLabel = 'السكرتارية';
                break;
            case 'ADMIN':
                maxCount = settings.limits.maxAdmins;
                currentCount = currentCounts.admins;
                roleLabel = 'المديرين';
                break;
            default:
                return { allowed: false, reason: 'دور غير معروف' };
        }

        // -1 يعني غير محدود
        if (maxCount === -1) {
            return { allowed: true, currentCount, maxCount };
        }

        // 0 يعني غير مسموح
        if (maxCount === 0) {
            return {
                allowed: false,
                reason: `غير مسموح بإضافة ${roleLabel} في هذه البيئة`,
                currentCount,
                maxCount
            };
        }

        // التحقق من الحد
        if (currentCount >= maxCount) {
            return {
                allowed: false,
                reason: `تم الوصول للحد الأقصى من ${roleLabel} (${maxCount})`,
                currentCount,
                maxCount
            };
        }

        return { allowed: true, currentCount, maxCount };
    }

    /**
     * الحصول على الأعداد الحالية (mock)
     */
    private getCurrentUserCounts(tenantId: string): {
        students: number;
        teachers: number;
        accountants: number;
        secretaries: number;
        admins: number;
    } {
        // في الإنتاج سيكون من قاعدة البيانات
        return {
            students: 0,
            teachers: 0,
            accountants: 0,
            secretaries: 0,
            admins: 1
        };
    }

    private save(): void {
        try {
            const data = Array.from(this.settings.entries());
            localStorage.setItem('aleaqrab_tenant_settings', JSON.stringify(data));
        } catch (e) {
            console.error('Failed to save tenant settings:', e);
        }
    }

    private load(): void {
        try {
            const saved = localStorage.getItem('aleaqrab_tenant_settings');
            if (saved) {
                const data = JSON.parse(saved);
                this.settings = new Map(data);
            }
        } catch (e) {
            console.error('Failed to load tenant settings:', e);
        }
    }

    constructor() {
        this.load();
    }
}

export const tenantSettingsService = new TenantSettingsService();
export default tenantSettingsService;
