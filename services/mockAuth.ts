import { UserRole } from '../types';

export interface User {
    id: string;
    name: string;
    email: string;
    role: string | UserRole;
    tenantId: string;
    tenantName: string;
    avatar?: string;
    permissions: string[];
}

export interface AuthResponse {
    user: User;
    token: string;
    tenant: {
        id: string;
        name: string;
        type: 'tutor' | 'center';
        subscription_status: 'trial' | 'active' | 'grace_period' | 'suspended';
        trial_ends_at: string;
    };
}

const MOCK_USERS = [
    {
        id: 'u-admin-1',
        name: 'Super Admin',
        email: 'admin@aleaqrab.com',
        password: 'password',
        role: UserRole.ADMIN,
        tenantId: 't-hq',
        tenantName: 'Aleaqrab HQ',
        avatar: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
        permissions: ['all']
    },
    {
        id: 'u-teacher-1',
        name: 'Ahmed Teacher',
        email: 'teacher@demo.com',
        password: 'password',
        role: UserRole.TEACHER, // Matches UserRole.TEACHER hopefully or string
        tenantId: 't-demo',
        tenantName: 'Demo Center',
        avatar: 'https://cdn-icons-png.flaticon.com/512/3135/3135768.png',
        permissions: ['manage_courses']
    },
    {
        id: 'u-student-1',
        name: 'Sara Student',
        email: 'student@demo.com',
        password: 'password',
        role: UserRole.STUDENT,
        tenantId: 't-demo',
        tenantName: 'Demo Center',
        permissions: ['view_courses']
    },
    {
        id: 'u-accountant-1',
        name: 'Ali Accountant',
        email: 'accountant@demo.com',
        password: 'password',
        role: UserRole.ACCOUNTANT,
        tenantId: 't-demo',
        tenantName: 'Demo Center',
        permissions: ['manage_finance']
    }
];

const mockAuthService = {
    checkSubscriptionStatus: (tenant: any) => {
        const now = new Date();
        const trialEnd = new Date(tenant.trial_ends_at);

        if (tenant.subscription_status === 'trial') {
            if (now > trialEnd) return 'grace_period';
            return 'trial';
        }
        return tenant.subscription_status;
    },

    login: async (email, password): Promise<AuthResponse> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const foundUser = MOCK_USERS.find(u => u.email === email && u.password === password);

                if (foundUser) {
                    const tenant = {
                        id: foundUser.tenantId,
                        name: foundUser.tenantName,
                        type: 'center' as 'center', // defaulting for existing users
                        subscription_status: 'active' as 'active',
                        trial_ends_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
                    };

                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const { password: _p, ...userWithoutPassword } = foundUser;

                    // @ts-ignore
                    resolve({
                        user: userWithoutPassword as User,
                        token: 'mock-jwt-token-' + Math.random().toString(36).substr(2),
                        tenant
                    });
                } else {
                    reject(new Error('Invalid credentials'));
                }
            }, 800);
        });
    },

    register: async (data): Promise<AuthResponse> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newTenantId = `t-${Math.random().toString(36).substr(2, 5)}`;
                const userId = `u-${Math.random().toString(36).substr(2, 5)}`;

                const trialEndDate = new Date();
                trialEndDate.setDate(trialEndDate.getDate() + 7);

                const newUser = {
                    id: userId,
                    name: data.ownerName,
                    email: data.email,
                    role: UserRole.ADMIN, // Owner is admin
                    tenantId: newTenantId,
                    tenantName: data.orgName,
                    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.ownerName)}&background=4169E1&color=fff`,
                    permissions: ['all']
                };

                const newTenant = {
                    id: newTenantId,
                    name: data.orgName,
                    type: data.type as 'tutor' | 'center',
                    subscription_status: 'trial' as 'trial',
                    trial_ends_at: trialEndDate.toISOString()
                };

                // In a real app we would push to MOCK_USERS, but this is a sterile simulation
                // MOCK_USERS.push({...newUser, password: data.password});

                // @ts-ignore
                resolve({
                    user: newUser,
                    token: 'mock-jwt-token-' + Math.random().toString(36).substr(2),
                    tenant: newTenant
                });
            }, 800);
        });
    }
};

export default mockAuthService;
