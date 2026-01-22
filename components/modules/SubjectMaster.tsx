
import React, { useState } from 'react';
import {
    BookOpen, Users, Plus, Check, Search, Trash2, Edit3, X, Save
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { UserRole, Subject } from '../../types';

const SubjectMaster: React.FC = () => {
    const { lang, allUsers, subjects, gradeLevels, addSubject, updateSubject, deleteSubject, user } = useAppContext();
    const isRtl = lang === 'ar';

    const [editingSubject, setEditingSubject] = useState<string | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        gradeLevelId: '',
        assignedTeacherIds: [] as string[]
    });

    const teachers = allUsers?.filter(u => u.role === UserRole.TEACHER) || [];

    const handleToggleTeacher = (subject: Subject, teacherId: string) => {
        const currentIds = subject.assignedTeacherIds || [];
        const newIds = currentIds.includes(teacherId)
            ? currentIds.filter(id => id !== teacherId)
            : [...currentIds, teacherId];
        updateSubject({ ...subject, assignedTeacherIds: newIds });
    };

    const handleAddSubject = () => {
        if (!formData.name || !formData.gradeLevelId) return alert(isRtl ? "بيانات ناقصة" : "Missing fields");

        const newSubject: Subject = {
            id: `sub-${Date.now()}`,
            name: formData.name,
            gradeLevelId: formData.gradeLevelId,
            assignedTeacherIds: formData.assignedTeacherIds,
            // institutionId will be handled by context or we can add it here if needed but context adds it
        } as any;

        addSubject(newSubject);
        setShowAddModal(false);
        setFormData({ name: '', gradeLevelId: '', assignedTeacherIds: [] });
    };

    const handleDelete = (id: string) => {
        if (confirm(isRtl ? "هل أنت متأكد من حذف المادة؟" : "Are you sure?")) {
            deleteSubject(id);
        }
    };

    return (
        <div className="space-y-8 animate-view pb-20">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                        <BookOpen className="text-indigo-600" /> {isRtl ? 'إدارة المواد والمعلمين' : 'Subject & Teacher Mapping'}
                    </h2>
                    <p className="text-slate-500 font-bold mt-1 max-w-2xl">
                        {isRtl ? 'تعيين معلمي المواد لكل صف دراسي لضمان دقة الجدول الدراسي.' : 'Assign teachers to subjects for each grade level to ensure timetable accuracy.'}
                    </p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="px-6 py-3 bg-slate-900 text-white rounded-xl font-black text-xs flex items-center gap-3 hover:bg-indigo-600 transition-all shadow-lg"
                >
                    <Plus size={18} /> {isRtl ? 'إضافة مادة جديدة' : 'Add New Subject'}
                </button>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {subjects.map(subject => {
                    const assignedTeachers = teachers.filter(t => subject.assignedTeacherIds?.includes(t.id));
                    const isEditing = editingSubject === subject.id;
                    const gradeName = gradeLevels.find(g => g.id === subject.gradeLevelId)?.name || subject.gradeLevelId;

                    return (
                        <div key={subject.id} className={`glass-card bg-white p-6 rounded-[2rem] border transition-all ${isEditing ? 'border-indigo-500 ring-4 ring-indigo-50' : 'border-slate-100 hover:border-indigo-200'}`}>
                            <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                                        <BookOpen size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-slate-900">{subject.name}</h3>
                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{isRtl ? 'الصف:' : 'Grade:'} {gradeName}</p>
                                    </div>
                                </div>

                                <div className="flex-1 flex flex-col md:flex-row items-start md:items-center justify-end gap-4">
                                    {/* Display Assigned Teachers */}
                                    <div className="flex items-center -space-x-3 rtl:space-x-reverse px-4">
                                        {assignedTeachers.length > 0 ? assignedTeachers.map(t => (
                                            <div key={t.id} className="w-10 h-10 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-xs font-black shadow-sm" title={`${t.firstName} ${t.lastName}`}>
                                                {t.firstName.charAt(0)}
                                            </div>
                                        )) : (
                                            <span className="text-xs text-slate-300 font-bold">{isRtl ? 'لم يتم تعيين معلمين' : 'No teachers assigned'}</span>
                                        )}
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setEditingSubject(isEditing ? null : subject.id)}
                                            className={`px-4 py-3 rounded-xl font-black text-xs flex items-center gap-2 transition-all ${isEditing ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                                        >
                                            <Users size={16} /> {isEditing ? (isRtl ? 'إغلاق' : 'Close') : (isRtl ? 'تعيين' : 'Assign')}
                                        </button>
                                        <button onClick={() => handleDelete(subject.id)} className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-rose-50 hover:text-rose-600 transition-all">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Teacher Selection Dropdown Area */}
                            {isEditing && (
                                <div className="mt-8 pt-6 border-t border-slate-100 animate-view">
                                    <div className="mb-4 text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <Search size={14} /> {isRtl ? 'اختر المعلمين لتدريس هذه المادة (يظهر الطلاب تلقائياً لديهم):' : 'Select teachers for this subject:'}
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                        {teachers.map(teacher => {
                                            const isSelected = subject.assignedTeacherIds?.includes(teacher.id);
                                            return (
                                                <button
                                                    key={teacher.id}
                                                    onClick={() => handleToggleTeacher(subject, teacher.id)}
                                                    className={`p-4 rounded-xl flex items-center gap-4 border-2 transition-all text-right ${isSelected ? 'border-indigo-500 bg-indigo-50/50' : 'border-slate-100 bg-white hover:border-slate-300'}`}
                                                >
                                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all ${isSelected ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-300'}`}>
                                                        {isSelected && <Check size={14} />}
                                                    </div>
                                                    <div>
                                                        <p className={`font-black text-sm ${isSelected ? 'text-indigo-900' : 'text-slate-700'}`}>{teacher.firstName} {teacher.lastName}</p>
                                                        <p className="text-[10px] text-slate-400 font-bold uppercase">{teacher.code}</p>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Add Subject Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-[600] bg-slate-950/50 backdrop-blur-sm flex items-center justify-center p-6">
                    <div className="glass-panel w-full max-w-lg p-8 bg-white rounded-3xl animate-view shadow-2xl space-y-6">
                        <div className="flex justify-between items-center border-b pb-4">
                            <h3 className="text-2xl font-black">{isRtl ? 'إضافة مادة جديدة' : 'Add New Subject'}</h3>
                            <button onClick={() => setShowAddModal(false)}><X className="text-slate-400 hover:text-rose-500" /></button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{isRtl ? 'اسم المادة' : 'Subject Name'}</label>
                                <input
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full p-4 bg-slate-50 rounded-xl border-none outline-none font-bold"
                                    placeholder={isRtl ? 'مثال: الفيزياء (ميكانيكا)' : 'e.g. Physics'}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{isRtl ? 'الصف الدراسي' : 'Grade Level'}</label>
                                <select
                                    value={formData.gradeLevelId}
                                    onChange={e => setFormData({ ...formData, gradeLevelId: e.target.value })}
                                    className="w-full p-4 bg-slate-50 rounded-xl border-none outline-none font-bold"
                                >
                                    <option value="">{isRtl ? '-- اختر الصف --' : '-- Select Grade --'}</option>
                                    {gradeLevels.map(gl => <option key={gl.id} value={gl.id}>{gl.name}</option>)}
                                </select>
                            </div>
                        </div>

                        <button
                            onClick={handleAddSubject}
                            className="w-full py-4 bg-indigo-600 text-white rounded-xl font-black text-lg hover:bg-indigo-700 transition-all shadow-lg"
                        >
                            {isRtl ? 'حفظ وإضافة' : 'Save Subject'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SubjectMaster;
