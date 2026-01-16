
import * as React from 'react';
import { createContext, useContext, useState, ReactNode, useMemo, useEffect } from 'react';
import {
  User, UserRole, FinancialCategory, FinancialEntry,
  InventoryItem, InventoryTransaction, Notification, PayrollRecord,
  Announcement, Institution, Supplier, AnnouncementStatus, AnnouncementType,
  QuestionType, ClientType, PricingModel, FinancialFund
} from '../types';

interface AppContextType {
  lang: 'ar' | 'en';
  user: User | null;
  originalAdmin: User | null;
  financialCategories: FinancialCategory[];
  financialEntries: FinancialEntry[];
  inventoryItems: InventoryItem[];
  inventoryTransactions: InventoryTransaction[];
  inventoryCategories: string[];
  suppliers: Supplier[];
  allUsers: User[];
  funds: FinancialFund[];
  notifications: Notification[];
  payrollRecords: PayrollRecord[];
  announcements: Announcement[];
  institutions: Institution[];
  setLang: (l: 'ar' | 'en') => void;
  setUser: (u: User | null) => void;
  t: (key: string) => string;
  addNotification: (n: Omit<Notification, 'id' | 'isRead'>) => void;
  addFinancialEntry: (e: FinancialEntry) => void;
  updateFinancialEntry: (e: FinancialEntry) => void;
  deleteFinancialEntry: (id: string) => void;
  addFinancialCategory: (c: FinancialCategory) => void;
  updateFinancialCategory: (c: FinancialCategory) => void;
  deleteFinancialCategory: (id: string) => void;
  addInventoryItem: (i: InventoryItem) => void;
  updateInventoryItem: (i: InventoryItem) => void;
  deleteInventoryItem: (id: string) => void;
  addInventoryTransaction: (t: InventoryTransaction) => void;
  addSupplier: (s: Supplier) => void;
  addStudentWithAccount: (student: User, parentData: Partial<User>, createStudentUser: boolean, createParentUser: boolean) => void;
  addEmployeeRecord: (emp: User, createLogin: boolean) => void;
  addFinancialFund: (fund: FinancialFund) => void;
  updateStudentSubscription: (id: string, amount: number, date: string) => void;
  addInstitution: (inst: Institution) => void;
  updateInstitution: (inst: Institution) => void;
  renewSubscription: (id: string, newExpiry: string, newAmount: number) => void;
  approveAnnouncement: (id: string) => void;
  rejectAnnouncement: (id: string) => void;
  addAnnouncement: (a: Announcement) => void;
  startSimulation: (targetUser: User) => void;
  endSimulation: () => void;
  useAiQuestion: () => boolean;
  systemLogo: string;
  systemName: string;
  setSystemName: (name: string) => void;
  systemContact: { email: string; phone: string };
  setSystemContact: (contact: { email: string; phone: string }) => void;
  focusMode: boolean;
  setFocusMode: (mode: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within an AppProvider');
  return context;
};

const translations: any = {
  ar: {
    dashboard: "لوحة التحكم",
    student: "طالب",
    teacher: "معلم",
    accountant: "المحاسب المالي",
    admin: "مدير الفرع",
    super_admin: "مدير النظام (SaaS)",
    parent: "ولي أمر",
    logout: "تسجيل الخروج",
    messages: "مركز المراسلات",
    settings: "الإعدادات العامة",
    search_placeholder: "ابحث عن أي شيء...",
    online: "متصل الآن",
    offline: "غير متصل",
    type_message: "اكتب رسالتك هنا...",
    announcements_title: "مركز التعميمات والإشعارات",
    announcement_val: "إعلان عام",
    event_val: "فعالية مجدولة",
    inventory: "المخازن والجرد",
    payroll: "مسيرات الرواتب",
    ledger: "دفتر الأستاذ",
    vouchers: "سندات القبض والصرف",
    coa: "دليل الحسابات",
    suppliers: "إدارة الموردين",
    liabilities: "الالتزامات المالية",
    reports: "التقارير التحليلية"
  }
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [user, setUser] = useState<User | null>(null);
  const [originalAdmin, setOriginalAdmin] = useState<User | null>(null);
  const [systemName, setSystemName] = useState("منظومة العقرب التعليمية");
  const [systemLogo, setSystemLogo] = useState("/logo.png");
  const [systemContact, setSystemContact] = useState({ email: "support@aleaqrab.com", phone: "+201000000000" });
  const [focusMode, setFocusMode] = useState(false);

  const [allUsers, setAllUsers] = useState<User[]>([
    { id: 'u1', code: 'SA-001', firstName: 'أدمن', lastName: 'المنظومة', role: UserRole.SUPER_ADMIN, institutionId: 'saas', aiQuestionsCount: 999 },
    { id: 'u2', code: 'ACC-1001', firstName: 'محاسب', lastName: 'الفرع', role: UserRole.ACCOUNTANT, institutionId: 'inst-1', aiQuestionsCount: 0, salary: 8500, username: 'acc_demo' },
    { id: 'u3', code: 'TEA-1001', firstName: 'محمود', lastName: 'العزازي', role: UserRole.TEACHER, institutionId: 'inst-1', aiQuestionsCount: 50, salary: 12000, username: 'tea_demo' },
    { id: 'u4', code: 'STD-1001', firstName: 'ياسين', lastName: 'محمود', role: UserRole.STUDENT, institutionId: 'inst-1', teacherId: 'u3', aiQuestionsCount: 10, subscriptionAmount: 650, nextRenewalDate: '2024-06-01', username: 'std_demo' }
  ]);

  const [categoriesBase, setCategoriesBase] = useState<FinancialCategory[]>([
    { id: '1', name: 'الأصول', code: '1', type: 'asset', level: 1 },
    { id: '11', name: 'الأصول المتداولة', code: '11', type: 'asset', parentId: '1', level: 2 },
    { id: '111', name: 'الصناديق والبنوك', code: '111', type: 'asset', parentId: '11', level: 3 },
    { id: '112', name: 'ذمم الطلاب', code: '112', type: 'asset', parentId: '11', level: 3 },
    { id: '113', name: 'المخزون', code: '113', type: 'asset', parentId: '11', level: 3 },
    { id: '2', name: 'الخصوم', code: '2', type: 'liability', level: 1 },
    { id: '21', name: 'الخصوم المتداولة', code: '21', type: 'liability', parentId: '2', level: 2 },
    { id: '211', name: 'ذمم الموظفين (رواتب)', code: '211', type: 'liability', parentId: '21', level: 3 },
    { id: '212', name: 'الموردين والدائنون', code: '212', type: 'liability', parentId: '21', level: 3 },
    { id: '4', name: 'الإيرادات', code: '4', type: 'income', level: 1 },
    { id: '5', name: 'المصروفات', code: '5', type: 'expense', level: 1 },
    { id: '52', name: 'مصاريف تشغيلية', code: '52', type: 'expense', parentId: '5', level: 2 },
    { id: '5201', name: 'الرواتب والأجور', code: '5201', type: 'expense', parentId: '52', level: 3 },
  ]);

  const [initialFunds, setInitialFunds] = useState<FinancialFund[]>([
    { id: 'f1', name: 'الخزينة المركزية', type: 'cash', balance: 15400, accountCode: '11101' },
    { id: 'f2', name: 'حساب البنك الراجحي', type: 'bank', balance: 92000, accountCode: '11102' }
  ]);

  const [financialEntries, setFinancialEntries] = useState<FinancialEntry[]>([]);

  // رصيد الصناديق الديناميكي
  const funds = useMemo(() => {
    return initialFunds.map(f => {
      const totalDebit = financialEntries.filter(e => e.debitAccount === f.accountCode).reduce((acc, e) => acc + e.amount, 0);
      const totalCredit = financialEntries.filter(e => e.creditAccount === f.accountCode).reduce((acc, e) => acc + e.amount, 0);
      return { ...f, balance: f.balance + totalDebit - totalCredit };
    });
  }, [initialFunds, financialEntries]);

  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [inventoryTransactions, setInventoryTransactions] = useState<InventoryTransaction[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  const t = (key: string) => translations[lang]?.[key] || key;

  const contextValue = useMemo(() => ({
    lang, user, originalAdmin, financialCategories: categoriesBase, financialEntries, inventoryItems,
    inventoryTransactions, inventoryCategories: ['كتب', 'زي', 'أدوات'], allUsers, notifications, payrollRecords: [],
    announcements, institutions, suppliers, funds,
    setLang, setUser, t,
    addNotification: (n: any) => setNotifications(prev => [{ ...n, id: Date.now().toString(), isRead: false }, ...prev]),
    addFinancialEntry: (e: any) => setFinancialEntries(prev => [e, ...prev]),
    updateFinancialEntry: (u: any) => setFinancialEntries(prev => prev.map(e => e.id === u.id ? u : e)),
    deleteFinancialEntry: (id: string) => setFinancialEntries(prev => prev.filter(e => e.id !== id)),
    addFinancialCategory: (c: any) => setCategoriesBase(prev => [...prev, c]),
    updateFinancialCategory: (u: any) => setCategoriesBase(prev => prev.map(c => c.id === u.id ? u : c)),
    deleteFinancialCategory: (id: string) => setCategoriesBase(prev => prev.filter(c => c.id !== id)),
    addInventoryItem: (item: InventoryItem) => {
      const code = `113${inventoryItems.length + 1}`.padEnd(5, '0');
      setInventoryItems(prev => [...prev, { ...item, accountCode: code }]);
      setCategoriesBase(prev => [...prev, { id: item.id, name: item.name, code, type: 'asset', parentId: '113', level: 4, isDynamic: true }]);
    },
    updateInventoryItem: (u: any) => setInventoryItems(prev => prev.map(i => i.id === u.id ? u : i)),
    deleteInventoryItem: (id: string) => setInventoryItems(prev => prev.filter(i => i.id !== id)),
    addInventoryTransaction: (t: any) => {
      setInventoryTransactions(prev => [t, ...prev]);
      setInventoryItems(prev => prev.map(i => i.id === t.itemId ? { ...i, quantity: t.type === 'in' ? i.quantity + t.quantity : i.quantity - t.quantity } : i));
    },
    addSupplier: (s: Supplier) => {
      const code = `212${suppliers.length + 1}`.padEnd(5, '0');
      const newSup = { ...s, code: `SUP-${suppliers.length + 1}` };
      setSuppliers(prev => [...prev, newSup]);
      setCategoriesBase(prev => [...prev, { id: newSup.id, name: newSup.name, code, type: 'liability', parentId: '212', level: 4, isDynamic: true }]);
    },
    addStudentWithAccount: (student: User, parentData: Partial<User>, createStudentUser: boolean, createParentUser: boolean) => {
      const studentId = student.id || `u-${Date.now()}`;
      const studentCode = `ST-${Date.now().toString().slice(-4)}`;
      const coaCode = `112${allUsers.filter(u => u.role === UserRole.STUDENT).length + 1}`.padEnd(5, '0');

      const newUsers = [...allUsers, {
        ...student,
        id: studentId,
        code: studentCode,
        username: createStudentUser ? student.username : undefined
      }];

      if (parentData.firstName) {
        const parentId = `p-${Date.now()}`;
        newUsers.push({
          id: parentId,
          code: `PAR-${studentCode.split('-')[1]}`,
          firstName: parentData.firstName,
          lastName: student.lastName,
          role: UserRole.PARENT,
          institutionId: student.institutionId,
          phone: parentData.phone,
          email: parentData.email,
          username: createParentUser ? parentData.username : undefined,
          aiQuestionsCount: 0,
          balance: 0
        });
      }

      setAllUsers(newUsers);
      setCategoriesBase(prev => [...prev, { id: studentId, name: `${student.firstName} ${student.lastName}`, code: coaCode, type: 'asset', parentId: '112', level: 4, isDynamic: true }]);
    },
    addEmployeeRecord: (emp: User, createLogin: boolean) => {
      const empWithCode = {
        ...emp,
        code: `EMP-${Date.now().toString().slice(-4)}`,
        username: createLogin ? emp.username : undefined
      };
      setAllUsers(prev => [...prev, empWithCode]);
      setCategoriesBase(prev => [...prev, { id: emp.id, name: `${emp.firstName} ${emp.lastName}`, code: `211${allUsers.length}`, type: 'liability', parentId: '211', level: 4, isDynamic: true }]);
    },
    addFinancialFund: (fund: FinancialFund) => {
      setInitialFunds(prev => [...prev, fund]);
      setCategoriesBase(prev => [...prev, { id: fund.id, name: fund.name, code: fund.accountCode, type: 'asset', parentId: '111', level: 4, isDynamic: true }]);
    },
    updateStudentSubscription: (id: string, amount: number, date: string) => {
      setAllUsers(prev => prev.map(u => u.id === id ? { ...u, subscriptionAmount: amount, nextRenewalDate: date } : u));
    },
    addInstitution: (i: any) => setInstitutions(prev => [...prev, i]),
    updateInstitution: (u: any) => setInstitutions(prev => prev.map(i => i.id === u.id ? u : i)),
    renewSubscription: (id: string, newExpiry: string, newAmount: number) => { },
    approveAnnouncement: (id: string) => setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, status: AnnouncementStatus.APPROVED } : a)),
    rejectAnnouncement: (id: string) => setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, status: AnnouncementStatus.REJECTED } : a)),
    addAnnouncement: (a: Announcement) => setAnnouncements(prev => [a, ...prev]),
    startSimulation: (targetUser: User) => {
      if (user?.role === UserRole.SUPER_ADMIN) setOriginalAdmin(user);
      setUser(targetUser);
    },
    endSimulation: () => {
      if (originalAdmin) {
        setUser(originalAdmin);
        setOriginalAdmin(null);
      }
    },
    useAiQuestion: () => {
      if (user && user.aiQuestionsCount > 0) {
        setUser({ ...user, aiQuestionsCount: user.aiQuestionsCount - 1 });
        return true;
      }
      return false;
    },
    systemLogo, systemName, setSystemName, setSystemLogo,
    systemContact, setSystemContact,
    focusMode, setFocusMode
  }), [lang, user, originalAdmin, categoriesBase, financialEntries, inventoryItems, inventoryTransactions, allUsers, notifications, announcements, institutions, initialFunds, suppliers, systemName, systemLogo, systemContact, focusMode]);


  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};
