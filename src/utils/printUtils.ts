
import { FinancialEntry, FinancialCategory, FinancialFund } from '../../types';

// ===========================
// 📄 نظام الطباعة الاحترافي
// ===========================

export interface PrintOptions {
    title: string;
    orientation?: 'portrait' | 'landscape';
    pageSize?: 'A4' | 'A5' | 'Letter' | 'Legal' | 'receipt';
    margin?: string;
    fontSize?: 'small' | 'medium' | 'large';
    showLogo?: boolean;
    logo?: string;
    systemName?: string;
    watermark?: string;
    headerContent?: string;
    footerContent?: string;
    customStyles?: string;
}

/**
 * فتح نافذة طباعة احترافية مع تصميم HTML مرن
 * @param contentHtml محتوى HTML للطباعة
 * @param options خيارات التخصيص
 */
export const openProfessionalPrintWindow = (
    contentHtml: string,
    options: PrintOptions
) => {
    const {
        title = 'طباعة المستند',
        orientation = 'portrait',
        pageSize = 'A4',
        margin = '10mm',
        fontSize = 'medium',
        showLogo = true,
        logo = '/logo.png',
        systemName = 'منظومة العقرب التعليمية',
        watermark,
        headerContent,
        footerContent,
        customStyles = ''
    } = options;

    // تحديد أبعاد الصفحة حسب النوع
    const pageSizes = {
        A4: orientation === 'portrait' ? '210mm 297mm' : '297mm 210mm',
        A5: orientation === 'portrait' ? '148mm 210mm' : '210mm 148mm',
        Letter: orientation === 'portrait' ? '8.5in 11in' : '11in 8.5in',
        Legal: orientation === 'portrait' ? '8.5in 14in' : '14in 8.5in',
        receipt: '80mm auto' // للفواتير الحرارية
    };

    // تحديد حجم الخط
    const fontSizes = {
        small: '12px',
        medium: '14px',
        large: '16px'
    };

    const printWindow = window.open('', '_blank');

    if (!printWindow) {
        alert('يُرجى السماح بالنوافذ المنبثقة لفتح صفحة الطباعة');
        return;
    }

    const htmlContent = `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${title}</title>
            <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap" rel="stylesheet">
            
            <style>
                /* ===== الإعدادات الأساسية ===== */
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }

                :root {
                    --primary-color: #0f172a;
                    --secondary-color: #3b82f6;
                    --text-color: #1e293b;
                    --border-color: #cbd5e1;
                    --bg-light: #f8fafc;
                    --font-size: ${fontSizes[fontSize]};
                }

                body {
                    font-family: 'Cairo', sans-serif;
                    background: white;
                    color: var(--text-color);
                    font-size: var(--font-size);
                    line-height: 1.6;
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                }

                /* ===== إعدادات الصفحة للطباعة ===== */
                @page {
                    size: ${pageSizes[pageSize]};
                    margin: ${margin};
                }

                /* ===== حاوية الطباعة الرئيسية ===== */
                .print-container {
                    width: 100%;
                    max-width: 100%;
                    margin: 0 auto;
                    padding: 20mm;
                    min-height: 100vh;
                    position: relative;
                    background: white;
                }

                /* ===== الترويسة الرسمية ===== */
                .official-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: start;
                    padding-bottom: 20px;
                    margin-bottom: 30px;
                    border-bottom: 3px double var(--border-color);
                    page-break-after: avoid;
                }

                .header-logo {
                    max-height: 80px;
                    max-width: 150px;
                    object-fit: contain;
                }

                .header-title {
                    text-align: center;
                    flex: 1;
                }

                .header-title h1 {
                    font-size: 1.8rem;
                    font-weight: 900;
                    color: var(--primary-color);
                    margin-bottom: 8px;
                    text-transform: uppercase;
                }

                .header-title h2 {
                    font-size: 1.3rem;
                    font-weight: 700;
                    color: var(--secondary-color);
                }

                .header-info {
                    text-align: left;
                    font-size: 0.85rem;
                    color: #64748b;
                }

                .header-info p {
                    margin-bottom: 4px;
                    font-weight: 600;
                }

                /* ===== العلامة المائية ===== */
                .watermark {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%) rotate(-45deg);
                    font-size: 6rem;
                    font-weight: 900;
                    color: rgba(0, 0, 0, 0.03);
                    z-index: 0;
                    pointer-events: none;
                    white-space: nowrap;
                    user-select: none;
                }

                /* ===== المحتوى الرئيسي ===== */
                .print-content {
                    position: relative;
                    z-index: 1;
                }

                /* ===== الجداول الاحترافية ===== */
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 20px 0;
                    page-break-inside: auto;
                    background: white;
                }

                thead {
                    background: var(--primary-color);
                    color: white;
                }

                tr {
                    page-break-inside: avoid;
                    page-break-after: auto;
                }

                th {
                    padding: 12px 10px;
                    text-align: center;
                    font-weight: 900;
                    font-size: 0.9rem;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                td {
                    padding: 10px;
                    text-align: center;
                    border-bottom: 1px solid var(--border-color);
                    font-size: 0.9rem;
                }

                tbody tr:nth-child(even) {
                    background-color: var(--bg-light);
                }

                tbody tr:hover {
                    background-color: #e0f2fe;
                }

                tfoot {
                    background: var(--primary-color);
                    color: white;
                    font-weight: 900;
                }

                tfoot td {
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    padding: 12px;
                }

                /* ===== البطاقات المعلوماتية ===== */
                .info-card {
                    background: var(--bg-light);
                    padding: 15px 20px;
                    border-radius: 8px;
                    border: 1px solid var(--border-color);
                    margin: 15px 0;
                    page-break-inside: avoid;
                }

                .info-card-title {
                    font-size: 0.75rem;
                    font-weight: 900;
                    color: #64748b;
                    text-transform: uppercase;
                    margin-bottom: 8px;
                    letter-spacing: 1px;
                }

                .info-card-value {
                    font-size: 1.2rem;
                    font-weight: 700;
                    color: var(--primary-color);
                }

                .info-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 15px;
                    margin: 20px 0;
                }

                /* ===== صندوق المبلغ المميز ===== */
                .amount-box {
                    background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
                    border: 3px solid var(--primary-color);
                    padding: 20px;
                    text-align: center;
                    margin: 25px 0;
                    border-radius: 12px;
                    page-break-inside: avoid;
                }

                .amount-box-label {
                    font-size: 0.9rem;
                    font-weight: 700;
                    color: #64748b;
                    margin-bottom: 10px;
                }

                .amount-box-value {
                    font-size: 2.5rem;
                    font-weight: 900;
                    color: var(--primary-color);
                    font-family: 'Cairo', monospace;
                }

                /* ===== صناديق التوقيع ===== */
                .signatures-container {
                    display: flex;
                    justify-content: space-around;
                    margin-top: 60px;
                    padding: 30px 20px 20px;
                    page-break-inside: avoid;
                }

                .signature-box {
                    text-align: center;
                    min-width: 150px;
                }

                .signature-line {
                    border-top: 2px solid var(--primary-color);
                    padding-top: 10px;
                    margin-top: 50px;
                    font-weight: 700;
                    font-size: 0.9rem;
                    color: var(--text-color);
                }

                /* ===== التذييل ===== */
                .print-footer {
                    position: fixed;
                    bottom: 10mm;
                    left: 0;
                    right: 0;
                    text-align: center;
                    font-size: 0.7rem;
                    color: #94a3b8;
                    font-family: monospace;
                    padding: 10px;
                    border-top: 1px solid var(--border-color);
                }

                /* ===== أدوات مساعدة ===== */
                .text-center { text-align: center; }
                .text-right { text-align: right; }
                .text-left { text-align: left; }
                .font-bold { font-weight: 700; }
                .font-black { font-weight: 900; }
                .mb-4 { margin-bottom: 16px; }
                .mt-4 { margin-top: 16px; }
                .p-4 { padding: 16px; }

                /* ===== علامة الطباعة والتحكم ===== */
                .print-controls {
                    position: fixed;
                    top: 20px;
                    left: 20px;
                    z-index: 9999;
                    display: flex;
                    gap: 10px;
                }

                .print-button {
                    background: var(--secondary-color);
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 8px;
                    font-weight: 700;
                    cursor: pointer;
                    font-family: 'Cairo', sans-serif;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    transition: all 0.3s ease;
                }

                .print-button:hover {
                    background: #2563eb;
                    transform: translateY(-2px);
                    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
                }

                .close-button {
                    background: #ef4444;
                }

                .close-button:hover {
                    background: #dc2626;
                }

                /* ===== إعدادات الطباعة ===== */
                @media print {
                    body {
                        margin: 0;
                        padding: 0;
                        background: white;
                    }

                    .print-container {
                        padding: 0;
                        min-height: 0;
                    }

                    .print-controls {
                        display: none !important;
                    }

                    .no-print {
                        display: none !important;
                    }

                    thead {
                        display: table-header-group;
                    }

                    tfoot {
                        display: table-footer-group;
                    }

                    .page-break {
                        page-break-before: always;
                    }

                    .print-footer {
                        position: fixed;
                        bottom: 0;
                    }
                }

                /* ===== أنماط مخصصة إضافية ===== */
                ${customStyles}
            </style>
        </head>
        <body>
            <!-- أزرار التحكم -->
            <div class="print-controls no-print">
                <button class="print-button" onclick="window.print()">
                    🖨️ طباعة
                </button>
                <button class="print-button close-button" onclick="window.close()">
                    ✖️ إغلاق
                </button>
            </div>

            <!-- العلامة المائية -->
            ${watermark ? `<div class="watermark">${watermark}</div>` : ''}

            <!-- الحاوية الرئيسية -->
            <div class="print-container">
                <!-- الترويسة الرسمية -->
                ${headerContent || (showLogo ? `
                <div class="official-header">
                    <div>
                        <img src="${logo}" class="header-logo" alt="Logo" onerror="this.style.display='none'">
                    </div>
                    <div class="header-title">
                        <h1>${systemName}</h1>
                        <h2>${title}</h2>
                    </div>
                    <div class="header-info">
                        <p>📅 التاريخ: <strong>${new Date().toLocaleDateString('ar-EG')}</strong></p>
                        <p>🕐 الوقت: <strong>${new Date().toLocaleTimeString('ar-EG')}</strong></p>
                    </div>
                </div>
                ` : '')}

                <!-- المحتوى الرئيسي -->
                <div class="print-content">
                    ${contentHtml}
                </div>

                <!-- التذييل -->
                ${footerContent || `
                <div class="print-footer">
                    تم الإنشاء بواسطة ${systemName} | ${new Date().toISOString().split('T')[0]} | جميع الحقوق محفوظة ©
                </div>
                `}
            </div>
        </body>
        </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
};

// ===========================
// 🔄 دالة للتوافق مع الكود القديم
// ===========================
export const openPrintWindow = (title: string, contentHtml: string) => {
    openProfessionalPrintWindow(contentHtml, {
        title,
        pageSize: 'A4',
        orientation: 'portrait'
    });
};

// ===========================
// 📋 قوالب HTML جاهزة للطباعة
// ===========================

export const generateVoucherHTML = (
    entry: FinancialEntry,
    categories: FinancialCategory[],
    systemName: string,
    logo?: string
) => {
    const debitName = categories.find(c => c.code === entry.debitAccount)?.name || entry.debitAccount;
    const creditName = categories.find(c => c.code === entry.creditAccount)?.name || entry.creditAccount;

    return `        
        <div class="amount-box">
            <div class="amount-box-label">المبلغ فقط وقدره</div>
            <div class="amount-box-value">${entry.amount.toLocaleString()} ج.م</div>
        </div>

        <div class="info-card">
            <div class="info-card-title">البيان / الوصف</div>
            <div class="info-card-value">${entry.description}</div>
        </div>

        <div class="info-grid">
            <div class="info-card">
                <div class="info-card-title">من حساب (المدين)</div>
                <div class="info-card-value">${debitName} <span style="font-size: 0.8em; color: #64748b;">(${entry.debitAccount})</span></div>
            </div>
            <div class="info-card">
                <div class="info-card-title">إلى حساب (الدائن)</div>
                <div class="info-card-value">${creditName} <span style="font-size: 0.8em; color: #64748b;">(${entry.creditAccount})</span></div>
            </div>
        </div>

        <div class="signatures-container">
            <div class="signature-box">
                <div class="signature-line">المعد</div>
            </div>
            <div class="signature-box">
                <div class="signature-line">المراجع</div>
            </div>
            <div class="signature-box">
                <div class="signature-line">المدير المالي</div>
            </div>
        </div>
    `;
};

export const generateZReportHTML = (
    box: FinancialFund,
    diff: number,
    actual: number,
    systemName: string,
    entries: FinancialEntry[]
) => {
    return `
        <div style="text-align: center; margin-bottom: 30px;">
            <h2 style="font-size: 2rem; font-weight: 900; color: #0f172a;">${box.name}</h2>
            <p style="font-family: monospace; font-size: 1.1rem; font-weight: bold; color: #64748b;">${box.accountCode}</p>
        </div>

        <div class="info-grid">
            <div class="info-card">
                <div class="info-card-title">الرصيد الافتتاحي</div>
                <div class="info-card-value">--</div>
            </div>
            <div class="info-card" style="background: #f0fdf4; border-color: #86efac;">
                <div class="info-card-title" style="color: #166534;">الجرد الفعلي</div>
                <div class="info-card-value" style="color: #166534;">${actual.toLocaleString()}</div>
            </div>
            <div class="info-card" style="background: #0f172a; border-color: #0f172a;">
                <div class="info-card-title" style="color: rgba(255,255,255,0.7);">الرصيد الدفتري</div>
                <div class="info-card-value" style="color: white;">${box.balance.toLocaleString()}</div>
            </div>
        </div>

        <h3 style="font-weight: 900; margin: 30px 0 15px; border-bottom: 2px solid #0f172a; padding-bottom: 8px; display: inline-block;">
            تفاصيل حركات اليوم
        </h3>

        <table>
            <thead>
                <tr>
                    <th style="width: 15%;">رقم السند</th>
                    <th style="width: 45%;">البيان</th>
                    <th style="width: 20%;">وارد (+)</th>
                    <th style="width: 20%;">صادر (-)</th>
                </tr>
            </thead>
            <tbody>
                ${entries.length === 0 ?
            '<tr><td colspan="4" style="text-align: center; padding: 24px; color: #94a3b8;">لا توجد حركات اليوم</td></tr>' :
            entries.map(e => `
                        <tr>
                            <td style="font-family: monospace; font-weight: bold;">${e.id}</td>
                            <td style="text-align: right;">${e.description}</td>
                            <td style="color: #059669; font-weight: bold;">${e.debitAccount === box.accountCode ? e.amount.toLocaleString() : '-'}</td>
                            <td style="color: #e11d48; font-weight: bold;">${e.creditAccount === box.accountCode ? e.amount.toLocaleString() : '-'}</td>
                        </tr>
                    `).join('')
        }
            </tbody>
        </table>

        <div class="signatures-container">
            <div class="signature-box">
                <div class="signature-line">أمين الصندوق</div>
            </div>
            <div class="signature-box">
                <div class="signature-line">المدير المالي</div>
            </div>
        </div>
    `;
};

export const generateTrialBalanceHTML = (
    categories: FinancialCategory[],
    startDate: string,
    endDate: string,
    getBal: (code: string) => { debit: number, credit: number },
    systemName: string
) => {
    let rows = '';
    let totalDebit = 0;
    let totalCredit = 0;

    categories.filter(c => c.type !== 'equity' || c.level < 3).forEach(c => {
        const bal = getBal(c.code);
        if (bal.debit === 0 && bal.credit === 0) return;
        totalDebit += bal.debit;
        totalCredit += bal.credit;
        rows += `
            <tr>
                <td style="font-family: monospace; font-weight: bold;">${c.code}</td>
                <td style="text-align: right; font-weight: bold;">${c.name}</td>
                <td style="color: #059669;">${bal.debit.toLocaleString()}</td>
                <td style="color: #e11d48;">${bal.credit.toLocaleString()}</td>
                <td style="font-weight: 900;">${(bal.debit - bal.credit).toLocaleString()}</td>
            </tr>
        `;
    });

    return `
        <div style="text-align: center; margin-bottom: 25px;">
            <p style="font-weight: bold;">عن الفترة من <span style="font-family: monospace;">${startDate}</span> إلى <span style="font-family: monospace;">${endDate}</span></p>
        </div>

        <table>
            <thead>
                <tr>
                    <th style="width: 15%;">الكود</th>
                    <th style="width: 40%;">الحساب</th>
                    <th style="width: 15%;">مدين</th>
                    <th style="width: 15%;">دائن</th>
                    <th style="width: 15%;">الصافي</th>
                </tr>
            </thead>
            <tbody>${rows}</tbody>
            <tfoot>
                <tr>
                    <td colspan="2" style="text-align: right; padding-right: 20px;">الإجماليات</td>
                    <td style="color: #6ee7b7;">${Math.floor(totalDebit).toLocaleString()}</td>
                    <td style="color: #fda4af;">${Math.floor(totalCredit).toLocaleString()}</td>
                    <td></td>
                </tr>
            </tfoot>
        </table>
    `;
};

export const generateStatementHTML = (
    studentName: string,
    studentCode: string,
    entries: FinancialEntry[],
    systemName: string
) => {
    let balance = 0;

    // Sort entries by date
    const sortedEntries = [...entries].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const rows = sortedEntries.map(e => {
        // Determine Debit/Credit based on context. 
        // Typically for a Student:
        // Debit (Charge, Due) = e.debitAccount is StudentReceivable (112) OR refType 'invoice'/'fee'
        // Credit (Payment) = e.creditAccount is StudentReceivable (112) (because they paid, so receivable decreases)
        // OR simply:
        // If refType == 'payment', it's a Credit for the student (reduces balance).
        // If refType == 'fee' or 'invoice', it's a Debit (increases balance).

        // However, to be generic based on Account Codes is better if possible.
        // Assuming Student Account (112xx) is the anchor.
        // If Debit Account starts with 112 -> Increase Balance (Charge).
        // If Credit Account starts with 112 -> Decrease Balance (Payment).

        let debit = 0;
        let credit = 0;

        // This logic assumes we receive entries relevant to the student.
        // We check if the student is on Debit side or Credit side.
        // But entries passed here might be just raw entries. 
        // Let's rely on the fact that if it's a Payment, the student PAID (Credit to Student Account, Debit to Fund).

        // Helper: Is this entry increasing debt or decreasing it?
        // Typically:
        // Fee Accrual: Dr Student (Asset/Receivable), Cr Revenue.
        // Payment: Dr Fund (Asset), Cr Student (Asset/Receivable).

        // So, if entry.debitAccount is Student, it's a Charge.
        // If entry.creditAccount is Student, it's a Payment.

        // BUT, we don't have the student's exact dynamic account code here easily always.
        // We will assume "refType" helps or fallback to account codes logic if targetId matches.

        // Logic:
        // If refType === 'payment' -> Credit (Paid).
        // Otherwise -> Debit (Charge).

        // Let's use a heuristic based on RefType mainly, as it's cleaner for this print view.
        const isPayment = e.refType === 'payment';

        if (isPayment) {
            credit = e.amount;
            balance -= e.amount;
        } else {
            debit = e.amount;
            balance += e.amount;
        }

        return `
            <tr>
                <td style="font-family: monospace; font-size: 0.8em;">${e.date}</td>
                <td style="text-align: right;">${e.description}</td>
                <td style="color: #64748b; font-family: monospace;">${debit > 0 ? debit.toLocaleString() : '-'}</td>
                <td style="color: #059669; font-family: monospace;">${credit > 0 ? credit.toLocaleString() : '-'}</td>
                <td style="font-weight: bold; font-family: monospace; color: ${balance >= 0 ? '#0f172a' : '#e11d48'}">${balance.toLocaleString()}</td>
            </tr>
        `;
    }).join('');

    return `
        <div style="background: #f8fafc; padding: 20px; border-radius: 12px; border: 1px solid #cbd5e1; margin-bottom: 30px;">
            <div style="display: flex; justify-content: space-between;">
                <div>
                    <p style="font-size: 0.8rem; color: #64748b; font-weight: bold;">اسم الطالب</p>
                    <h2 style="font-size: 1.4rem; font-weight: 900; color: #0f172a;">${studentName}</h2>
                </div>
                <div style="text-align: left;">
                    <p style="font-size: 0.8rem; color: #64748b; font-weight: bold;">كود الطالب</p>
                    <p style="font-size: 1.2rem; font-family: monospace; font-weight: bold;">${studentCode}</p>
                </div>
            </div>
            <div style="margin-top: 15px; padding-top: 15px; border-top: 1px dashed #cbd5e1; display: flex; justify-content: space-between;">
                 <div>
                    <p style="font-size: 0.8rem; color: #64748b; font-weight: bold;">المرحلة الدراسية</p>
                    <p style="font-weight: bold;">الثانوية العامة</p>
                </div>
                 <div>
                    <p style="font-size: 0.8rem; color: #64748b; font-weight: bold;">العام الدراسي</p>
                    <p style="font-weight: bold;">2024 - 2025</p>
                </div>
            </div>
        </div>

        <table>
            <thead>
                <tr>
                    <th style="width: 15%;">التاريخ</th>
                    <th style="width: 40%;">البيان</th>
                    <th style="width: 15%;">مدين (عليه)</th>
                    <th style="width: 15%;">دائن (له)</th>
                    <th style="width: 15%;">الرصيد</th>
                </tr>
            </thead>
            <tbody>
                ${rows}
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="4" style="text-align: left; padding-left: 20px;">الرصيد المستحق النهائي</td>
                    <td style="font-size: 1.2rem; font-weight: 900;">${balance.toLocaleString()}</td>
                </tr>
            </tfoot>
        </table>
        
        <div style="margin-top: 40px; text-align: center; color: #94a3b8; font-size: 0.8rem;">
            * هذا الكشف صادر إلكترونياً ولا يحتاج إلى توقيع في حال وجود الختم الرقمي.
        </div>
    `;
};
