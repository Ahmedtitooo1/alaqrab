# 🦂 منظومة العقرب التعليمية
# AleaQrab Educational SaaS Platform

[![Version](https://img.shields.io/badge/version-3.0.0-blue.svg)](https://github.com/aleaqrab/platform)
[![License](https://img.shields.io/badge/license-Proprietary-red.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-19.2.3-61DAFB.svg?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-3178C6.svg?logo=typescript)](https://www.typescriptlang.org/)
[![AI](https://img.shields.io/badge/AI-Google%20Gemini-orange.svg)](https://ai.google.dev/)

## 📋 نظرة عامة | Overview

**منظومة العقرب** هي منصة SaaS متكاملة لإدارة المؤسسات التعليمية مدعومة بتقنيات الذكاء الاصطناعي من Google Gemini. توفر المنظومة حلولاً شاملة للإدارة الأكاديمية، المالية، والتعليمية في مكان واحد.

### ✨ الميزات الرئيسية

- 🎓 **نظام تعليمي متكامل** - إدارة الفصول، الاختبارات، والمحتوى
- 💰 **نظام مالي محاسبي** - شجرة الحسابات، القيود، والتقارير المالية
- 🤖 **ذكاء اصطناعي متقدم** - توليد اختبارات، تصحيح ذكي، وتحليلات
- 👥 **نظام متعدد الأدوار** - 6 أدوار مختلفة بصلاحيات مخصصة
- 🌐 **دعم متعدد اللغات** - عربي/إنجليزي مع RTL
- 📱 **تصميم متجاوب** - يعمل على جميع الأجهزة
- 🎨 **واجهة عصرية** - Glassmorphism مع حركات سلسة

---

## 🚀 البدء السريع | Quick Start

### المتطلبات | Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **Git**

### التثبيت | Installation

```bash
# 1. استنساخ المشروع
git clone https://github.com/aleaqrab/platform.git
cd منظومة-العقرب-s.s.s-vs1

# 2. تثبيت الحزم
npm install

# 3. إعداد متغيرات البيئة
cp .env.example .env.local

# 4. تشغيل السيرفر
npm run dev
```

### الوصول | Access

افتح المتصفح على: `http://localhost:5173`

---

## 🔑 بيانات الدخول التجريبية | Demo Credentials

### Super Admin (مدير النظام)
- **Username:** `admin`
- **Password:** `admin123`

### Teacher (معلم)
- **Username:** `teacher`
- **Password:** `teacher123`

### Student (طالب)
- **Username:** `student`
- **Password:** `student123`

### Accountant (محاسب)
- **Username:** `accountant`
- **Password:** `acc123`

---

## 📁 هيكل المشروع | Project Structure

```
منظومة-العقرب-s.s.s-vs1/
├── 📁 components/          # مكونات React
│   ├── 📁 auth/           # نظام المصادقة
│   ├── 📁 views/          # واجهات الأدوار
│   ├── AccountantModule.tsx
│   ├── ExamsModule.tsx
│   ├── DashboardLayout.tsx
│   └── ...
├── 📁 context/            # Context API
│   ├── AppContext.tsx
│   ├── AuthContext.tsx
│   └── translations.ts
├── 📁 services/           # خدمات خارجية
│   └── geminiService.ts   # Google Gemini AI
├── 📁 src/                # صفحات إضافية
│   └── 📁 pages/
├── 📁 public/             # ملفات عامة
├── types.ts               # TypeScript Types
├── index.css              # تصميم عام
├── App.tsx                # المكون الرئيسي
└── package.json
```

---

## 🛠️ الأوامر المتاحة | Available Scripts

```bash
# تشغيل السيرفر التطويري
npm run dev

# بناء للإنتاج
npm run build

# معاينة البناء
npm run preview

# فحص الكود
npm run lint
```

---

## 🎨 نظام التصميم | Design System

### الألوان الأساسية | Primary Colors

```css
--color-primary: #2C3E80;      /* الأزرق الملكي */
--color-secondary: #FF6B35;     /* البرتقالي */
--color-text-main: #2D3748;     /* نص أسود/رمادي */
--color-bg-body: #f8fafc;       /* خلفية فاتحة */
```

### الخطوط | Fonts

- **العربية:** Cairo (400, 600, 700, 800, 900)
- **الثانوي:** Tajawal
- **الإنجليزية:** Segoe UI

---

## 🔧 التقنيات المستخدمة | Tech Stack

### Frontend
- **React** 19.2.3 - مكتبة UI
- **TypeScript** 5.8.2 - لغة البرمجة
- **Vite** 7.3.0 - أداة البناء
- **Tailwind CSS** 3.4.1 - إطار التصميم
- **Framer Motion** 11.0.5 - الحركات والانتقالات
- **Lucide React** - الأيقونات
- **React Router DOM** 6.22.0 - التنقل

### AI & Services
- **Google Gemini AI** 1.34.0 - الذكاء الاصطناعي
- **jsPDF** 2.5.1 - توليد PDF
- **date-fns** 3.3.1 - معالجة التواريخ

### State Management
- **Context API** - إدارة الحالة العامة
- **Zustand** 4.5.0 - إدارة الحالة المحلية
- **React Hooks** - إدارة الحالة المكونات

---

## 🤖 الذكاء الاصطناعي | AI Features

### ميزات مدعومة بـ Google Gemini:

1. **توليد الاختبارات التلقائي**
   - إدخال وصف نصي
   - توليد أسئلة متنوعة
   - تصدير JSON منظم

2. **المصحح الذكي (OCR)**
   - تحليل أوراق الإجابات المصورة
   - استخراج النصوص بدقة
   - تصحيح تلقائي

3. **المحلل الذكي**
   - تحليل الأداء لكل دور
   - توصيات مخصصة
   - اكتشاف الأنماط

4. **المساعد التعليمي**
   - إجابة الأسئلة
   - شرح المفاهيم
   - دعم الصور (Vision AI)

5. **التصنيف المحاسبي الذكي**
   - اقتراح الكود المحاسبي
   - تحليل المعاملات المالية

---

## 👥 الأدوار والصلاحيات | User Roles

| الدور | الصلاحيات | الواجهة |
|------|----------|---------|
| Super Admin | إدارة النظام الكاملة، المؤسسات، المحاكاة | SuperAdminView |
| Admin | إدارة الفرع، الاعتمادات، الكوادر | AdminView |
| Teacher | الاختبارات، المحتوى، البث المباشر | TeacherView |
| Student | الدراسة، الاختبارات، المكتبة | StudentView |
| Parent | متابعة الأبناء، الدفع الإلكتروني | ParentView |
| Accountant | النظام المالي الكامل، القيود | AccountantView |

---

## 📊 النظام المالي | Financial System

### المكونات الرئيسية:

1. **شجرة الحسابات**
   - هيكلة هرمية (4 مستويات)
   - أصول، خصوم، إيرادات، مصروفات

2. **القيود المحاسبية**
   - قيود مركبة (Multi-line)
   - موازنة تلقائية (Debit = Credit)
   - سندات القبض والصرف

3. **إدارة الصناديق**
   - صناديق نقدية وبنكية
   - تحويلات مالية
   - متابعة السيولة

4. **المخازن والجرد**
   - توريد وصرف
   - ربط محاسبي تلقائي
   - تقارير الجرد

---

## 🎓 النظام التعليمي | Educational System

### نظام الاختبارات:

**أنواع الأسئلة المدعومة:**
- ✅ اختيارات متعددة (Multiple Choice)
- ✅ صح/خطأ (True/False)
- ✅ مقالي قصير (Short Essay)
- ✅ اختيار على صورة (Image Choice)
- ✅ Hotspot على صورة

**ميزات متقدمة:**
- 🤖 توليد اختبارات بالـ AI
- 📸 مصحح ذكي بـ OCR
- 🛡️ منع الغش (Fullscreen + Monitoring)
- 📊 تحليل النتائج
- 🖨️ طباعة احترافية

---

## 🔐 الأمان | Security

### المنفذ حالياً:
- ✅ Context-based Authentication
- ✅ Role-based Access Control (RBAC)
- ✅ Input Validation
- ✅ XSS Protection (React)
- ✅ Anti-Cheating في الاختبارات

### المخطط:
- 🔄 JWT Tokens
- 🔄 OAuth 2.0
- 🔄 Two-Factor Authentication (2FA)
- 🔄 SSL/TLS
- 🔄 Rate Limiting
- 🔄 Audit Logs

---

## 📱 التجاوب | Responsive Design

النظام متجاوب بالكامل مع:
- 📱 **Mobile** (< 640px)
- 📱 **Tablet** (640px - 1024px)
- 💻 **Desktop** (> 1024px)
- 🖥️ **Large Screens** (> 1920px)

---

## 🌐 التوطين | Localization

### اللغات المدعومة:
- 🇸🇦 العربية (Arabic) - RTL
- 🇬🇧 الإنجليزية (English) - LTR

### ملفات الترجمة:
- `context/translations.ts`

---

## 🖨️ الطباعة | Print Support

النظام يدعم طباعة احترافية لـ:
- ✅ الاختبارات الورقية
- ✅ الإيصالات المالية
- ✅ كشوف الجرد
- ✅ التقارير الإدارية
- ✅ الشهادات

**CSS Optimized:**
- صفحة A4
- ألوان CMYK
- هوامش محددة
- Page breaks محسنة

---

## 📦 Deployment

### خطوات النشر على Production:

```bash
# 1. بناء المشروع
npm run build

# 2. النسخ إلى السيرفر
scp -r dist/ user@server:/var/www/aleaqrab

# 3. إعداد Nginx/Apache
# راجع ملف deployment.md
```

### البيئات المدعومة:
- ☁️ AWS (S3 + CloudFront)
- ☁️ Google Cloud Platform
- ☁️ Vercel
- ☁️ Netlify
- 🐳 Docker

---

## 🤝 المساهمة | Contributing

نرحب بالمساهمات! يرجى:
1. Fork المشروع
2. إنشاء Branch للميزة (`git checkout -b feature/AmazingFeature`)
3. Commit التغييرات (`git commit -m 'Add AmazingFeature'`)
4. Push للـ Branch (`git push origin feature/AmazingFeature`)
5. فتح Pull Request

---

## 📖 التوثيق الإضافي | Additional Documentation

- 📄 [دليل الميزات الشامل](./SYSTEM_FEATURES.md)
- 📄 [مراجعة النظام](./COMPREHENSIVE_AUDIT.md)
- 📄 [دليل الطباعة](./PRINT_GUIDE.md)
- 📄 [حالة النظام](./SYSTEM_STATUS.md)

---

## 🐛 الإبلاغ عن مشاكل | Bug Reports

إذا وجدت مشكلة:
1. تحقق من [Issues](https://github.com/aleaqrab/platform/issues)
2. إن لم تكن موجودة، أنشئ Issue جديد
3. قدم تفاصيل كافية:
   - خطوات إعادة المشكلة
   - السلوك المتوقع
   - Screenshots (إن أمكن)

---

## 📞 الدعم | Support

- 📧 **Email:** support@aleaqrab.com
- 💬 **Discord:** [انضم لنا](https://discord.gg/aleaqrab)
- 📱 **WhatsApp:** +966 XXX XXX XXX
- 🌐 **الموقع:** https://aleaqrab.com

---

## 📜 الترخيص | License

© 2024-2026 منظومة العقرب التعليمية. جميع الحقوق محفوظة.

هذا المشروع محمي بموجب ترخيص خاص. لا يُسمح باستخدامه أو نسخه أو توزيعه دون إذن صريح من الشركة.

---

## 🙏 شكر وتقدير | Acknowledgments

- **Google Gemini AI** - للذكاء الاصطناعي المتقدم
- **React Team** - للمكتبة الرائعة
- **Tailwind CSS** - لإطار التصميم المرن
- **مجتمع المطورين** - للدعم والمساهمات

---

## 🗺️ خارطة الطريق | Roadmap

### Q1 2026
- [x] إطلاق النسخة 3.0
- [ ] ربط قاعدة بيانات حقيقية
- [ ] Backend API
- [ ] Payment Gateway

### Q2 2026
- [ ] تطبيقات الجوال (iOS/Android)
- [ ] Progressive Web App
- [ ] Advanced Analytics
- [ ] Video Conferencing

### Q3 2026
- [ ] Blockchain Certificates
- [ ] Multi-language Expansion
- [ ] Marketplace للمحتوى

---

**مطور بـ ❤️ في المملكة العربية السعودية**

**آخر تحديث:** 18 يناير 2026 | **الإصدار:** v3.0.0
