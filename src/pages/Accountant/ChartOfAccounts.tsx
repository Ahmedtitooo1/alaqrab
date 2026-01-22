import React, { useState, useMemo } from 'react';
import {
    FolderTree, Wallet, Plus, Edit2, Trash2, ChevronRight, ChevronDown,
    Search, Save, X, Building2, CreditCard, Banknote, Landmark, FileText
} from 'lucide-react';
import { useAppContext } from '../../../context/AppContext';
import { FinancialCategory, FinancialFund } from '../../../types';
import AccountLedger from './AccountLedger';

const ChartOfAccounts: React.FC = () => {
    const { financialCategories, funds, lang } = useAppContext();
    const isRtl = lang === 'ar';
    const [activeTab, setActiveTab] = useState<'chart' | 'funds'>('chart');
    const [selectedAccount, setSelectedAccount] = useState<FinancialCategory | null>(null);

    // If viewing account ledger, show that instead
    if (selectedAccount) {
        return <AccountLedger account={selectedAccount} onBack={() => setSelectedAccount(null)} />;
    }

    return (
        <div className="space-y-8 animate-view pb-24" dir={isRtl ? 'rtl' : 'ltr'}>
            {/* Header */}
            <div className="glass-panel p-8 bg-white rounded-[2.5rem] border shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-6">
                    <div className="p-5 bg-indigo-600 text-white rounded-[1.75rem] shadow-xl">
                        <FolderTree size={40} />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-slate-900">الدليل المحاسبي والصناديق</h2>
                        <p className="text-slate-500 font-bold mt-1">إدارة شجرة الحسابات والتعريفات المالية</p>
                    </div>
                </div>

                <div className="flex bg-slate-100 p-1.5 rounded-2xl">
                    <button
                        onClick={() => setActiveTab('chart')}
                        className={`px-8 py-3 rounded-xl font-black text-sm transition-all flex items-center gap-2 ${activeTab === 'chart'
                            ? 'bg-white text-indigo-600 shadow-md'
                            : 'text-slate-400 hover:text-slate-600'
                            }`}
                    >
                        <FolderTree size={18} /> شجرة الحسابات
                    </button>
                    <button
                        onClick={() => setActiveTab('funds')}
                        className={`px-8 py-3 rounded-xl font-black text-sm transition-all flex items-center gap-2 ${activeTab === 'funds'
                            ? 'bg-white text-indigo-600 shadow-md'
                            : 'text-slate-400 hover:text-slate-600'
                            }`}
                    >
                        <Wallet size={18} /> إدارة الصناديق
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="glass-panel p-8 bg-white rounded-[2.5rem] border shadow-sm min-h-[600px]">
                {activeTab === 'chart' ? <AccountTreeView categories={financialCategories} onViewLedger={setSelectedAccount} /> : <FundsManager funds={funds} categories={financialCategories} />}
            </div>
        </div>
    );
};

// --- Tree View Components ---

const AccountTreeView: React.FC<{ categories: FinancialCategory[], onViewLedger: (account: FinancialCategory) => void }> = ({ categories: initialCategories, onViewLedger }) => {
    const [categories, setCategories] = useState(initialCategories);
    const [searchTerm, setSearchTerm] = useState('');
    const [expanded, setExpanded] = useState<Record<string, boolean>>({
        '100': true, '200': true, '300': true, '400': true, '500': true
    });

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingNode, setEditingNode] = useState<Partial<FinancialCategory> | null>(null);
    const [parentNode, setParentNode] = useState<FinancialCategory | null>(null); // For adding new child

    const toggleExpand = (id: string) => {
        setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleAdd = (parent: FinancialCategory) => {
        setParentNode(parent);
        setEditingNode({
            institutionId: 'tenant-a',
            parentId: parent.id,
            level: parent.level + 1,
            type: parent.type,
            code: `${parent.code}0${Math.floor(Math.random() * 90) + 10}` // Generate mock code
        });
        setIsModalOpen(true);
    };

    const handleEdit = (node: FinancialCategory) => {
        setParentNode(null);
        setEditingNode({ ...node });
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        if (confirm('هل أنت متأكد من حذف هذا الحساب؟ سيتم حذف جميع الحسابات الفرعية أيضاً.')) {
            // Recursive delete logic needed in real app, simplistic approach here:
            setCategories(prev => prev.filter(c => c.id !== id && c.parentId !== id));
        }
    };

    const handleSave = () => {
        if (!editingNode?.name || !editingNode?.code) return alert('الرجاء إدخال الاسم ورقم الحساب');

        if (editingNode.id) {
            // Edit Mode
            setCategories(prev => prev.map(c => c.id === editingNode.id ? { ...c, ...editingNode } as FinancialCategory : c));
        } else {
            // Add Mode
            const newAccount = {
                ...editingNode,
                id: `acc-${Date.now()}`,
                // Ensure type matches parent if not set
                type: parentNode?.type || editingNode.type || 'asset'
            } as FinancialCategory;
            setCategories(prev => [...prev, newAccount]);
            setExpanded(prev => ({ ...prev, [parentNode?.id || '']: true })); // Expand parent
        }
        setIsModalOpen(false);
        setEditingNode(null);
        setParentNode(null);
    };

    // Build Tree Structure
    const tree = useMemo(() => {
        // ... (Similar logic, using local 'categories' state)
        const roots = categories.filter(c => c.level === 1);
        const buildNode = (node: FinancialCategory): any => {
            const children = categories
                .filter(c => c.parentId === node.id)
                .map(buildNode)
                .sort((a: any, b: any) => parseInt(a.code) - parseInt(b.code));
            return { ...node, children };
        };
        return roots.map(buildNode).sort((a, b) => parseInt(a.code) - parseInt(b.code));
    }, [categories]);

    // Render Node Helper
    const renderNode = (node: any) => {
        const hasChildren = node.children && node.children.length > 0;
        const isExpanded = expanded[node.id];
        const isMatch = searchTerm && (node.name.includes(searchTerm) || node.code.includes(searchTerm));

        if (searchTerm && !isMatch && !hasChildren) return null; // Simple filter hiding non-matches

        return (
            <div key={node.id} className="select-none transition-all">
                <div
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer group ${isMatch ? 'bg-amber-100' : 'hover:bg-slate-50'
                        }`}
                    style={{ paddingRight: `${(node.level - 1) * 24}px` }}
                >
                    <div
                        onClick={(e) => { e.stopPropagation(); hasChildren && toggleExpand(node.id); }}
                        className={`w-6 h-6 flex items-center justify-center rounded-lg hover:bg-slate-200 transition-colors ${hasChildren ? 'text-slate-400' : 'opacity-0'}`}
                    >
                        {isExpanded ? <ChevronDown size={16} /> : <div className="rotate-180"><ChevronRight size={16} /></div>}
                    </div>

                    <div className={`px-2 py-1 rounded-md font-mono text-xs font-bold w-16 text-center ${node.type === 'asset' ? 'bg-emerald-50 text-emerald-600' :
                        node.type === 'liability' ? 'bg-rose-50 text-rose-600' :
                            node.type === 'equity' ? 'bg-blue-50 text-blue-600' :
                                'bg-slate-100 text-slate-600'
                        }`}>
                        {node.code}
                    </div>

                    <div className="flex-1 font-bold text-slate-700 flex items-center gap-2" onClick={() => handleEdit(node)}>
                        {node.name}
                        {isMatch && <span className="bg-amber-200 text-amber-800 text-[10px] px-2 py-0.5 rounded-full">مطابق</span>}
                    </div>

                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                        <button onClick={(e) => { e.stopPropagation(); onViewLedger(node); }} className="p-2 bg-white border rounded-lg text-slate-400 hover:text-blue-600 shadow-sm" title="عرض التفاصيل"><FileText size={14} /></button>
                        <button onClick={(e) => { e.stopPropagation(); handleEdit(node); }} className="p-2 bg-white border rounded-lg text-slate-400 hover:text-indigo-600 shadow-sm" title="تعديل"><Edit2 size={14} /></button>
                        {!hasChildren && (
                            <button onClick={(e) => { e.stopPropagation(); handleDelete(node.id); }} className="p-2 bg-white border rounded-lg text-slate-400 hover:text-rose-600 shadow-sm" title="حذف"><Trash2 size={14} /></button>
                        )}
                        {node.level < 5 && (
                            <button onClick={(e) => { e.stopPropagation(); handleAdd(node); }} className="p-2 bg-white border rounded-lg text-slate-400 hover:text-emerald-600 shadow-sm" title="إضافة فرعي"><Plus size={14} /></button>
                        )}
                    </div>
                </div>

                {isExpanded && hasChildren && (
                    <div className="border-r-2 border-slate-100 mr-6 relative">
                        {node.children.map(renderNode)}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="بحث برقم الحساب أو الاسم..."
                        className="w-full p-4 pr-12 bg-slate-50 border-2 border-transparent focus:border-indigo-600 rounded-2xl font-bold text-slate-700 outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button
                    onClick={() => {
                        setParentNode(null);
                        setEditingNode({
                            institutionId: 'tenant-a',
                            level: 1,
                            type: 'asset',
                            code: '',
                            name: ''
                        });
                        setIsModalOpen(true);
                    }}
                    className="px-6 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs shadow-lg hover:bg-indigo-700 transition-all flex items-center gap-2 whitespace-nowrap"
                >
                    <Plus size={18} /> إضافة حساب رئيسي
                </button>
            </div>

            <div className="border rounded-[2rem] p-6 bg-white/50 min-h-[500px] overflow-y-auto max-h-[70vh] custom-scrollbar">
                {tree.map(renderNode)}
                {tree.length === 0 && <div className="text-center text-slate-400 py-10 font-bold">لا توجد حسابات مطابقة للبحث</div>}
            </div>

            {/* Add/Edit Modal */}
            {isModalOpen && editingNode && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2rem] p-8 w-full max-w-lg shadow-2xl animate-view">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-black text-slate-900">
                                {editingNode.id ? 'تعديل بيانات الحساب' : 'إضافة حساب جديد'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 bg-slate-100 rounded-full hover:bg-rose-100 text-slate-500 hover:text-rose-600">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {parentNode && (
                                <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                                    <p className="text-xs font-bold text-indigo-400 uppercase">الحساب الرئيسي (الأب)</p>
                                    <p className="font-bold text-indigo-900 flex items-center gap-2 mt-1">
                                        <span className="font-mono bg-white px-2 rounded">{parentNode.code}</span>
                                        {parentNode.name}
                                    </p>
                                </div>
                            )}

                            <div>
                                <label className="text-xs font-black text-slate-400 uppercase block mb-2">اسم الحساب</label>
                                <input
                                    value={editingNode.name || ''}
                                    onChange={e => setEditingNode(prev => ({ ...prev, name: e.target.value }))}
                                    className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-indigo-600 rounded-xl font-bold text-slate-900 outline-none"
                                    placeholder="مثال: مصروفات انتقالات"
                                    autoFocus
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-black text-slate-400 uppercase block mb-2">رقم الحساب (Code)</label>
                                    <input
                                        value={editingNode.code || ''}
                                        onChange={e => setEditingNode(prev => ({ ...prev, code: e.target.value }))}
                                        className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-indigo-600 rounded-xl font-bold text-slate-900 font-mono outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-black text-slate-400 uppercase block mb-2">طبيعة الحساب</label>
                                    <select
                                        value={editingNode.type || 'asset'}
                                        onChange={e => setEditingNode(prev => ({ ...prev, type: e.target.value as any }))}
                                        className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-indigo-600 rounded-xl font-bold text-slate-900 outline-none"
                                        disabled={!!parentNode} // Inherit form parent usually
                                    >
                                        <option value="asset">أصول (Assets)</option>
                                        <option value="liability">خصوم (Liabilities)</option>
                                        <option value="equity">حقوق ملكية (Equity)</option>
                                        <option value="income">إيرادات (Income)</option>
                                        <option value="expense">مصروفات (Expenses)</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 mt-8 pt-6 border-t">
                            <button onClick={() => setIsModalOpen(false)} className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-xl font-bold hover:bg-slate-200">إلغاء</button>
                            <button onClick={handleSave} className="flex-1 py-4 bg-indigo-600 text-white rounded-xl font-black shadow-lg hover:bg-indigo-700 flex items-center justify-center gap-2">
                                <Save size={18} /> حفظ التغييرات
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- Funds Manager ---

const FundsManager: React.FC<{ funds: FinancialFund[], categories: FinancialCategory[] }> = ({ funds: initialFunds, categories }) => {
    // Local state for editing funds (Mock implementation)
    const [funds, setFunds] = useState(initialFunds);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Form State
    const [formData, setFormData] = useState<Partial<FinancialFund>>({
        name: '', type: 'cash', balance: 0, accountCode: ''
    });

    const handleSubmit = () => {
        if (!formData.name || !formData.accountCode) return;

        if (editingId) {
            setFunds(funds.map(f => f.id === editingId ? { ...f, ...formData } as FinancialFund : f));
        } else {
            setFunds([...funds, { ...formData, id: `fund-${Date.now()}`, institutionId: 'tenant-a' } as FinancialFund]);
        }
        setIsAdding(false);
        setEditingId(null);
        setFormData({ name: '', type: 'cash', balance: 0, accountCode: '' });
    };

    const handleEdit = (fund: FinancialFund) => {
        setFormData(fund);
        setEditingId(fund.id);
        setIsAdding(true);
    };

    const handleDelete = (id: string) => {
        if (confirm('هل أنت متأكد من حذف هذا الصندوق؟')) {
            setFunds(funds.filter(f => f.id !== id));
        }
    };

    // Assets accounts (Cash/Bank)
    const availableAccounts = categories.filter(c => c.code.startsWith('111') && c.level > 3);

    return (
        <div className="space-y-8">
            <div className="flex justify-end">
                <button
                    onClick={() => { setIsAdding(true); setEditingId(null); setFormData({ name: '', type: 'cash', balance: 0, accountCode: '' }); }}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-black shadow-lg hover:bg-indigo-700 transition-all flex items-center gap-2"
                >
                    <Plus size={20} /> إضافة صندوق / بنك جديد
                </button>
            </div>

            {isAdding && (
                <div className="bg-slate-50 border p-6 rounded-3xl animate-fade-in-up space-y-6">
                    <h3 className="font-black text-lg text-slate-900 border-b pb-4 mb-4">{editingId ? 'تعديل بيانات الصندوق' : 'إضافة صندوق جديد'}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase">اسم الصندوق / الحساب</label>
                            <input
                                value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="w-full p-4 bg-white border rounded-xl font-bold"
                                placeholder="مثال: الخزينة الرئيسية"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase">النوع</label>
                            <select
                                value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value as any })}
                                className="w-full p-4 bg-white border rounded-xl font-bold"
                            >
                                <option value="cash">خزينة نقدية (Cash)</option>
                                <option value="bank">حساب بنكي (Bank Account)</option>
                                <option value="wallet">محفظة إلكترونية (E-Wallet)</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase">الحساب المحاسبي المرتبط</label>
                            <select
                                value={formData.accountCode} onChange={e => setFormData({ ...formData, accountCode: e.target.value })}
                                className="w-full p-4 bg-white border rounded-xl font-bold font-mono"
                            >
                                <option value="">-- اختر الحساب --</option>
                                {availableAccounts.map(acc => (
                                    <option key={acc.id} value={acc.code}>{acc.code} - {acc.name}</option>
                                ))}
                            </select>
                        </div>
                        {formData.type !== 'cash' && (
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase">رقم الحساب (لأولياء الأمور)</label>
                                <input
                                    value={formData.publicAccountNumber || ''} onChange={e => setFormData({ ...formData, publicAccountNumber: e.target.value })}
                                    className="w-full p-4 bg-white border rounded-xl font-bold"
                                    placeholder="IBAN / Wallet Number"
                                />
                            </div>
                        )}
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase">الرصيد الافتتاحي (للمحاكاة فقط)</label>
                            <input
                                type="number"
                                value={formData.balance} onChange={e => setFormData({ ...formData, balance: Number(e.target.value) })}
                                className="w-full p-4 bg-white border rounded-xl font-bold"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                        <button onClick={() => setIsAdding(false)} className="px-6 py-3 text-slate-500 font-bold hover:bg-slate-200 rounded-xl">إلغاء</button>
                        <button onClick={handleSubmit} className="px-8 py-3 bg-emerald-600 text-white font-black rounded-xl hover:bg-emerald-700 shadow-lg flex items-center gap-2"><Save size={18} /> حفظ البيانات</button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {funds.map(fund => (
                    <div key={fund.id} className="relative group bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all">
                        <div className="absolute top-6 left-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleEdit(fund)} className="p-2 bg-slate-100 text-slate-500 rounded-lg hover:text-indigo-600"><Edit2 size={16} /></button>
                            <button onClick={() => handleDelete(fund.id)} className="p-2 bg-slate-100 text-slate-500 rounded-lg hover:text-rose-600"><Trash2 size={16} /></button>
                        </div>

                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-inner ${fund.type === 'bank' ? 'bg-indigo-50 text-indigo-600' :
                            fund.type === 'wallet' ? 'bg-rose-50 text-rose-600' :
                                'bg-emerald-50 text-emerald-600'
                            }`}>
                            {fund.type === 'bank' ? <Landmark size={32} /> :
                                fund.type === 'wallet' ? <CreditCard size={32} /> :
                                    <Banknote size={32} />}
                        </div>

                        <h3 className="text-xl font-black text-slate-900">{fund.name}</h3>
                        <p className="text-xs font-bold text-slate-400 mt-1 mb-6 flex items-center gap-2">
                            <span className="bg-slate-100 px-2 py-1 rounded text-slate-500 font-mono">{fund.accountCode}</span>
                            {fund.type.toUpperCase()}
                        </p>

                        <div className="pt-6 border-t border-slate-50">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">الرصيد الحالي</p>
                            <p className="text-3xl font-black text-slate-800 tabular-nums tracking-tight">
                                {fund.balance.toLocaleString()} <span className="text-sm text-slate-300">ج.م</span>
                            </p>
                        </div>

                        {fund.publicAccountNumber && (
                            <div className="mt-4 bg-slate-50 p-3 rounded-xl border border-dashed border-slate-200">
                                <p className="text-[10px] font-bold text-slate-400 text-center uppercase">رقم التحويل (للعملاء)</p>
                                <p className="text-center font-mono font-bold text-slate-600 mt-1 select-all">{fund.publicAccountNumber}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ChartOfAccounts;
