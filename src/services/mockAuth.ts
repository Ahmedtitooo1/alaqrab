import { User, UserRole, Institution, ClientType, PricingModel } from '../../types';
import { mockDb } from './mockDb';

// SESSION KEYS
const TOKEN_KEY = 'aleaqrab_auth_token';
const TENANT_KEY = 'aleaqrab_tenant_id';
const USER_KEY = 'aleaqrab_user';

export const mockAuthService = {

    // LOGIN
    login: async (email: string, role?: UserRole): Promise<{ user: User; token: string; tenant: Institution } | null> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // 1. Find User
                // For simulation, we simplify password check. In real app, check password hash.
                const user = mockDb.users.find(u => u.email?.toLowerCase() === email.toLowerCase());

                if (!user) {
                    reject(new Error('Invalid credentials'));
                    return;
                }

                // 2. Find Tenant
                const tenant = mockDb.tenants.find(t => t.id === user.institutionId);
                if (!tenant) {
                    reject(new Error('System Error: Tenant not found for user'));
                    return;
                }

                // 3. Check Subscription Status
                if (tenant.status === 'suspended') {
                    reject(new Error('Subscription Suspended. Please contact support.'));
                    return;
                }

                // 4. Generate Fake Token
                const token = `mock-jwt-${Date.now()}-${user.id}`;

                // Persist Session
                localStorage.setItem(TOKEN_KEY, token);
                localStorage.setItem(TENANT_KEY, tenant.id);
                localStorage.setItem(USER_KEY, JSON.stringify(user));

                resolve({ user, token, tenant });
            }, 800); // Simulate network delay
        });
    },

    // REGISTER (New Tenant)
    register: async (data: { organizationName: string; firstName: string; lastName: string; email: string; password?: string; tenantType: 'tutor' | 'center' | 'school' }) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newTenantId = `tenant-${Date.now()}`;

                // Set limits based on type
                let limits = { admins: 1, teachers: 1, accountants: 0, students: 50 };
                let permissions = {
                    allowCustomBranding: false,
                    allowAiCorrection: false,
                    allowSmartAnalyst: false,
                    allowAiUsage: true,
                    allowFinancialLedger: false,
                    allowLiveStreaming: false
                };

                if (data.tenantType === 'center') {
                    limits = { admins: 3, teachers: 10, accountants: 2, students: 500 };
                    permissions.allowFinancialLedger = true;
                    permissions.allowCustomBranding = true;
                } else if (data.tenantType === 'school') {
                    limits = { admins: 10, teachers: 50, accountants: 5, students: 2000 };
                    permissions.allowFinancialLedger = true;
                    permissions.allowCustomBranding = true;
                    permissions.allowAiCorrection = true;
                    permissions.allowSmartAnalyst = true;
                }

                const newTenant: Institution = {
                    id: newTenantId,
                    name: data.organizationName,
                    type: data.tenantType === 'tutor' ? ClientType.INDIVIDUAL : (data.tenantType === 'school' ? ClientType.SCHOOL : ClientType.INSTITUTION),
                    subdomain: data.organizationName.toLowerCase().replace(/\s+/g, '-'),
                    status: 'active',
                    expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                    permissions,
                    limits,
                    pricing: { model: PricingModel.MONTHLY, totalAmount: 0, paidAmount: 0, revenue: 0 },
                    paymentHistory: [],
                    currencies: [{ code: 'EGP', name: 'Egyptian Pound', symbol: 'EGP', exchangeRate: 1, isBase: true }]
                } as any;

                mockDb.tenants.push(newTenant);

                // Create Admin
                const newAdmin: User = {
                    id: `usr-${Date.now()}`,
                    code: 'ADM-001',
                    firstName: data.firstName,
                    lastName: data.lastName,
                    role: UserRole.ADMIN,
                    institutionId: newTenantId,
                    email: data.email,
                    aiQuestionsCount: 100
                };

                mockDb.users.push(newAdmin);

                resolve({
                    user: newAdmin,
                    token: `mock-jwt-${Date.now()}`,
                    tenant: newTenant,
                    credentials: {
                        username: data.email,
                        password: data.password || 'password123'
                    }
                });
            }, 1500);
        });
    },

    // LOGOUT
    logout: () => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(TENANT_KEY);
        localStorage.removeItem(USER_KEY);
        window.location.href = '/';
    },

    // CHECK SESSION
    getCurrentSession: () => {
        const token = localStorage.getItem(TOKEN_KEY);
        const storedUser = localStorage.getItem(USER_KEY);
        const storedTenantId = localStorage.getItem(TENANT_KEY);

        if (!token || !storedUser || !storedTenantId) return null;

        const user = JSON.parse(storedUser);
        const tenant = mockDb.tenants.find(t => t.id === storedTenantId);

        // Re-validate subscription on refresh
        if (tenant && tenant.status === 'suspended') {
            localStorage.clear();
            return null;
        }

        return { user, tenant };
    },

    // RBAC Helper
    canAccessModule: (user: User, module: 'financial' | 'inventory' | 'hr') => {
        const tenant = mockDb.tenants.find(t => t.id === user.institutionId);
        if (!tenant) return false;

        // Tenant Restrictions (Tutor Mode hides ERP)
        if (tenant.type === 'individual' && (module === 'financial' || module === 'inventory' || module === 'hr')) {
            return false;
        }

        // Role Restrictions
        if (user.role === UserRole.STUDENT || user.role === UserRole.PARENT) return false;

        return true;
    }
};
