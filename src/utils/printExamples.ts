/**
 * 🎨 أمثلة على استخدام نظام الطباعة الاحترافي
 * 
 * هذا الملف يحتوي على أمثلة عملية لكيفية استخدام النظام الجديد
 */

import { openProfessionalPrintWindow, PrintOptions } from './printUtils';

// ===========================
// مثال 1: طباعة فاتورة A4 عمودية
// ===========================
export const printInvoiceA4 = (invoiceHTML: string) => {
    openProfessionalPrintWindow(invoiceHTML, {
        title: 'فاتورة بيع',
        orientation: 'portrait',
        pageSize: 'A4',
        margin: '15mm',
        fontSize: 'medium',
        showLogo: true,
        watermark: 'أصل'
    });
};

// ===========================
// مثال 2: طباعة تقرير أفقي (Landscape)
// ===========================
export const printLandscapeReport = (reportHTML: string) => {
    openProfessionalPrintWindow(reportHTML, {
        title: 'تقرير الأداء الشهري',
        orientation: 'landscape',
        pageSize: 'A4',
        margin: '10mm',
        fontSize: 'small',
        showLogo: true,
        watermark: 'سري'
    });
};

// ===========================
// مثال 3: طباعة إيصال حراري (Receipt)
// ===========================
export const printThermalReceipt = (receiptHTML: string) => {
    openProfessionalPrintWindow(receiptHTML, {
        title: 'إيصال دفع',
        pageSize: 'receipt',
        margin: '5mm',
        fontSize: 'small',
        showLogo: false, // بدون شعار للإيصالات الحرارية
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
};

// ===========================
// مثال 4: طباعة شهادة بتصميم مخصص
// ===========================
export const printCertificate = (studentName: string, courseName: string) => {
    const certificateHTML = `
        <div style="text-align: center; padding: 40px; border: 10px double #0f172a; min-height: 70vh;">
            <h1 style="font-size: 3rem; font-weight: 900; color: #0f172a; margin: 40px 0;">
                شـهـادة تـقـديـر
            </h1>
            
            <div style="margin: 60px 0;">
                <p style="font-size: 1.5rem; margin-bottom: 20px;">نشهد بأن</p>
                <h2 style="font-size: 2.5rem; font-weight: 900; color: #3b82f6; margin: 20px 0;">
                    ${studentName}
                </h2>
                <p style="font-size: 1.5rem; margin: 20px 0;">قد أتم بنجاح دراسة</p>
                <h3 style="font-size: 2rem; font-weight: 700; color: #0f172a;">
                    ${courseName}
                </h3>
            </div>

            <div style="margin-top: 100px; display: flex; justify-content: space-around;">
                <div style="text-align: center;">
                    <div style="border-top: 2px solid #0f172a; width: 150px; margin: 50px auto 10px;"></div>
                    <p style="font-weight: 700;">مدير المركز</p>
                </div>
                <div style="text-align: center;">
                    <div style="border-top: 2px solid #0f172a; width: 150px; margin: 50px auto 10px;"></div>
                    <p style="font-weight: 700;">المدرس</p>
                </div>
            </div>
        </div>
    `;

    openProfessionalPrintWindow(certificateHTML, {
        title: 'شهادة إتمام الدورة',
        orientation: 'landscape',
        pageSize: 'A4',
        margin: '15mm',
        showLogo: false,
        headerContent: '', // بدون ترويسة للشهادة
        footerContent: `
            <div class="print-footer">
                تم الإصدار بتاريخ: ${new Date().toLocaleDateString('ar-EG')}
            </div>
        `
    });
};

// ===========================
// مثال 5: طباعة جدول درجات
// ===========================
export const printGradesTable = (students: any[]) => {
    const tableRows = students.map(student => `
        <tr>
            <td>${student.code}</td>
            <td style="text-align: right; font-weight: 700;">${student.name}</td>
            <td>${student.midterm}</td>
            <td>${student.final}</td>
            <td style="font-weight: 900; color: ${student.total >= 60 ? '#059669' : '#e11d48'};">
                ${student.total}
            </td>
        </tr>
    `).join('');

    const gradesHTML = `
        <h2 style="text-align: center; font-size: 1.5rem; font-weight: 900; margin-bottom: 30px;">
            كشف درجات الفصل الدراسي الأول
        </h2>

        <table>
            <thead>
                <tr>
                    <th style="width: 15%;">الكود</th>
                    <th style="width: 40%;">اسم الطالب</th>
                    <th style="width: 15%;">منتصف الفصل</th>
                    <th style="width: 15%;">النهائي</th>
                    <th style="width: 15%;">المجموع</th>
                </tr>
            </thead>
            <tbody>
                ${tableRows}
            </tbody>
        </table>

        <div class="signatures-container">
            <div class="signature-box">
                <div class="signature-line">المدرس</div>
            </div>
            <div class="signature-box">
                <div class="signature-line">رئيس القسم</div>
            </div>
            <div class="signature-box">
                <div class="signature-line">المدير</div>
            </div>
        </div>
    `;

    openProfessionalPrintWindow(gradesHTML, {
        title: 'كشف الدرجات',
        orientation: 'portrait',
        pageSize: 'A4',
        margin: '15mm',
        fontSize: 'medium'
    });
};

// ===========================
// مثال 6: طباعة قائمة حضور
// ===========================
export const printAttendanceSheet = (className: string, date: string, students: string[]) => {
    const attendanceRows = students.map((student, index) => `
        <tr>
            <td>${index + 1}</td>
            <td style="text-align: right; font-weight: 700;">${student}</td>
            <td style="background: #f8fafc;">☐ حاضر</td>
            <td style="background: #f8fafc;">☐ غائب</td>
            <td style="background: #f8fafc; width: 150px;"></td>
        </tr>
    `).join('');

    const attendanceHTML = `
        <div class="info-grid" style="margin-bottom: 30px;">
            <div class="info-card">
                <div class="info-card-title">الصف</div>
                <div class="info-card-value">${className}</div>
            </div>
            <div class="info-card">
                <div class="info-card-title">التاريخ</div>
                <div class="info-card-value">${date}</div>
            </div>
        </div>

        <table>
            <thead>
                <tr>
                    <th style="width: 10%;">#</th>
                    <th style="width: 40%;">اسم الطالب</th>
                    <th style="width: 15%;">الحضور</th>
                    <th style="width: 15%;">الغياب</th>
                    <th style="width: 20%;">ملاحظات</th>
                </tr>
            </thead>
            <tbody>
                ${attendanceRows}
            </tbody>
        </table>

        <div class="signatures-container">
            <div class="signature-box">
                <div class="signature-line">المدرس</div>
            </div>
        </div>
    `;

    openProfessionalPrintWindow(attendanceHTML, {
        title: 'سجل الحضور والغياب',
        orientation: 'portrait',
        pageSize: 'A4',
        margin: '15mm',
        fontSize: 'medium'
    });
};

// ===========================
// مثال 7: طباعة مع تصميم مخصص بالكامل
// ===========================
export const printCustomDesign = () => {
    const customHTML = `
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                    color: white; padding: 40px; border-radius: 20px; text-align: center;">
            <h1 style="font-size: 3rem; font-weight: 900; margin-bottom: 20px;">
                🎉 تهانينا!
            </h1>
            <p style="font-size: 1.5rem; line-height: 2;">
                لقد حققت إنجازاً رائعاً
            </p>
        </div>
    `;

    openProfessionalPrintWindow(customHTML, {
        title: 'مستند خاص',
        orientation: 'portrait',
        pageSize: 'A4',
        margin: '20mm',
        showLogo: false,
        customStyles: `
            .print-container {
                background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            }
        `
    });
};

// ===========================
// مثال 8: طباعة تقرير مالي شامل
// ===========================
export const printFinancialReport = (reportData: any) => {
    const reportHTML = `
        <div class="amount-box">
            <div class="amount-box-label">إجمالي الإيرادات</div>
            <div class="amount-box-value">${reportData.totalRevenue.toLocaleString()} ج.م</div>
        </div>

        <div class="info-grid">
            <div class="info-card">
                <div class="info-card-title">المصروفات</div>
                <div class="info-card-value">${reportData.totalExpenses.toLocaleString()} ج.م</div>
            </div>
            <div class="info-card" style="background: #f0fdf4; border-color: #86efac;">
                <div class="info-card-title" style="color: #166534;">صافي الربح</div>
                <div class="info-card-value" style="color: #166534;">
                    ${(reportData.totalRevenue - reportData.totalExpenses).toLocaleString()} ج.م
                </div>
            </div>
        </div>

        <h3 style="font-weight: 900; margin: 30px 0 15px;">تفاصيل الحركات المالية</h3>
        
        <table>
            <thead>
                <tr>
                    <th>التاريخ</th>
                    <th>البيان</th>
                    <th>مدين</th>
                    <th>دائن</th>
                </tr>
            </thead>
            <tbody>
                ${reportData.entries.map((entry: any) => `
                    <tr>
                        <td>${entry.date}</td>
                        <td style="text-align: right;">${entry.description}</td>
                        <td style="color: #059669;">${entry.debit || '-'}</td>
                        <td style="color: #e11d48;">${entry.credit || '-'}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;

    openProfessionalPrintWindow(reportHTML, {
        title: 'التقرير المالي الشهري',
        orientation: 'portrait',
        pageSize: 'A4',
        margin: '15mm',
        fontSize: 'medium',
        watermark: 'سري'
    });
};
