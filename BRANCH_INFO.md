# 🌟 Production Branch - منظومة العقرب (Al-Aqrab System)

## 📋 نظرة عامة (Overview)

هذا الفرع `production-with-6months-data` يحتوي على نظام منظومة العقرب كامل مع **بيانات تجريبية لمدة 9 أشهر** (من مايو 2025 إلى يناير 2026).

This branch `production-with-6months-data` contains the complete Al-Aqrab System with **9 months of mock data** (May 2025 - January 2026).

---

## 🚀 كيفية التشغيل (How to Run)

### 1️⃣ استنساخ الفرع (Clone the Branch)

```bash
git clone -b production-with-6months-data https://github.com/Ahmedtitooo1/alaqrab.git
cd alaqrab
```

### 2️⃣ تثبيت المكتبات (Install Dependencies)

```bash
npm install
```

### 3️⃣ تشغيل التطبيق (Run the Application)

```bash
npm run dev
```

التطبيق سيعمل على: `http://localhost:5173` أو `http://localhost:5174`

The application will run on: `http://localhost:5173` or `http://localhost:5174`

---

## 📊 البيانات المتوفرة (Available Data)

### المستخدمين (Users)
- **40 طالب** (40 Students) - مع دفعات شهرية متنوعة
- **5 معلمين** (5 Teachers) - مع رواتب شهرية
- **3 موظفين إداريين** (3 Staff Members):
  - مدير (Admin)
  - محاسب (Accountant)
  - سكرتير (Secretary)

### البيانات المالية (Financial Data)
- **رأس المال الافتتاحي**: 500,000 جنيه مصري
- **القيود المالية**: أكثر من 200 قيد يومية عبر 9 أشهر
- **المصروفات الشهرية**:
  - إيجار: 5,000 جنيه شهرياً
  - كهرباء ومياه: 800-1,300 جنيه شهرياً
  - رواتب: 25,000 جنيه شهرياً
- **الإيرادات**:
  - رسوم دراسية من الطلاب
  - مبيعات كتب ومذكرات

### المخزون (Inventory)
- كتب دراسية
- زي مدرسي
- أدوات مكتبية

### الأكاديمية (Academic)
- امتحانات تجريبية
- مستويات دراسية
- مواد دراسية

---

## 🔑 بيانات تسجيل الدخول (Login Credentials)

### المدير (Admin)
- **Username**: `sameh.admin`
- **Password**: `123456`

### المحاسب (Accountant)
- **Username**: `mona.accountant`
- **Password**: `123456`

### معلم (Teacher)
- **Username**: `ahmed.ali2000` (أو أي معلم آخر من المستخدمين)
- **Password**: `123456`

### طالب (Student)
- **Username**: `omar.khaled1005` (أو أي طالب من المستخدمين)
- **Password**: `123456`

---

## 📁 الملفات الرئيسية (Main Files)

- `src/services/mockDb.ts` - قاعدة البيانات التجريبية مع البيانات التاريخية
- `src/context/AppContext.tsx` - إدارة حالة التطبيق مع localStorage
- `components/` - جميع مكونات النظام
- `src/pages/` - صفحات النظام المختلفة

---

## ✨ المميزات (Features)

### 💰 النظام المالي
- شجرة حسابات كاملة
- قيود يومية
- تقارير مالية
- إدارة الخزائن والبنوك
- نظام الدفعات

### 👨‍🎓 إدارة الطلاب
- ملفات الطلاب
- الدفعات المالية
- التقارير الأكاديمية
- سجلات السلوك

### 👨‍🏫 إدارة المعلمين
- جداول الحصص
- الرواتب
- البث المباشر للحصص

### 📦 إدارة المخزون
- البضائع والمنتجات
- الموردين
- حركة المخزون

### 📊 التقارير والتحليلات
- تقارير مالية شاملة
- تحليلات الأداء
- مؤشرات الأداء

---

## 🌐 النشر (Deployment)

التطبيق جاهز للنشر على:
- **Vercel** - ملف `vercel.json` موجود
- **Netlify**
- أي خدمة استضافة أخرى تدعم تطبيقات React/Vite

---

## 📞 الدعم (Support)

للمساعدة أو الاستفسارات، يرجى التواصل عبر GitHub Issues.

For help or inquiries, please contact via GitHub Issues.

---

## 📝 ملاحظات (Notes)

1. **البيانات التجريبية**: جميع البيانات في هذا الفرع هي بيانات تجريبية للعرض والاختبار فقط
2. **localStorage**: النظام يستخدم localStorage لحفظ البيانات محلياً
3. **الأمان**: كلمات المرور التجريبية هي `123456` - يجب تغييرها في الإنتاج الفعلي
4. **التحديثات**: يمكن دمج هذا الفرع مع الفرع الرئيسي عند الحاجة

---

## 🎯 الاستخدام الموصى به (Recommended Usage)

هذا الفرع مثالي لـ:
- ✅ عروض النظام للعملاء المحتملين
- ✅ اختبار الميزات الكاملة
- ✅ تدريب المستخدمين الجدد
- ✅ الاختبار قبل النشر

---

**تم إنشاء هذا الفرع بتاريخ**: 23 يناير 2026  
**Created on**: January 23, 2026

**رابط الريبو (Repo Link)**: https://github.com/Ahmedtitooo1/alaqrab

**الفرع (Branch)**: `production-with-6months-data`
