# 📊 Advanced Accounting Core - Implementation Guide

## Overview

تم تنفيذ نظام محاسبة متقدم بنظام **القيد المزدوج (Double-Entry Bookkeeping)** يشمل:
- ✅ دليل الحسابات المعياري (Chart of Accounts - COA)
- ✅ القيود اليومية والتسويات (Journal Entries)
- ✅ ميزان المراجعة (Trial Balance)
- ✅ قائمة الدخل (Income Statement)
- ✅ الميزانية العمومية (Balance Sheet)

---

## 🗂️ Files Created

### 1. Type Definitions
**File:** `src/types/accounting.ts`

يحتوي على جميع التعريفات المطلوبة:
```typescript
- AccountType (ASSET, LIABILITY, EQUITY, REVENUE, EXPENSE)
- Account
- JournalLine
- JournalEntry
- TrialBalanceRow
- IncomeStatement
- BalanceSheet
```

### 2. Accounting Engine
**File:** `src/services/mockAccounting.ts`

محرك المحاسبة الذي يقدم:

#### الدوال الرئيسية:
```typescript
// إدارة دليل الحسابات
initializeAccounts(): Account[]
getAccounts(): Account[]
addAccount(account: Account)

// إدارة القيود
getJournalEntries(): JournalEntry[]
saveJournalEntry(entry: JournalEntry)
updateJournalEntry(id: string, updatedEntry: JournalEntry)
deleteJournalEntry(id: string)

// الحسابات والتقارير
getTrialBalance(): TrialBalanceRow[]
getIncomeStatement(fromDate?, toDate?): IncomeStatement
getBalanceSheet(asOfDate?): BalanceSheet
validateJournalEntry(entry: JournalEntry)
```

#### دليل الحسابات المعياري:
يتم التهيئة تلقائياً بـ 24 حساباً:

**الأصول (Assets - 1xx):**
- 101: صندوق النقدية
- 102: البنك
- 103: العملاء
- 104: الأصول الثابتة
- 105: المخزون

**الخصوم (Liabilities - 2xx):**
- 201: الموردون
- 202: ضريبة القيمة المضافة
- 203: القروض قصيرة الأجل
- 204: المصروفات المستحقة

**حقوق الملكية (Equity - 3xx):**
- 301: رأس المال
- 302: الأرباح المحتجزة
- 303: المسحوبات الشخصية

**الإيرادات (Revenue - 4xx):**
- 401: الرسوم الدراسية
- 402: رسوم الامتحانات
- 403: إيرادات متنوعة
- 404: إيرادات الكتب

**المصروفات (Expenses - 5xx):**
- 501: الرواتب
- 502: الإيجار
- 503: المرافق
- 504: الصيانة
- 505: القرطاسية
- 506: التنظيف
- 507: التسويق
- 508: مصروفات متنوعة

---

### 3. Journal Entries UI
**File:** `src/components/finance/JournalEntries.tsx`

واجهة إدخال القيود اليومية:

**المميزات:**
- ✅ إضافة قيود محاسبية جديدة
- ✅ إدارة سطور القيد (إضافة/حذف ديناميكي)
- ✅ اختيار الحسابات من القائمة المنسدلة
- ✅ إدخال المدين والدائن لكل سطر
- ✅ **تحقق تلقائي من التوازن** (Total Debit = Total Credit)
- ✅ مؤشر بصري للقيود المتوازنة وغير المتوازنة
- ✅ حفظ كمسودة أو ترحيل مباشر
- ✅ تعديل القيود غير المرحلة
- ✅ حذف القيود غير المرحلة
- ✅ واجهة عربية RTL احترافية

**مثال على الاستخدام:**
```tsx
<JournalEntries 
  institutionId="inst-1" 
  userName="أحمد المالكي" 
/>
```

---

### 4. Financial Reports UI
**File:** `src/components/finance/FinancialReports.tsx`

واجهة التقارير المالية مع 3 تبويبات:

#### أ) ميزان المراجعة (Trial Balance)
- عرض جميع الحسابات مع أرصدتها
- عمود المدين وعمود الدائن
- التحقق من التوازن (مجموع المدين = مجموع الدائن)
- ترميز لوني حسب نوع الحساب

#### ب) قائمة الدخل (Income Statement)
- قسم الإيرادات (Revenues)
- قسم المصروفات (Expenses)
- **صافي الربح/الخسارة** (Net Profit/Loss)
- فترة زمنية قابلة للتخصيص (من - إلى)
- عرض مرئي مميز للأرباح والخسائر

#### ج) الميزانية العمومية (Balance Sheet)
- **الأصول** (Assets) - الجانب الأيسر
- **الخصوم + حقوق الملكية** (Liabilities + Equity) - الجانب الأيمن
- الأرباح المحتجزة تلقائياً
- **معادلة الميزانية:** Assets = Liabilities + Equity
- تحقق تلقائي من التوازن

**مثال على الاستخدام:**
```tsx
<FinancialReports institutionId="inst-1" />
```

---

### 5. Updated Components

#### FinanceDashboard.tsx
تم تحديثه ليشمل:
```typescript
// التبويبات الجديدة
'transactions' | 'settings' | 'journal' | 'reports'

// الأزرار الجديدة
- 📒 القيود اليومية
- 📈 التقارير المالية
```

#### AccountantModule.tsx
تم تحديث الوضعين:
```typescript
case 'acc_journal': 
  return <JournalEntries ... />
  
case 'acc_reports': 
  return <FinancialReports ... />
```

---

## 🚀 Quick Start

### 1. عرض القيود اليومية
```typescript
// في FinanceDashboard
setView('journal')

// في AccountantModule
onNavigate('acc_journal')
```

### 2. عرض التقارير المالية
```typescript
// في FinanceDashboard
setView('reports')

// في AccountantModule
onNavigate('acc_reports')
```

### 3. إضافة قيد يدوي جديد
1. افتح صفحة القيود اليومية
2. اضغط "قيد جديد"
3. أدخل التاريخ والوصف
4. أضف سطور القيد (حساب + مدين أو دائن)
5. تأكد من التوازن (المدين = الدائن)
6. احفظ القيد

### 4. ترحيل القيود
- القيود المحفوظة تظهر بحالة "مسودة"
- اضغط على زر الترحيل ✓
- بعد الترحيل، يتم احتسابها في التقارير

---

## 📋 التحقق من صحة البيانات

### قواعد القيد المزدوج:
```typescript
✅ يجب أن يحتوي القيد على سطرين على الأقل
✅ مجموع المدين = مجموع الدائن (بدقة 0.01)
✅ كل سطر يجب أن يحتوي على حساب ومبلغ
✅ لا يمكن تعديل أو حذف القيود المرحلة
```

---

## 💾 Data Storage

جميع البيانات تُحفظ في `localStorage`:

```typescript
// Keys
'aleaqrab_coa_v1'      // Chart of Accounts
'aleaqrab_journal_v1'  // Journal Entries
```

### مثال البيانات:
```javascript
// Journal Entry
{
  id: "JE-1737593846123",
  date: "2026-01-23",
  description: "قيد افتتاحي - رأس المال",
  lines: [
    { accountId: "acc-101", debit: 50000, credit: 0 },
    { accountId: "acc-301", debit: 0, credit: 50000 }
  ],
  posted: true,
  voucherNumber: "V-1737593846123"
}
```

---

## 🎨 UI Features

### الميزات البصرية:
- 🎨 تصميم احترافي بنمط RTL عربي
- 🟢 مؤشرات لونية للتوازن (أخضر = متوازن، أحمر = غير متوازن)
- 📊 جداول تفاعلية مع hover effects
- 🔒 قفل القيود المرحلة (لا يمكن تعديلها)
- 🖨️ زر طباعة للتقارير
- 📅 فلاتر التاريخ للتقارير

---

## 🧪 Testing Workflow

### سيناريو اختبار كامل:

```typescript
// 1. قيد افتتاحي
من: رأس المال (301) - دائن 100,000
إلى: صندوق النقدية (101) - مدين 100,000

// 2. شراء أصل ثابت
من: أصول ثابتة (104) - مدين 20,000
إلى: صندوق النقدية (101) - دائن 20,000

// 3. تحصيل رسوم دراسية
من: صندوق النقدية (101) - مدين 5,000
إلى: الرسوم الدراسية (401) - دائن 5,000

// 4. دفع رواتب
من: الرواتب (501) - مدين 3,000
إلى: صندوق النقدية (101) - دائن 3,000

// التحقق من النتائج:
ميزان المراجعة: متوازن ✅
قائمة الدخل: ربح 2,000 (إيراد 5,000 - مصروف 3,000)
الميزانية: متوازنة ✅ (أصول = خصوم + حقوق ملكية)
```

---

## 🔧 Customization

### إضافة حسابات جديدة:
```typescript
import { addAccount } from './services/mockAccounting';

addAccount({
  id: 'acc-custom-1',
  code: '509',
  name: 'مصروفات النقل',
  type: 'EXPENSE',
  level: 1,
  isActive: true
});
```

### تخصيص التقارير:
```typescript
// قائمة دخل لشهر محدد
const statement = getIncomeStatement('2026-01-01', '2026-01-31');

// ميزانية كما في تاريخ محدد
const balance = getBalanceSheet('2026-01-23');
```

---

## ✅ Deliverables Checklist

- ✅ `src/types/accounting.ts` - جميع التعريفات
- ✅ `src/services/mockAccounting.ts` - محرك المحاسبة + COA المعياري
- ✅ `src/components/finance/JournalEntries.tsx` - واجهة القيود
- ✅ `src/components/finance/FinancialReports.tsx` - واجهة التقارير
- ✅ تحديث `FinanceDashboard.tsx` - إضافة التبويبات الجديدة
- ✅ تحديث `AccountantModule.tsx` - دمج المكونات الجديدة
- ✅ التحقق من التوازن التلقائي
- ✅ localStorage persistence
- ✅ UI/UX عربي كامل

---

## 🎯 Next Steps (Optional Enhancements)

1. **Multi-Currency Support** - دعم العملات المتعددة
2. **Cost Centers** - مراكز التكلفة
3. **Budget vs Actual** - مقارنة الموازنة بالفعلي
4. **Audit Trail** - سجل التدقيق
5. **PDF Export** - تصدير التقارير كـ PDF
6. **Excel Import/Export** - استيراد وتصدير Excel
7. **Account Reconciliation** - تسوية الحسابات
8. **Fiscal Year Management** - إدارة السنة المالية

---

**تم التنفيذ بنجاح! ✨**

للمزيد من المعلومات أو تقارير الأخطاء، يرجى التواصل مع فريق التطوير.
