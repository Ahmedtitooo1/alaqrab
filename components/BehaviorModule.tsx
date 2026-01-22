
import React, { useState } from 'react';
import {
    Search, ShieldAlert, Award, User, Calendar,
    FileWarning, Gavel, CheckCircle, AlertTriangle
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { BehaviorRecord, UserRole } from '../types';

const BehaviorModule: React.FC = () => {
    const { behaviorRecords, addBehaviorRecord, allUsers, user, isRtl } = useAppContext();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStudent, setSelectedStudent] = useState<any | null>(null);

    // Form State
    const [newRecord, setNewRecord] = useState({
        type: 'violation',
        category: 'conduct',
        severity: 'low',
        description: '',
        actionTaken: ''
    });

    const handleAddRecord = () => {
        if (!selectedStudent || !newRecord.description) {
            alert('يرجى اختيار طالب وإدخال الوصف');
            return;
        }

        const record: BehaviorRecord = {
            id: Date.now().toString(),
            studentId: selectedStudent.id,
            studentName: `${selectedStudent.firstName} ${selectedStudent.lastName}`,
            date: new Date().toISOString(),
            // @ts-ignore
            type: newRecord.type,
            // @ts-ignore
            category: newRecord.category,
            // @ts-ignore
            severity: newRecord.severity,
            description: newRecord.description,
            actionTaken: newRecord.actionTaken,
            reportedBy: user?.id || 'unknown'
        };

        addBehaviorRecord(record);

        // Success message
        alert(`✅ تم تسجيل ${record.type === 'violation' ? 'المخالفة' : 'الإنجاز'} بنجاح للطالب: ${record.studentName}`);

        // Reset form but keep student selected
        setNewRecord({
            type: 'violation',
            category: 'conduct',
            severity: 'low',
            description: '',
            actionTaken: ''
        });
    };

    const students = allUsers.filter(u => u.role === UserRole.STUDENT);
    const filteredStudents = students.filter(s =>
        `${s.firstName} ${s.lastName}`.includes(searchTerm) || s.code.includes(searchTerm)
    );

    const studentRecords = selectedStudent
        ? behaviorRecords.filter(r => r.studentId === selectedStudent.id)
        : [];

    return (
        <div className="space-y-6 animate-view p-6" dir={isRtl ? 'rtl' : 'ltr'}>
            <div className="glass-panel p-8 bg-white rounded-[2.5rem] border shadow-sm">
                <div className="flex items-center gap-4 mb-6">
                    <div className="p-4 bg-purple-100 text-purple-700 rounded-2xl">
                        <Gavel size={32} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-slate-900">السلوك والانضباط</h2>
                        <p className="text-slate-500 font-bold">سجل المخالفات والإجراءات التأديبية</p>
                    </div>
                </div>

                {/* Search */}
                <div className="relative mb-8">
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full p-4 pr-12 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-purple-500 outline-none font-bold"
                        placeholder="ابحث عن طالب بالاسم أو الكود..."
                    />
                    {searchTerm && !selectedStudent && (
                        <div className="absolute top-full right-0 left-0 mt-2 bg-white rounded-2xl shadow-xl border z-50 max-h-60 overflow-y-auto">
                            {filteredStudents.map(s => (
                                <div
                                    key={s.id}
                                    onClick={() => {
                                        setSelectedStudent(s);
                                        setSearchTerm('');
                                    }}
                                    className="p-4 hover:bg-slate-50 cursor-pointer border-b last:border-0 flex justify-between items-center"
                                >
                                    <span className="font-bold text-slate-700">{s.firstName} {s.lastName}</span>
                                    <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-500">{s.code}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {selectedStudent ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left: Form */}
                        <div className="lg:col-span-1 space-y-6">
                            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                <div className="flex items-center gap-3 mb-4 pb-4 border-b">
                                    <User size={24} className="text-slate-400" />
                                    <div>
                                        <h3 className="font-black text-slate-800">{selectedStudent.firstName} {selectedStudent.lastName}</h3>
                                        <p className="text-xs font-bold text-slate-400">{selectedStudent.code}</p>
                                    </div>
                                    <button onClick={() => setSelectedStudent(null)} className="mr-auto text-xs text-rose-500 font-bold hover:underline">
                                        تغيير
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setNewRecord({ ...newRecord, type: 'violation' })}
                                            className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${newRecord.type === 'violation' ? 'bg-rose-500 text-white shadow-lg' : 'bg-white text-slate-400'}`}
                                        >
                                            مخالفة سلوكية
                                        </button>
                                        <button
                                            onClick={() => setNewRecord({ ...newRecord, type: 'positive' })}
                                            className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${newRecord.type === 'positive' ? 'bg-emerald-500 text-white shadow-lg' : 'bg-white text-slate-400'}`}
                                        >
                                            سلوك إيجابي
                                        </button>
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">التصنيف</label>
                                        <select
                                            value={newRecord.category}
                                            onChange={e => setNewRecord({ ...newRecord, category: e.target.value })}
                                            className="w-full p-3 bg-white rounded-xl border-2 border-slate-100 outline-none font-bold text-sm"
                                        >
                                            <option value="attendance">غياب وتأخير</option>
                                            <option value="conduct">سلوك وانضباط</option>
                                            <option value="academic">إهمال دراسي</option>
                                            <option value="other">أخرى</option>
                                        </select>
                                    </div>

                                    {newRecord.type === 'violation' && (
                                        <div>
                                            <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">درجة الخطورة</label>
                                            <div className="flex gap-2">
                                                {['low', 'medium', 'high', 'critical'].map(lvl => (
                                                    <button
                                                        key={lvl}
                                                        onClick={() => setNewRecord({ ...newRecord, severity: lvl })}
                                                        className={`flex-1 py-2 rounded-lg text-[10px] font-black border-2 transition-all uppercase ${newRecord.severity === lvl ? 'border-rose-500 bg-rose-50 text-rose-600' : 'border-slate-100 bg-white text-slate-300'}`}
                                                    >
                                                        {lvl}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">وصف الواقعة</label>
                                        <textarea
                                            rows={3}
                                            value={newRecord.description}
                                            onChange={e => setNewRecord({ ...newRecord, description: e.target.value })}
                                            className="w-full p-3 bg-white rounded-xl border-2 border-slate-100 outline-none font-bold text-sm"
                                            placeholder="اكتب تفاصيل ما حدث..."
                                        />
                                    </div>

                                    {newRecord.type === 'violation' && (
                                        <div>
                                            <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">الإجراء المتخذ (العقاب)</label>
                                            <input
                                                value={newRecord.actionTaken}
                                                onChange={e => setNewRecord({ ...newRecord, actionTaken: e.target.value })}
                                                className="w-full p-3 bg-white rounded-xl border-2 border-slate-100 outline-none font-bold text-sm text-rose-600"
                                                placeholder="فصل، استدعاء ولي أمر، إنذار..."
                                            />
                                        </div>
                                    )}

                                    <button
                                        onClick={handleAddRecord}
                                        className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black shadow-xl hover:bg-slate-800 transition-all mt-4"
                                    >
                                        تسجيل الحالة
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Right: History */}
                        <div className="lg:col-span-2 space-y-4">
                            <h3 className="font-black text-lg text-slate-700 px-2">سجل الطالب</h3>
                            {studentRecords.length === 0 ? (
                                <div className="p-8 text-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl">
                                    <p className="text-slate-400 font-bold">لا توجد سجلات سلوكية لهذا الطالب</p>
                                </div>
                            ) : (
                                studentRecords.map(record => (
                                    <div key={record.id} className="bg-white p-5 rounded-3xl border shadow-sm flex items-start gap-4">
                                        <div className={`p-4 rounded-2xl ${record.type === 'positive' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                                            {record.type === 'positive' ? <Award size={24} /> : <AlertTriangle size={24} />}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h4 className="font-bold text-slate-800 text-lg">{record.category === 'attendance' ? 'مخالفة حضور' : record.category === 'conduct' ? 'مخالفة سلوكية' : 'ملاحظة'}</h4>
                                                    <p className="text-xs text-slate-400 font-bold flex items-center gap-1">
                                                        <Calendar size={12} /> {new Date(record.date).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                {record.severity && (
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${record.severity === 'critical' ? 'bg-rose-600 text-white' :
                                                        record.severity === 'high' ? 'bg-orange-500 text-white' :
                                                            'bg-slate-200 text-slate-600'
                                                        }`}>
                                                        {record.severity}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-slate-600 font-medium text-sm leading-relaxed bg-slate-50 p-3 rounded-xl mb-3">
                                                {record.description}
                                            </p>
                                            {record.actionTaken && (
                                                <div className="flex items-center gap-2 text-rose-600 font-bold text-xs bg-rose-50 p-2 rounded-lg inline-flex">
                                                    <Gavel size={14} />
                                                    <span>الإجراء: {record.actionTaken}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="bg-slate-50 p-12 rounded-3xl border-2 border-dashed text-center">
                        <h3 className="text-xl font-black text-slate-400 mb-2">اختر طالباً للبدء</h3>
                        <p className="text-slate-400">ابحث عن الطالب أعلاه لعرض سجله أو إضافة ملاحظة جديدة</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BehaviorModule;
