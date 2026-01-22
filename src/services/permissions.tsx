// نظام الصلاحيات المتقدم - منظومة العقرب

import { UserRole } from '../../types';

// أنواع الصلاحيات
export type Permission =
    // إدارة المستخدمين
    | 'users.view'
    | 'users.create'
    | 'users.edit'
    | 'users.delete'
    | 'users.impersonate'

    // إدارة الطلاب
    | 'students.view'
    | 'students.create'
    | 'students.edit'
    | 'students.delete'
    | 'students.grades.view'
    | 'students.grades.edit'
    | 'students.financial.view'
    | 'students.financial.edit'

    // إدارة المعلمين
    | 'teachers.view'
    | 'teachers.create'
    | 'teachers.edit'
    | 'teachers.delete'
    | 'teachers.salaries.view'
    | 'teachers.salaries.edit'

    // إدارة السكرتارية
    | 'secretaries.view'
    | 'secretaries.create'
    | 'secretaries.edit'
    | 'secretaries.delete'

    // إدارة المحاسبين
    | 'accountants.view'
    | 'accountants.create'
    | 'accountants.edit'
    | 'accountants.delete'

    // المالية
    | 'finance.view'
    | 'finance.journal.create'
    | 'finance.journal.edit'
    | 'finance.journal.approve'
    | 'finance.reports.view'
    | 'finance.adjustments.create'
    | 'finance.adjustments.approve'

    // المخزون
    | 'inventory.view'
    | 'inventory.create'
    | 'inventory.edit'
    | 'inventory.delete'

    // الاختبارات
    | 'exams.view'
    | 'exams.create'
    | 'exams.edit'
    | 'exams.delete'
    | 'exams.results.view'
    | 'exams.results.edit'

    // المحتوى
    | 'content.view'
    | 'content.create'
    | 'content.edit'
    | 'content.delete'
    | 'content.approve'

    // الإعدادات
    | 'settings.view'
    | 'settings.edit'
    | 'settings.branding'  // الهوية البصرية
    | 'settings.notifications'

    // إدارة البيئات (Super Admin)
    | 'tenants.view'
    | 'tenants.create'
    | 'tenants.edit'
    | 'tenants.delete'
    | 'tenants.suspend'

    // سجل التدقيق
    | 'audit.view'
    | 'audit.export'

    // الموافقات
    | 'approvals.view'
    | 'approvals.approve'
    | 'approvals.reject';

// مصفوفة الصلاحيات حسب الدور
export const RolePermissions: Record<UserRole, Permission[]> = {
    [UserRole.SUPER_ADMIN]: [
        // Super Admin له كل الصلاحيات
        'users.view', 'users.create', 'users.edit', 'users.delete', 'users.impersonate',
        'students.view', 'students.create', 'students.edit', 'students.delete',
        'students.grades.view', 'students.grades.edit',
        'students.financial.view', 'students.financial.edit',
        'teachers.view', 'teachers.create', 'teachers.edit', 'teachers.delete',
        'teachers.salaries.view', 'teachers.salaries.edit',
        'secretaries.view', 'secretaries.create', 'secretaries.edit', 'secretaries.delete',
        'accountants.view', 'accountants.create', 'accountants.edit', 'accountants.delete',
        'finance.view', 'finance.journal.create', 'finance.journal.edit', 'finance.journal.approve',
        'finance.reports.view', 'finance.adjustments.create', 'finance.adjustments.approve',
        'inventory.view', 'inventory.create', 'inventory.edit', 'inventory.delete',
        'exams.view', 'exams.create', 'exams.edit', 'exams.delete',
        'exams.results.view', 'exams.results.edit',
        'content.view', 'content.create', 'content.edit', 'content.delete', 'content.approve',
        'settings.view', 'settings.edit', 'settings.branding', 'settings.notifications',
        'tenants.view', 'tenants.create', 'tenants.edit', 'tenants.delete', 'tenants.suspend',
        'audit.view', 'audit.export',
        'approvals.view', 'approvals.approve', 'approvals.reject'
    ],

    [UserRole.ADMIN]: [
        // مدير الفرع
        'users.view',
        'students.view', 'students.create', 'students.edit', 'students.delete',
        'students.grades.view', 'students.grades.edit',
        'students.financial.view', 'students.financial.edit',
        'teachers.view', 'teachers.create', 'teachers.edit', 'teachers.delete',
        'teachers.salaries.view',
        'secretaries.view', 'secretaries.create', 'secretaries.edit', 'secretaries.delete',
        'accountants.view', 'accountants.create', 'accountants.edit', 'accountants.delete',
        'finance.view', 'finance.reports.view',
        'inventory.view', 'inventory.create', 'inventory.edit',
        'exams.view', 'exams.create', 'exams.edit', 'exams.delete',
        'exams.results.view', 'exams.results.edit',
        'content.view', 'content.create', 'content.edit', 'content.delete', 'content.approve',
        'settings.view', 'settings.edit', 'settings.branding',
        'audit.view',
        'approvals.view', 'approvals.approve', 'approvals.reject'
    ],

    [UserRole.ACCOUNTANT]: [
        // المحاسب
        'students.financial.view',
        'teachers.salaries.view',
        'finance.view', 'finance.journal.create', 'finance.journal.edit',
        'finance.reports.view', 'finance.adjustments.create',
        'inventory.view', 'inventory.create', 'inventory.edit',
        'audit.view'
    ],

    [UserRole.TEACHER]: [
        // المعلم
        'students.view', 'students.grades.view', 'students.grades.edit',
        'exams.view', 'exams.create', 'exams.edit',
        'exams.results.view', 'exams.results.edit',
        'content.view', 'content.create', 'content.edit'
    ],

    [UserRole.STUDENT]: [
        // الطالب
        'exams.view',
        'exams.results.view',
        'content.view'
    ],

    [UserRole.PARENT]: [
        // ولي الأمر
        'students.view',
        'students.grades.view',
        'students.financial.view',
        'exams.results.view'
    ],

    [UserRole.SECRETARY]: [
        // السكرتارية
        'students.view', 'students.create', 'students.edit',
        'students.financial.view',
        'teachers.view',
        'content.view'
    ],

    [UserRole.GUEST]: [],
    [UserRole.ANNOUNCER]: []
};

// وظيفة للتحقق من الصلاحية
export const hasPermission = (userRole: UserRole, permission: Permission): boolean => {
    const rolePermissions = RolePermissions[userRole] || [];
    return rolePermissions.includes(permission);
};

// وظيفة للتحقق من صلاحيات متعددة (كلها مطلوبة)
export const hasAllPermissions = (userRole: UserRole, permissions: Permission[]): boolean => {
    return permissions.every(p => hasPermission(userRole, p));
};

// وظيفة للتحقق من صلاحيات متعددة (واحدة على الأقل مطلوبة)
export const hasAnyPermission = (userRole: UserRole, permissions: Permission[]): boolean => {
    return permissions.some(p => hasPermission(userRole, p));
};

// مكون للتحقق من الصلاحية
import React, { ReactNode } from 'react';

interface ProtectedProps {
    permission: Permission | Permission[];
    children: ReactNode;
    fallback?: ReactNode;
    requireAll?: boolean; // true = كل الصلاحيات، false = واحدة على الأقل
}

export const Protected: React.FC<ProtectedProps> = ({
    permission,
    children,
    fallback = null,
    requireAll = true
}) => {
    // استخدم useAppContext للحصول على الدور
    // const { user } = useAppContext();
    // const userRole = user?.role;

    // مؤقتاً نفترض دور Admin للتجربة
    const userRole = UserRole.ADMIN;

    if (!userRole) return <>{fallback}</>;

    const permissions = Array.isArray(permission) ? permission : [permission];

    const hasAccess = requireAll
        ? hasAllPermissions(userRole, permissions)
        : hasAnyPermission(userRole, permissions);

    return hasAccess ? <>{children}</> : <>{fallback}</>;
};

export default {
    hasPermission,
    hasAllPermissions,
    hasAnyPermission,
    Protected,
    RolePermissions
};
