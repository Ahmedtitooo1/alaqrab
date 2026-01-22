// نظام سجل التدقيق (Audit Log) - منظومة العقرب

export type AuditAction =
    | 'CREATE'
    | 'UPDATE'
    | 'DELETE'
    | 'VIEW'
    | 'APPROVE'
    | 'REJECT'
    | 'LOGIN'
    | 'LOGOUT'
    | 'IMPERSONATE'
    | 'EXPORT'
    | 'PRINT';

export type AuditEntity =
    | 'USER'
    | 'STUDENT'
    | 'TEACHER'
    | 'PARENT'
    | 'ACCOUNTANT'
    | 'SECRETARY'
    | 'EXAM'
    | 'GRADE'
    | 'FINANCIAL_ENTRY'
    | 'JOURNAL_ENTRY'
    | 'PAYMENT'
    | 'ADJUSTMENT'
    | 'CONTENT'
    | 'ANNOUNCEMENT'
    | 'INVENTORY'
    | 'ASSET'
    | 'TENANT'
    | 'SETTINGS';

export interface AuditLog {
    id: string;
    timestamp: Date;

    // من قام بالإجراء
    userId: string;
    userName: string;
    userRole: string;

    // البيئة/المؤسسة
    tenantId: string;
    tenantName: string;

    // تفاصيل الإجراء
    action: AuditAction;
    entity: AuditEntity;
    entityId: string;
    entityName?: string;

    // البيانات
    oldValue?: any;  // القيمة القديمة (قبل التعديل)
    newValue?: any;  // القيمة الجديدة (بعد التعديل)
    changes?: Record<string, { old: any; new: any }>;  // التغييرات المحددة

    // معلومات إضافية
    description?: string;
    ip?: string;
    userAgent?: string;

    // للعمليات الخاصة
    metadata?: Record<string, any>;
}

// خدمة سجل التدقيق
class AuditService {
    private logs: AuditLog[] = [];

    /**
     * تسجيل إجراء جديد
     */
    log(params: {
        action: AuditAction;
        entity: AuditEntity;
        entityId: string;
        entityName?: string;
        userId: string;
        userName: string;
        userRole: string;
        tenantId: string;
        tenantName: string;
        oldValue?: any;
        newValue?: any;
        changes?: Record<string, { old: any; new: any }>;
        description?: string;
        metadata?: Record<string, any>;
    }): void {
        const logEntry: AuditLog = {
            id: this.generateId(),
            timestamp: new Date(),
            ip: this.getClientIP(),
            userAgent: navigator.userAgent,
            ...params
        };

        this.logs.push(logEntry);

        // حفظ في localStorage (في الإنتاج سيكون API call)
        this.saveLogs();

        console.log('📝 Audit Log:', this.formatLogMessage(logEntry));
    }

    /**
     * تسجيل عملية إنشاء
     */
    logCreate(params: {
        entity: AuditEntity;
        entityId: string;
        entityName?: string;
        newValue: any;
        userId: string;
        userName: string;
        userRole: string;
        tenantId: string;
        tenantName: string;
        description?: string;
    }): void {
        this.log({
            action: 'CREATE',
            ...params
        });
    }

    /**
     * تسجيل عملية تعديل
     */
    logUpdate(params: {
        entity: AuditEntity;
        entityId: string;
        entityName?: string;
        oldValue: any;
        newValue: any;
        changes?: Record<string, { old: any; new: any }>;
        userId: string;
        userName: string;
        userRole: string;
        tenantId: string;
        tenantName: string;
        description?: string;
    }): void {
        this.log({
            action: 'UPDATE',
            ...params
        });
    }

    /**
     * تسجيل عملية حذف
     */
    logDelete(params: {
        entity: AuditEntity;
        entityId: string;
        entityName?: string;
        oldValue: any;
        userId: string;
        userName: string;
        userRole: string;
        tenantId: string;
        tenantName: string;
        description?: string;
    }): void {
        this.log({
            action: 'DELETE',
            ...params
        });
    }

    /**
     * تسجيل دخول المستخدم
     */
    logLogin(userId: string, userName: string, userRole: string, tenantId: string, tenantName: string): void {
        this.log({
            action: 'LOGIN',
            entity: 'USER',
            entityId: userId,
            entityName: userName,
            userId,
            userName,
            userRole,
            tenantId,
            tenantName,
            description: 'تسجيل دخول للنظام'
        });
    }

    /**
     * تسجيل وضع المحاكاة
     */
    logImpersonation(
        superAdminId: string,
        superAdminName: string,
        targetUserId: string,
        targetUserName: string,
        targetUserRole: string,
        tenantId: string,
        tenantName: string
    ): void {
        this.log({
            action: 'IMPERSONATE',
            entity: 'USER',
            entityId: targetUserId,
            entityName: targetUserName,
            userId: superAdminId,
            userName: superAdminName,
            userRole: 'SUPER_ADMIN',
            tenantId,
            tenantName,
            description: `المدير ${superAdminName} دخل كـ ${targetUserRole}: ${targetUserName}`,
            metadata: {
                targetUserId,
                targetUserName,
                targetUserRole
            }
        });
    }

    /**
     * الحصول على السجلات بفلترة
     */
    getLogs(filters?: {
        userId?: string;
        tenantId?: string;
        entity?: AuditEntity;
        action?: AuditAction;
        startDate?: Date;
        endDate?: Date;
        limit?: number;
    }): AuditLog[] {
        let filtered = [...this.logs];

        if (filters?.userId) {
            filtered = filtered.filter(log => log.userId === filters.userId);
        }
        if (filters?.tenantId) {
            filtered = filtered.filter(log => log.tenantId === filters.tenantId);
        }
        if (filters?.entity) {
            filtered = filtered.filter(log => log.entity === filters.entity);
        }
        if (filters?.action) {
            filtered = filtered.filter(log => log.action === filters.action);
        }
        if (filters?.startDate) {
            filtered = filtered.filter(log => log.timestamp >= filters.startDate!);
        }
        if (filters?.endDate) {
            filtered = filtered.filter(log => log.timestamp <= filters.endDate!);
        }

        // ترتيب من الأحدث للأقدم
        filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

        if (filters?.limit) {
            filtered = filtered.slice(0, filters.limit);
        }

        return filtered;
    }

    /**
     * تصدير السجلات إلى CSV
     */
    exportToCSV(logs: AuditLog[]): string {
        const headers = ['التاريخ', 'المستخدم', 'الدور', 'الإجراء', 'الكيان', 'الوصف'];
        const rows = logs.map(log => [
            log.timestamp.toLocaleString('ar-EG'),
            log.userName,
            log.userRole,
            this.getActionLabel(log.action),
            this.getEntityLabel(log.entity),
            log.description || '-'
        ]);

        const csv = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');

        return csv;
    }

    // مساعدات داخلية
    private generateId(): string {
        return `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    private getClientIP(): string {
        // في الإنتاج سيتم الحصول عليه من الخادم
        return 'N/A';
    }

    private saveLogs(): void {
        try {
            localStorage.setItem('aleaqrab_audit_logs', JSON.stringify(this.logs.slice(-1000))); // آخر 1000 سجل
        } catch (e) {
            console.error('Failed to save audit logs:', e);
        }
    }

    private loadLogs(): void {
        try {
            const saved = localStorage.getItem('aleaqrab_audit_logs');
            if (saved) {
                this.logs = JSON.parse(saved);
            }
        } catch (e) {
            console.error('Failed to load audit logs:', e);
        }
    }

    private formatLogMessage(log: AuditLog): string {
        const action = this.getActionLabel(log.action);
        const entity = this.getEntityLabel(log.entity);
        return `${log.userName} (${log.userRole}) ${action} ${entity}: ${log.entityName || log.entityId}`;
    }

    private getActionLabel(action: AuditAction): string {
        const labels: Record<AuditAction, string> = {
            CREATE: 'أنشأ',
            UPDATE: 'عدّل',
            DELETE: 'حذف',
            VIEW: 'عرض',
            APPROVE: 'وافق على',
            REJECT: 'رفض',
            LOGIN: 'دخل',
            LOGOUT: 'خرج',
            IMPERSONATE: 'حاكى',
            EXPORT: 'صدّر',
            PRINT: 'طبع'
        };
        return labels[action];
    }

    private getEntityLabel(entity: AuditEntity): string {
        const labels: Record<AuditEntity, string> = {
            USER: 'مستخدم',
            STUDENT: 'طالب',
            TEACHER: 'معلم',
            PARENT: 'ولي أمر',
            ACCOUNTANT: 'محاسب',
            SECRETARY: 'سكرتير',
            EXAM: 'اختبار',
            GRADE: 'درجة',
            FINANCIAL_ENTRY: 'معاملة مالية',
            JOURNAL_ENTRY: 'قيد محاسبي',
            PAYMENT: 'دفعة',
            ADJUSTMENT: 'تعديل رصيد',
            CONTENT: 'محتوى',
            ANNOUNCEMENT: 'إعلان',
            INVENTORY: 'مخزون',
            ASSET: 'أصل',
            TENANT: 'بيئة',
            SETTINGS: 'إعدادات'
        };
        return labels[entity];
    }

    constructor() {
        this.loadLogs();
    }
}

// Instance واحدة مشتركة
export const auditService = new AuditService();

// Hook للاستخدام في React
import { useState, useEffect } from 'react';

export const useAuditLogs = (filters?: Parameters<typeof auditService.getLogs>[0]) => {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        // في الإنتاج سيكون هذا API call
        setTimeout(() => {
            const result = auditService.getLogs(filters);
            setLogs(result);
            setLoading(false);
        }, 100);
    }, [JSON.stringify(filters)]);

    return { logs, loading, refresh: () => setLogs(auditService.getLogs(filters)) };
};

export default auditService;
