
import * as React from 'react';
import { createContext, useContext, useState, ReactNode, useMemo, useEffect } from 'react';
import {
  User, UserRole, FinancialCategory, FinancialEntry,
  InventoryItem, InventoryTransaction, Notification, PayrollRecord,
  Announcement, Institution, Supplier, AnnouncementStatus, AnnouncementType,
  QuestionType, ClientType, PricingModel, FinancialFund,
  LearningPath, MarketplaceItem, ProctoringLog, CustomFieldDefinition, GradingFormula, BehaviorRecord, CertificateTemplate, InternalTicket, FamilyWallet, AdjustmentRequest,
  Subject, GradeLevel, FinancialSettings
} from '../types';
import { mockDb } from '../src/services/mockDb';

interface AppContextType {
  lang: 'ar' | 'en';
  isRtl: boolean;
  theme: 'light' | 'dark';
  user: User | null;
  currentTenant: Institution | null;
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
  learningPaths: LearningPath[];
  marketplaceItems: MarketplaceItem[];
  proctoringLogs: ProctoringLog[];

  // New States
  customFields: CustomFieldDefinition[];
  gradingFormulas: GradingFormula[];
  behaviorRecords: BehaviorRecord[];
  certificateTemplates: CertificateTemplate[];
  internalTickets: InternalTicket[];
  familyWallets: FamilyWallet[];
  adjustmentRequests: AdjustmentRequest[];
  paymentRequests: any[];
  subjects: Subject[];
  subjects: Subject[];
  gradeLevels: GradeLevel[];
  financialSettings: FinancialSettings;

  saveFinancialSettings: (settings: FinancialSettings) => void;
  postFinancialEntries: () => void;

  addSubject: (s: Subject) => void;
  updateSubject: (s: Subject) => void;
  deleteSubject: (id: string) => void;

  // New Actions
  addCustomField: (field: CustomFieldDefinition) => void;
  addGradingFormula: (formula: GradingFormula) => void;
  addBehaviorRecord: (record: BehaviorRecord) => void;
  addCertificateTemplate: (template: CertificateTemplate) => void;
  addInternalTicket: (ticket: InternalTicket) => void;
  updateInternalTicket: (ticket: InternalTicket) => void;
  addAdjustmentRequest: (req: AdjustmentRequest) => void;
  processAdjustmentRequest: (id: string, status: 'approved' | 'rejected', adminId: string) => void;
  addPaymentRequest: (req: any) => void;
  updatePaymentStatus: (id: string, status: 'approved' | 'rejected', adminId: string) => void;

  setLang: (l: 'ar' | 'en') => void;
  setUser: (u: User | null) => void;
  setCurrentTenant: (t: Institution | null) => void;
  t: (key: string) => string;
  addNotification: (n: Omit<Notification, 'id' | 'isRead' | 'institutionId'>) => void;
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
  addMarketplaceItem: (item: MarketplaceItem) => void;
  purchaseMarketplaceItem: (itemId: string) => void;
  systemLogo: string;
  systemName: string;
  setSystemName: (name: string) => void;
  setSystemLogo: (logo: string) => void;
  updateUser: (u: User) => void;
  updateFinancialFund: (fund: FinancialFund) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within an AppProvider');
  return context;
};

import translations from '../src/locales/translations';

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<'ar' | 'en'>(() => {
    const saved = localStorage.getItem('aleaqrab_lang');
    return (saved === 'en' ? 'en' : 'ar') as 'ar' | 'en';
  });

  const setLang = (l: 'ar' | 'en') => {
    setLangState(l);
    localStorage.setItem('aleaqrab_lang', l);
    document.documentElement.dir = l === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = l;
  };

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  const t = (key: string) => translations[lang]?.[key] || key;

  // Persistence Helper
  const loadState = <T,>(key: string, defaultValue: T): T => {
    try {
      const saved = localStorage.getItem(`aleaqrab_${key}`);
      return saved ? JSON.parse(saved) : defaultValue;
    } catch { return defaultValue; }
  };

  const [user, setUser] = useState<User | null>(() => loadState('currentUser', null));
  const [currentTenant, setCurrentTenant] = useState<Institution | null>(() => loadState('currentTenant', null));
  const [originalAdmin, setOriginalAdmin] = useState<User | null>(null);
  const [systemName, setSystemName] = useState(() => loadState('systemName', "منظومة العقرب التعليمية"));
  const [systemLogo, setSystemLogo] = useState(() => loadState('systemLogo', "/logo.png"));
  const [theme, setTheme] = useState<'light' | 'dark'>(() => loadState('theme', 'light'));

  const [allUsers, setAllUsers] = useState<User[]>(() => loadState('users', mockDb.users));
  const [categoriesBase, setCategoriesBase] = useState<FinancialCategory[]>(() => loadState('categories', mockDb.categories));
  const [initialFunds, setInitialFunds] = useState<FinancialFund[]>(() => loadState('funds', mockDb.funds));
  const [financialEntries, setFinancialEntries] = useState<FinancialEntry[]>(() => loadState('entries', mockDb.financialEntries));

  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>(() => loadState('inventory', mockDb.inventoryItems));
  const [inventoryTransactions, setInventoryTransactions] = useState<InventoryTransaction[]>(() => loadState('transactions', mockDb.inventoryTransactions));
  const [suppliers, setSuppliers] = useState<Supplier[]>(() => loadState('suppliers', mockDb.suppliers));
  const [notifications, setNotifications] = useState<Notification[]>(() => loadState('notifications', []));
  const [institutions, setInstitutions] = useState<Institution[]>(() => loadState('institutions', mockDb.tenants));
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => loadState('announcements', mockDb.announcements));

  const [learningPaths, setLearningPaths] = useState<LearningPath[]>(() => loadState('learningPaths', []));
  const [marketplaceItems, setMarketplaceItems] = useState<MarketplaceItem[]>(() => loadState('marketplace', []));
  const [proctoringLogs, setProctoringLogs] = useState<ProctoringLog[]>(() => loadState('proctoring', []));

  const [customFields, setCustomFields] = useState<CustomFieldDefinition[]>(() => loadState('customFields', []));
  const [gradingFormulas, setGradingFormulas] = useState<GradingFormula[]>(() => loadState('gradingFormulas', []));
  const [behaviorRecords, setBehaviorRecords] = useState<BehaviorRecord[]>(() => loadState('behaviorRecords', mockDb.behaviorRecords));
  const [certificateTemplates, setCertificateTemplates] = useState<CertificateTemplate[]>(() => loadState('certificates', []));
  const [internalTickets, setInternalTickets] = useState<InternalTicket[]>(() => loadState('tickets', mockDb.tickets));
  const [familyWallets, setFamilyWallets] = useState<FamilyWallet[]>(() => loadState('familyWallets', mockDb.familyWallets));
  const [adjustmentRequests, setAdjustmentRequests] = useState<AdjustmentRequest[]>([]);
  const [paymentRequests, setPaymentRequests] = useState<any[]>(() => loadState('paymentRequests', []));
  const [subjects, setSubjects] = useState<Subject[]>(() => loadState('subjects', mockDb.subjects || []));
  const [gradeLevels, setGradeLevels] = useState<GradeLevel[]>(() => loadState('gradeLevels', mockDb.gradeLevels || []));
  const [financialSettings, setFinancialSettings] = useState<FinancialSettings>(() => loadState('financialSettings', {
    companyName: 'My Institution',
    taxId: 'TRN-00000',
    taxRate: 15,
    isTaxInclusive: true,
    currency: 'EGP',
    institutionId: 'tenant-a'
  }));

  // رصيد الصناديق الديناميكي
  const funds = useMemo(() => {
    return initialFunds.map(f => {
      const institutionEntries = financialEntries.filter(e => e.institutionId === f.institutionId);
      const totalDebit = institutionEntries.filter(e => e.debitAccount === f.accountCode).reduce((acc, e) => acc + e.amount, 0);
      const totalCredit = institutionEntries.filter(e => e.creditAccount === f.accountCode).reduce((acc, e) => acc + e.amount, 0);
      return { ...f, balance: (f.balance || 0) + totalDebit - totalCredit };
    });
  }, [initialFunds, financialEntries]);

  // Persist State Changes
  useEffect(() => {
    const save = (key: string, data: any) => localStorage.setItem(`aleaqrab_${key}`, JSON.stringify(data));
    save('currentUser', user);
    save('currentTenant', currentTenant);
    save('systemName', systemName);
    save('systemLogo', systemLogo);
    save('theme', theme);
    save('users', allUsers);
    save('categories', categoriesBase);
    save('funds', initialFunds);
    save('entries', financialEntries);
    save('inventory', inventoryItems);
    save('transactions', inventoryTransactions);
    save('suppliers', suppliers);
    save('notifications', notifications);
    save('institutions', institutions);
    save('announcements', announcements);
    save('learningPaths', learningPaths);
    save('marketplace', marketplaceItems);
    save('proctoring', proctoringLogs);
    save('customFields', customFields);
    save('gradingFormulas', gradingFormulas);
    save('behaviorRecords', behaviorRecords);
    save('certificates', certificateTemplates);
    save('tickets', internalTickets);
    save('familyWallets', familyWallets);
    save('paymentRequests', paymentRequests);
    save('subjects', subjects);
    save('gradeLevels', gradeLevels);
    save('financialSettings', financialSettings);
  }, [user, currentTenant, systemName, systemLogo, theme, allUsers, categoriesBase, initialFunds, financialEntries, inventoryItems, inventoryTransactions, suppliers, notifications, institutions, announcements, learningPaths, marketplaceItems, proctoringLogs, customFields, gradingFormulas, behaviorRecords, certificateTemplates, internalTickets, familyWallets, paymentRequests, subjects, gradeLevels, financialSettings]);

  // الربط التلقائي للمستخدمين والموردين بشجرة الحسابات (FIXED for Multi-Tenant)
  useEffect(() => {
    const newCategories: FinancialCategory[] = [];

    // 1. Link Students to 'Customers' (Code 112)
    allUsers.filter(u => u.role === UserRole.STUDENT).forEach((s) => {
      if (!categoriesBase.some(c => c.id === s.id)) {
        // Find the 'Customers' parent category specifically for this tenant
        const parentCat = categoriesBase.find(c => c.code === '112' && c.institutionId === s.institutionId);
        // Only create account if parent category exists (CoA is initialized)
        if (parentCat) {
          const existingStudentAccounts = categoriesBase.filter(c => c.parentId === parentCat.id).length;
          const codeSuffix = (existingStudentAccounts + 1).toString().padStart(3, '0'); // 001, 002...

          newCategories.push({
            id: s.id,
            name: `${s.firstName} ${s.lastName}`,
            code: `112${codeSuffix}`,
            type: 'asset',
            parentId: parentCat.id,
            level: 4,
            isDynamic: true,
            institutionId: s.institutionId
          });
        }
      }
    });

    // 2. Link Suppliers to 'Suppliers' (Code 212)
    suppliers.forEach((s) => {
      if (!categoriesBase.some(c => c.id === s.id)) {
        const parentCat = categoriesBase.find(c => c.code === '212' && c.institutionId === s.institutionId);
        if (parentCat) {
          const existingSupplierAccounts = categoriesBase.filter(c => c.parentId === parentCat.id).length;
          const codeSuffix = (existingSupplierAccounts + 1).toString().padStart(3, '0');

          newCategories.push({
            id: s.id,
            name: s.name,
            code: `212${codeSuffix}`,
            type: 'liability',
            parentId: parentCat.id,
            level: 4,
            isDynamic: true,
            institutionId: s.institutionId
          });
        }
      }
    });

    if (newCategories.length > 0) setCategoriesBase(prev => [...prev, ...newCategories]);
  }, [allUsers, suppliers, categoriesBase]);

  const contextValue = useMemo(() => {
    const instId = user?.institutionId || currentTenant?.id;
    const isTeacher = user?.role === UserRole.TEACHER;

    const filteredUsers = instId ? allUsers.filter(u => u.institutionId === instId) : [];
    const tenantUsers = isTeacher ? filteredUsers.filter(u => u.role !== UserRole.STUDENT || u.teacherId === user?.id) : filteredUsers;

    const tenantFinancialEntries = instId ? financialEntries.filter(e => e.institutionId === instId) : [];
    const tenantCategories = categoriesBase.filter(c => (instId && c.institutionId === instId) || !c.institutionId);
    const tenantFunds = instId ? funds.filter(f => f.institutionId === instId) : [];
    const tenantInventoryItems = instId ? inventoryItems.filter(i => i.institutionId === instId) : [];
    const tenantSuppliers = instId ? suppliers.filter(s => s.institutionId === instId) : [];
    const tenantAnnouncements = instId ? announcements.filter(a => a.institutionId === instId) : [];
    const tenantNotifications = (instId && user) ? notifications.filter(n => n.institutionId === instId && (!n.userId || n.userId === user?.id)) : [];
    const tenantTickets = instId ? internalTickets.filter(t => t.institutionId === instId) : [];
    const tenantBehavior = instId ? behaviorRecords.filter(b => b.institutionId === instId && (!isTeacher || b.reportedBy === `${user?.firstName} ${user?.lastName}`)) : [];
    const tenantInventTransactions = instId ? inventoryTransactions.filter(t => t.institutionId === instId) : [];
    const tenantExams = instId ? mockDb.exams.filter(e => e.institutionId === instId) : [];
    const tenantLearningPaths = learningPaths.filter(l => (l as any).institutionId === instId);
    const tenantMarketplace = marketplaceItems.filter(m => (m as any).institutionId === instId);
    const tenantProctoring = proctoringLogs.filter(p => (p as any).institutionId === instId);
    const tenantPaymentRequests = paymentRequests.filter(p => p.institutionId === instId);

    return {
      lang, user, originalAdmin,
      financialCategories: tenantCategories,
      financialEntries: tenantFinancialEntries,
      inventoryItems: tenantInventoryItems,
      inventoryTransactions: tenantInventTransactions,
      inventoryCategories: ['كتب', 'زي', 'أدوات'],
      allUsers: tenantUsers,
      notifications: tenantNotifications,
      payrollRecords: [],
      announcements: tenantAnnouncements,
      institutions,
      suppliers: tenantSuppliers,
      funds: tenantFunds,
      exams: tenantExams,
      learningPaths: tenantLearningPaths,
      marketplaceItems: tenantMarketplace,
      proctoringLogs: tenantProctoring,
      paymentRequests: tenantPaymentRequests,
      subjects: subjects.filter(s => (s as any).institutionId === instId),
      subjects: subjects.filter(s => (s as any).institutionId === instId),
      gradeLevels: gradeLevels.filter(g => g.institutionId === instId),
      financialSettings: { ...financialSettings, institutionId: instId },

      saveFinancialSettings: (s) => setFinancialSettings({ ...s, institutionId: instId }),
      postFinancialEntries: () => {
        setFinancialEntries(prev => prev.map(e => (e.institutionId === instId && (!e.status || e.status === 'draft')) ? { ...e, status: 'posted' } : e));
        addNotification({ title: 'Shift Closed', content: 'All draft entries have been posted successfully.', type: 'success' });
      },

      addSubject: (s) => setSubjects(prev => [...prev, { ...s, institutionId: instId } as any]),
      updateSubject: (u) => setSubjects(prev => prev.map(s => s.id === u.id ? { ...u, institutionId: instId } as any : s)),
      deleteSubject: (id) => setSubjects(prev => prev.filter(s => s.id !== id)),

      setLang, setUser, t,
      addNotification: (n: any) => {
        const playNotificationSound = () => {
          try {
            const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(880, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.1);
            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
            osc.start();
            osc.stop(ctx.currentTime + 0.1);
          } catch (e) { console.error("Audio play failed", e); }
        };
        playNotificationSound();
        setNotifications(prev => [{ ...n, id: Date.now().toString(), isRead: false, institutionId: instId }, ...prev]);
      },
      addFinancialEntry: (e: any) => setFinancialEntries(prev => [{ ...e, institutionId: instId }, ...prev]),
      updateFinancialEntry: (u: any) => setFinancialEntries(prev => prev.map(e => e.id === u.id ? { ...u, institutionId: instId } : e)),
      deleteFinancialEntry: (id: string) => setFinancialEntries(prev => prev.filter(e => e.id !== id)),
      addFinancialCategory: (c: any) => setCategoriesBase(prev => [...prev, { ...c, institutionId: instId }]),
      updateFinancialCategory: (u: any) => setCategoriesBase(prev => prev.map(c => c.id === u.id ? { ...u, institutionId: instId } : c)),
      deleteFinancialCategory: (id: string) => setCategoriesBase(prev => prev.filter(c => c.id !== id)),
      addInventoryItem: (item: InventoryItem) => {
        const code = `113${inventoryItems.length + 1}`.padEnd(5, '0');
        setInventoryItems(prev => [...prev, { ...item, accountCode: code, institutionId: instId }]);
        setCategoriesBase(prev => [...prev, { id: item.id, name: item.name, code, type: 'asset', parentId: '113', level: 4, isDynamic: true, institutionId: instId }]);
      },
      updateInventoryItem: (u: any) => setInventoryItems(prev => prev.map(i => i.id === u.id ? { ...u, institutionId: instId } : i)),
      deleteInventoryItem: (id: string) => setInventoryItems(prev => prev.filter(i => i.id !== id)),
      addInventoryTransaction: (tr: any) => {
        setInventoryTransactions(prev => [{ ...tr, institutionId: instId }, ...prev]);
        setInventoryItems(prev => prev.map(i => i.id === tr.itemId ? { ...i, quantity: tr.type === 'in' ? i.quantity + tr.quantity : i.quantity - tr.quantity } : i));
      },
      addSupplier: (s: Supplier) => {
        const code = `212${suppliers.length + 1}`.padEnd(5, '0');
        const newSup = { ...s, code: `SUP-${suppliers.length + 1}`, institutionId: instId };
        setSuppliers(prev => [...prev, newSup]);
        setCategoriesBase(prev => [...prev, { id: newSup.id, name: newSup.name, code, type: 'liability', parentId: '212', level: 4, isDynamic: true, institutionId: instId }]);
      },
      addStudentWithAccount: (student: User, parentData: Partial<User>, createStudentUser: boolean, createParentUser: boolean) => {
        const studentId = student.id || `u-${Date.now()}`;
        const studentCode = `ST-${Date.now().toString().slice(-4)}`;
        const coaCode = `112${allUsers.filter(u => u.role === UserRole.STUDENT).length + 1}`.padEnd(5, '0');

        const newUsers = [...allUsers, { ...student, id: studentId, code: studentCode, institutionId: instId, username: createStudentUser ? student.username : undefined }];
        if (parentData.firstName) {
          newUsers.push({
            id: `p-${Date.now()}`, code: `PAR-${studentCode.split('-')[1]}`, firstName: parentData.firstName, lastName: student.lastName,
            role: UserRole.PARENT, institutionId: instId, phone: parentData.phone, email: parentData.email,
            username: createParentUser ? parentData.username : undefined, aiQuestionsCount: 0, balance: 0
          });
        }
        setAllUsers(newUsers);
        setCategoriesBase(prev => [...prev, { id: studentId, name: `${student.firstName} ${student.lastName}`, code: coaCode, type: 'asset', parentId: '112', level: 4, isDynamic: true, institutionId: instId }]);
      },
      addEmployeeRecord: (emp: User, createLogin: boolean) => {
        setAllUsers(prev => [...prev, { ...emp, code: `EMP-${Date.now().toString().slice(-4)}`, institutionId: instId, username: createLogin ? emp.username : undefined }]);
        setCategoriesBase(prev => [...prev, { id: emp.id, name: `${emp.firstName} ${emp.lastName}`, code: `211${allUsers.length}`, type: 'liability', parentId: '211', level: 4, isDynamic: true, institutionId: instId }]);
      },
      addFinancialFund: (fund: FinancialFund) => {
        setInitialFunds(prev => [...prev, { ...fund, institutionId: instId }]);
        setCategoriesBase(prev => [...prev, { ...fund, id: fund.id, name: fund.name, code: fund.accountCode, type: 'asset', parentId: '111', level: 4, isDynamic: true, institutionId: instId }]);
      },
      updateFinancialFund: (fund: FinancialFund) => {
        setInitialFunds(prev => prev.map(f => f.id === fund.id ? { ...f, ...fund } : f));
      },
      updateStudentSubscription: (id, amount, date) => setAllUsers(prev => prev.map(u => u.id === id ? { ...u, subscriptionAmount: amount, nextRenewalDate: date } : u)),
      addInstitution: (i: any) => setInstitutions(prev => [...prev, i]),
      updateInstitution: (u: any) => setInstitutions(prev => prev.map(i => i.id === u.id ? u : i)),
      renewSubscription: (id: string, newExpiry: string, newAmount: number) => { },
      approveAnnouncement: (id: string) => setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, status: AnnouncementStatus.APPROVED } : a)),
      rejectAnnouncement: (id: string) => setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, status: AnnouncementStatus.REJECTED } : a)),
      addAnnouncement: (a: Announcement) => setAnnouncements(prev => [{ ...a, institutionId: instId }, ...prev]),
      startSimulation: (target: User) => { if (user?.role === UserRole.SUPER_ADMIN) setOriginalAdmin(user); setUser(target); },
      endSimulation: () => { if (originalAdmin) { setUser(originalAdmin); setOriginalAdmin(null); } },
      useAiQuestion: () => { if (user && user.aiQuestionsCount > 0) { setUser({ ...user, aiQuestionsCount: user.aiQuestionsCount - 1 }); return true; } return false; },
      systemLogo, systemName, setSystemName, setSystemLogo, theme, isRtl: lang === 'ar', currentTenant, setCurrentTenant,

      customFields: customFields.filter(f => f.institutionId === instId),
      gradingFormulas: gradingFormulas.filter(g => g.institutionId === instId),
      behaviorRecords: tenantBehavior,
      certificateTemplates: certificateTemplates.filter(c => c.institutionId === instId),
      internalTickets: tenantTickets,
      familyWallets: familyWallets.filter(w => w.institutionId === instId),
      adjustmentRequests: adjustmentRequests.filter(a => a.institutionId === instId),

      addCustomField: (field) => setCustomFields(prev => [...prev, { ...field, institutionId: instId }]),
      addGradingFormula: (formula) => setGradingFormulas(prev => [...prev, { ...formula, institutionId: instId }]),
      addBehaviorRecord: (record) => setBehaviorRecords(prev => [{ ...record, institutionId: instId }, ...prev]),
      addCertificateTemplate: (template) => setCertificateTemplates(prev => [...prev, { ...template, institutionId: instId }]),
      addInternalTicket: (ticket) => setInternalTickets(prev => [{ ...ticket, institutionId: instId }, ...prev]),
      updateInternalTicket: (u) => setInternalTickets(prev => prev.map(t => t.id === u.id ? { ...u, institutionId: instId } : t)),
      addAdjustmentRequest: (req) => {
        setAdjustmentRequests(prev => [{ ...req, institutionId: instId }, ...prev]);
        setNotifications(prev => [{ id: Date.now().toString(), title: "طلب تعديل مالي", content: `طلب جديد من ${req.requestedBy}`, date: new Date().toISOString(), isRead: false, type: 'warning', institutionId: instId }, ...prev]);
      },
      processAdjustmentRequest: (id, status, adminId) => setAdjustmentRequests(prev => prev.map(req => req.id === id ? { ...req, status, approvedBy: adminId } : req)),
      addPaymentRequest: (req) => {
        setPaymentRequests(prev => [{ ...req, id: `PAY-${Date.now()}`, status: 'pending', institutionId: instId }, ...prev]);
        setNotifications(prev => [{ id: Date.now().toString(), title: "طلب دفعة جديد", content: `طلب دفع من الطالب ${req.studentName} بقيمة ${req.amount}`, type: 'warning', date: new Date().toISOString(), isRead: false, institutionId: instId }, ...prev]);
      },
      updatePaymentStatus: (id, status, adminId) => {
        setPaymentRequests(prev => prev.map(req => {
          if (req.id === id) {
            if (status === 'approved') {
              // إنشاء قيد مالي تلقائي عند الموافقة
              const studentIdx = allUsers.filter(u => u.role === UserRole.STUDENT).findIndex(u => u.id === req.studentId);
              const studentCode = `112${(studentIdx + 1).toString().padStart(2, '0')}`;

              setFinancialEntries(prevEntries => [...prevEntries, {
                id: `VCH-AUTO-${Date.now()}`,
                date: new Date().toISOString().split('T')[0],
                description: `سداد اشتراك طالب (تحويل بنكي): ${req.studentName} - مرجع: ${req.refNo}`,
                amount: req.amount,
                debitAccount: '11102', // حساب البنك الافتراضي
                creditAccount: studentCode, // حساب الطالب
                institutionId: instId,
                targetId: req.studentId,
                refType: 'manual'
              }]);
            }
            return { ...req, status, reviewedBy: adminId, reviewedDate: new Date().toISOString() };
          }
          return req;
        }));
      },

      addMarketplaceItem: (item: MarketplaceItem) => { },
      purchaseMarketplaceItem: (itemId: string) => { },

      updateUser: (u: User) => {
        setAllUsers(prev => prev.map(user => user.id === u.id ? { ...user, ...u } : user));
      },
    };

  }, [lang, user, originalAdmin, categoriesBase, financialEntries, inventoryItems, inventoryTransactions, allUsers, notifications, announcements, institutions, initialFunds, suppliers, learningPaths, marketplaceItems, proctoringLogs, customFields, gradingFormulas, behaviorRecords, certificateTemplates, internalTickets, familyWallets, adjustmentRequests, currentTenant, funds, paymentRequests]);

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};
