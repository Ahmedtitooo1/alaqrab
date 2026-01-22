# 📄 نظام الطباعة الاحترافي - دليل الاستخدام الشامل

## نظرة عامة

نظام الطباعة الاحترافي هو حل متطور ومرن لفتح وطباعة المستندات في تطبيق **منظومة العقرب التعليمية**. يوفر النظام:

✅ **تصميم HTML احترافي ومرن**  
✅ **دعم كامل للغة العربية و RTL**  
✅ **خيارات متقدمة للتحكم في الطباعة**  
✅ **أحجام واتجاهات ورق متعددة**  
✅ **علامات مائية وتذييلات مخصصة**  
✅ **أزرار تحكم ومعاينة مدمجة**

---

## 📦 التركيب والاستخدام

### الاستيراد الأساسي

```typescript
import { openProfessionalPrintWindow, PrintOptions } from './src/utils/printUtils';
```

### الاستخدام البسيط

```typescript
const contentHTML = `
  <h1>مرحباً بك في نظام الطباعة</h1>
  <p>هذا مثال بسيط للطباعة</p>
`;

openProfessionalPrintWindow(contentHTML, {
  title: 'مستند اختبار',
  pageSize: 'A4',
  orientation: 'portrait'
});
```

---

## ⚙️ الخيارات المتاحة (PrintOptions)

### خيارات الصفحة والتصميم

| الخاصية | النوع | القيم المتاحة | القيمة الافتراضية | الوصف |
|---------|------|---------------|-------------------|-------|
| `title` | `string` | أي نص | `'طباعة المستند'` | عنوان المستند والنافذة |
| `pageSize` | `string` | `'A4'` \| `'A5'` \| `'Letter'` \| `'Legal'` \| `'receipt'` | `'A4'` | حجم الورقة |
| `orientation` | `string` | `'portrait'` \| `'landscape'` | `'portrait'` | اتجاه الورقة (عمودي/أفقي) |
| `margin` | `string` | أي قيمة CSS | `'10mm'` | الهوامش (مثل: `'15mm'`, `'1cm'`) |
| `fontSize` | `string` | `'small'` \| `'medium'` \| `'large'` | `'medium'` | حجم الخط العام |

### خيارات العلامة التجارية

| الخاصية | النوع | القيمة الافتراضية | الوصف |
|---------|------|-------------------|-------|
| `showLogo` | `boolean` | `true` | إظهار الشعار في الترويسة |
| `logo` | `string` | `'/logo.png'` | مسار ملف الشعار |
| `systemName` | `string` | `'منظومة العقرب التعليمية'` | اسم النظام في الترويسة |
| `watermark` | `string` | `undefined` | نص العلامة المائية (مثل: `'أصل'`, `'سري'`) |

### خيارات التخصيص المتقدم

| الخاصية | النوع | القيمة الافتراضية | الوصف |
|---------|------|-------------------|-------|
| `headerContent` | `string` | `''` | HTML مخصص للترويسة (يلغي الترويسة الافتراضية) |
| `footerContent` | `string` | `''` | HTML مخصص للتذييل |
| `customStyles` | `string` | `''` | CSS إضافي للتخصيص الكامل |

---

## 📚 أمثلة عملية متقدمة

### مثال 1: طباعة فاتورة A4 عمودية

```typescript
const invoiceHTML = `
  <div class="amount-box">
    <div class="amount-box-label">المبلغ الإجمالي</div>
    <div class="amount-box-value">5,250 ج.م</div>
  </div>

  <table>
    <thead>
      <tr>
        <th>المنتج</th>
        <th>الكمية</th>
        <th>السعر</th>
        <th>الإجمالي</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="text-align: right;">كتاب الرياضيات</td>
        <td>5</td>
        <td>150 ج.م</td>
        <td>750 ج.م</td>
      </tr>
    </tbody>
  </table>
`;

openProfessionalPrintWindow(invoiceHTML, {
  title: 'فاتورة بيع رقم 2025-001',
  pageSize: 'A4',
  orientation: 'portrait',
  margin: '15mm',
  watermark: 'أصل',
  showLogo: true
});
```

### مثال 2: تقرير أفقي (Landscape)

```typescript
const reportHTML = `
  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>اسم الطالب</th>
        <th>الصف</th>
        <th>الدرجة</th>
        <th>التصنيف</th>
        <th>ملاحظات</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>1</td>
        <td style="text-align: right;">أحمد محمد</td>
        <td>الصف الثالث</td>
        <td style="font-weight: 900; color: #059669;">95</td>
        <td>ممتاز</td>
        <td style="text-align: right;">متفوق</td>
      </tr>
    </tbody>
  </table>
`;

openProfessionalPrintWindow(reportHTML, {
  title: 'تقرير درجات الفصل الدراسي',
  pageSize: 'A4',
  orientation: 'landscape', // أفقي
  margin: '10mm',
  fontSize: 'small',
  watermark: 'سري'
});
```

### مثال 3: إيصال حراري (80mm)

```typescript
const receiptHTML = `
  <div style="text-align: center; margin-bottom: 20px;">
    <h2 style="font-size: 1.2rem; font-weight: 900;">إيصال دفع</h2>
  </div>

  <table>
    <tbody>
      <tr>
        <td style="text-align: right;">المبلغ المدفوع:</td>
        <td style="font-weight: 900;">500 ج.م</td>
      </tr>
      <tr>
        <td style="text-align: right;">طريقة الدفع:</td>
        <td>نقداً</td>
      </tr>
    </tbody>
  </table>
`;

openProfessionalPrintWindow(receiptHTML, {
  title: 'إيصال دفع',
  pageSize: 'receipt', // للطابعات الحرارية
  margin: '5mm',
  fontSize: 'small',
  showLogo: false, // لا حاجة للشعار في الإيصالات الصغيرة
  customStyles: `
    .print-container {
      max-width: 80mm;
      padding: 5mm;
    }
    table {
      font-size: 0.7rem;
    }
  `
});
```

### مثال 4: شهادة بتصميم مخصص

```typescript
const certificateHTML = `
  <div style="text-align: center; padding: 60px; border: 10px double #0f172a; min-height: 70vh;">
    <h1 style="font-size: 3.5rem; font-weight: 900; color: #0f172a; margin-bottom: 40px;">
      شـهـادة تـقـديـر
    </h1>
    
    <div style="margin: 80px 0;">
      <p style="font-size: 1.8rem; margin-bottom: 30px;">نشهد بأن</p>
      <h2 style="font-size: 3rem; font-weight: 900; color: #3b82f6; margin: 30px 0;">
        محمد أحمد علي
      </h2>
      <p style="font-size: 1.8rem; margin: 30px 0;">قد أتم بنجاح دراسة</p>
      <h3 style="font-size: 2.5rem; font-weight: 700; color: #0f172a;">
        دورة البرمجة المتقدمة
      </h3>
    </div>
  </div>
`;

openProfessionalPrintWindow(certificateHTML, {
  title: 'شهادة إتمام الدورة',
  pageSize: 'A4',
  orientation: 'landscape',
  margin: '15mm',
  showLogo: false,
  headerContent: '', // بدون ترويسة للشهادة
  customStyles: `
    body {
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    }
  `
});
```

---

## 🎨 العناصر الجاهزة (CSS Classes)

النظام يوفر مجموعة من العناصر الجاهزة للاستخدام:

### البطاقات المعلوماتية

```html
<div class="info-card">
  <div class="info-card-title">عنوان البطاقة</div>
  <div class="info-card-value">القيمة هنا</div>
</div>
```

### شبكة المعلومات

```html
<div class="info-grid">
  <div class="info-card">...</div>
  <div class="info-card">...</div>
  <div class="info-card">...</div>
</div>
```

### صندوق المبلغ المميز

```html
<div class="amount-box">
  <div class="amount-box-label">المبلغ الإجمالي</div>
  <div class="amount-box-value">5,000 ج.م</div>
</div>
```

### صناديق التوقيع

```html
<div class="signatures-container">
  <div class="signature-box">
    <div class="signature-line">المدير</div>
  </div>
  <div class="signature-box">
    <div class="signature-line">المحاسب</div>
  </div>
</div>
```

### الجداول الاحترافية

```html
<table>
  <thead>
    <tr>
      <th>العمود 1</th>
      <th>العمود 2</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>البيانات هنا</td>
      <td>البيانات هنا</td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <td colspan="2">الإجمالي</td>
    </tr>
  </tfoot>
</table>
```

---

## 🔧 التخصيص المتقدم

### إضافة CSS مخصص

```typescript
openProfessionalPrintWindow(contentHTML, {
  title: 'مستند مخصص',
  customStyles: `
    .custom-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px;
      border-radius: 15px;
      text-align: center;
    }
    
    .highlight {
      background: #fef3c7;
      padding: 5px 10px;
      border-radius: 5px;
    }
  `
});
```

### ترويسة مخصصة بالكامل

```typescript
const customHeaderHTML = `
  <div style="display: flex; justify-content: space-between; padding: 20px; border-bottom: 3px solid #0f172a;">
    <div>
      <img src="/custom-logo.png" style="height: 60px;">
    </div>
    <div style="text-align: center;">
      <h1 style="font-size: 2rem; font-weight: 900;">تقرير خاص</h1>
      <p>مؤسسة التعليم المتميز</p>
    </div>
    <div style="text-align: left;">
      <p>التاريخ: ${new Date().toLocaleDateString('ar-EG')}</p>
      <p>الرقم المرجعي: 2025-001</p>
    </div>
  </div>
`;

openProfessionalPrintWindow(contentHTML, {
  title: 'تقرير مخصص',
  headerContent: customHeaderHTML, // يلغي الترويسة الافتراضية
  pageSize: 'A4'
});
```

---

## 📏 أحجام الورق المدعومة

| الحجم | الأبعاد (عمودي) | الأبعاد (أفقي) | الاستخدام الشائع |
|-------|-----------------|----------------|------------------|
| **A4** | 210mm × 297mm | 297mm × 210mm | المستندات العامة |
| **A5** | 148mm × 210mm | 210mm × 148mm | الكتيبات الصغيرة |
| **Letter** | 8.5in × 11in | 11in × 8.5in | المعيار الأمريكي |
| **Legal** | 8.5in × 14in | 14in × 8.5in | العقود والوثائق القانونية |
| **receipt** | 80mm × auto | - | الإيصالات الحرارية |

---

## ✨ المميزات المتقدمة

### 1. العلامة المائية التلقائية

```typescript
openProfessionalPrintWindow(contentHTML, {
  title: 'مستند سري',
  watermark: 'سري - للاستخدام الداخلي فقط'
});
```

### 2. أزرار التحكم المدمجة

كل صفحة طباعة تحتوي تلقائياً على:
- 🖨️ **زر الطباعة**: لبدء عملية الطباعة
- ✖️ **زر الإغلاق**: لإغلاق نافذة المعاينة

### 3. دعم RTL كامل

النظام مصمم بشكل كامل لدعم اللغة العربية و RTL، مع:
- اتجاه النص من اليمين لليسار
- محاذاة العناصر بشكل صحيح
- خطوط عربية احترافية (Cairo)

### 4. الطباعة الودية (@media print)

جميع الأنماط محسّنة للطباعة الفعلية، مع:
- إخفاء العناصر غير الضرورية (أزرار التحكم)
- تحسين الألوان للطباعة
- دعم تقسيم الصفحات بشكل صحيح

---

## 🚀 نصائح للاستخدام الأمثل

### 1. استخدم العناصر الجاهزة

بدلاً من كتابة HTML و CSS من الصفر، استخدم العناصر الجاهزة:

```typescript
// ❌ غير مستحسن
const html = `<div style="padding: 20px; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px;">...</div>`;

// ✅ مستحسن
const html = `<div class="info-card">...</div>`;
```

### 2. اختر حجم الخط المناسب

- `'small'`: للتقارير المكتظة بالبيانات
- `'medium'`: للمستندات العادية (الافتراضي)
- `'large'`: للشهادات والوثائق الرسمية

### 3. استخدم العلامات المائية بحكمة

```typescript
// للمستندات الأصلية
watermark: 'أصل'

// للنسخ
watermark: 'نسخة'

// للمستندات السرية
watermark: 'سري'
```

### 4. تخصيص الهوامش حسب المحتوى

```typescript
// للمستندات المكتظة
margin: '5mm'

// للمستندات العادية
margin: '15mm'

// للمستندات الرسمية
margin: '20mm'
```

---

## 🐛 حل المشاكل الشائعة

### المشكلة: اللوجو لا يظهر

**الحل**: تأكد من صحة مسار الملف:

```typescript
openProfessionalPrintWindow(contentHTML, {
  title: 'اختبار',
  logo: '/logo.png', // تأكد من وجود الملف
  showLogo: true // تأكد من أن الخيار مفعّل
});
```

### المشكلة: النص يظهر خارج الصفحة

**الحل**: استخدم فواصل الصفحات:

```html
<div class="page-break"></div>
```

### المشكلة: الألوان لا تظهر في الطباعة

**الحل**: النظام يدعم ذلك تلقائياً عبر:

```css
-webkit-print-color-adjust: exact;
print-color-adjust: exact;
```

---

## 📞 الدعم والمساعدة

للمزيد من الأمثلة، راجع ملف:
```
src/utils/printExamples.ts
```

للتخصيص المتقدم، راجع ملف:
```
src/utils/printUtils.ts
```

---

**تم التطوير بواسطة**: فريق منظومة العقرب التعليمية  
**الإصدار**: 2.0  
**التاريخ**: يناير 2026
