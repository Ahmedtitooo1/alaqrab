
import React, { useState, useMemo } from 'react';
import {
   Users, Search, UserPlus, Mail, Phone, Edit3, Trash2,
   X, Shield, Briefcase, GraduationCap, Printer,
   DollarSign, Key, CheckCircle, ArrowUpRight, Filter,
   ShieldAlert, BookOpen, UserCheck, Smartphone, Info,
   Lock, User as UserIcon, UserMinus, Hash, UserCheck2,
   Activity, Layers, FileSpreadsheet, CreditCard, UserCircle, ChevronDown
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { UserRole, User } from '../types';

interface ManagementModuleProps {
   mode: 'students' | 'teachers' | 'employees';
}

const ManagementModule: React.FC<ManagementModuleProps> = ({ mode }) => {
   const {
      lang, allUsers, user: currentUser, addStudentWithAccount, addEmployeeRecord,
      systemName, systemLogo, addNotification
   } = useAppContext();

   const isRtl = lang === 'ar';
   const isAdmin = currentUser?.role === UserRole.ADMIN;
   const isTeacher = currentUser?.role === UserRole.TEACHER;

   const [search, setSearch] = useState('');
   const [showAddModal, setShowAddModal] = useState(false);
   const [successStatus, setSuccessStatus] = useState(false);

   const [formData, setFormData] = useState({
      firstName: '', lastName: '', phone: '', email: '',
      username: '', password: '',
      jobTitle: mode === 'teachers' ? 'معلم' : '',
      salary: 3000,
      createLogin: false,
      createParentLogin: false,
      parentName: '', parentPhone: '', parentEmail: '', parentUsername: '',
      teacherId: isTeacher ? currentUser?.id : ''
   });

   const teachers = useMemo(() => allUsers.filter(u => u.role === UserRole.TEACHER), [allUsers]);

   const filteredUsers = useMemo(() => {
      return allUsers.filter(u => {
         if (mode === 'teachers') return u.role === UserRole.TEACHER;
         if (mode === 'employees') return [UserRole.ACCOUNTANT, UserRole.ADMIN].includes(u.role) && u.id !== currentUser?.id;
         if (mode === 'students') {
            if (isTeacher) return u.role === UserRole.STUDENT && u.teacherId === currentUser.id;
            return u.role === UserRole.STUDENT;
         }
         return false;
      }).filter(u => (u.firstName + ' ' + u.lastName + ' ' + (u.code || '')).toLowerCase().includes(search.toLowerCase()));
   }, [allUsers, mode, search, currentUser, isTeacher]);

   const handleAddAction = () => {
      if (!formData.firstName) return alert("يرجى إكمال البيانات الأساسية");

      if (mode === 'students') {
         const studentData: User = {
            id: `u-${Date.now()}`,
            code: '',
            firstName: formData.firstName,
            lastName: formData.lastName,
            username: formData.username || `std_${Date.now()}`,
            role: UserRole.STUDENT,
            institutionId: currentUser?.institutionId || 'inst-1',
            teacherId: formData.teacherId,
            phone: formData.phone,
            email: formData.email,
            aiQuestionsCount: 10
         };
         const parentData: Partial<User> = {
            firstName: formData.parentName,
            phone: formData.parentPhone,
            email: formData.parentEmail,
            username: formData.parentUsername || `par_${Date.now()}`,
         };
         addStudentWithAccount(studentData, parentData, formData.createLogin, formData.createParentLogin);
      } else {
         const targetRole = mode === 'teachers' ? UserRole.TEACHER : (formData.jobTitle.includes('محاسب') ? UserRole.ACCOUNTANT : UserRole.ADMIN);
         addEmployeeRecord({
            id: `emp-${Date.now()}`,
            code: '',
            firstName: formData.firstName,
            lastName: formData.lastName,
            username: formData.username || `emp_${Date.now()}`,
            role: targetRole,
            institutionId: currentUser?.institutionId || 'inst-1',
            phone: formData.phone,
            email: formData.email,
            salary: formData.salary,
            jobTitle: formData.jobTitle,
            aiQuestionsCount: 50
         }, formData.createLogin);
      }
      setSuccessStatus(true);
      addNotification({ title: 'نجاح العملية', content: 'تم تسجيل البيانات وتحديث قاعدة بيانات الفرع.', type: 'success', date: new Date().toISOString() });
   };

   const getStudentCountForTeacher = (teacherId: string) => {
      return allUsers.filter(u => u.role === UserRole.STUDENT && u.teacherId === teacherId).length;
   };

   return (
      <div className="space-y-10 animate-view pb-20 text-right">
         <div className="flex flex-col md:flex-row justify-between items-center gap-6 no-print">
            <div className="flex items-center gap-6">
               <div className="p-5 rounded-[1.75rem] shadow-xl bg-indigo-600 text-white">
                  {mode === 'teachers' ? <GraduationCap size={32} /> : mode === 'students' ? <Users size={32} /> : <Briefcase size={32} />}
               </div>
               <div>
                  <h2 className="text-3xl font-black">{mode === 'teachers' ? 'إدارة المعلمون' : mode === 'students' ? 'شؤون الطلاب' : 'إدارة الموظفين'}</h2>
                  <p className="text-slate-500 font-bold">تنظيم وتكويد الكوادر التعليمية والإدارية والطلاب.</p>
               </div>
            </div>
            <div className="flex gap-4">
               <button onClick={() => { setShowAddModal(true); setSuccessStatus(false); }} className="px-8 py-4 bg-slate-950 text-white rounded-2xl font-black flex items-center gap-3 shadow-xl hover:bg-indigo-600 transition-all">
                  <UserPlus size={20} /> إضافة {mode === 'students' ? 'طالب' : mode === 'teachers' ? 'معلم' : 'موظف'} جديد
               </button>
            </div>
         </div>

         <div className="glass-panel border overflow-hidden bg-white rounded-[2.5rem] shadow-sm">
            <div className="p-8 border-b flex items-center gap-4 bg-slate-50/30 no-print">
               <Search className="text-slate-300" />
               <input value={search} onChange={e => setSearch(e.target.value)} placeholder="بحث بالاسم أو الكود..." className="flex-1 bg-transparent border-none outline-none font-bold text-sm" />
            </div>
            <div className="overflow-x-auto">
               <table className="w-full text-right min-w-[1000px]">
                  <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 border-b">
                     <tr>
                        <th className="p-6">الكود</th>
                        <th className="p-6">الاسم والبيانات</th>
                        <th className="p-6">التواصل</th>
                        {mode === 'teachers' && <th className="p-6 text-center">عدد الطلاب</th>}
                        {mode === 'students' && <th className="p-6">ولي الأمر</th>}
                        <th className="p-6 text-center">الإجراء</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y font-bold text-sm">
                     {filteredUsers.map(u => (
                        <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                           <td className="p-6"><code className="text-indigo-600 font-mono">{u.code}</code></td>
                           <td className="p-6 flex items-center gap-3">
                              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${u.username || u.id}`} className="w-10 h-10 rounded-xl bg-slate-100 shadow-inner" alt="v" />
                              <div>
                                 <p className="text-slate-900 font-black">{u.firstName} {u.lastName}</p>
                                 <p className="text-[9px] text-slate-400 font-black">{u.jobTitle || (u.role === UserRole.STUDENT ? 'طالب' : 'موظف')}</p>
                              </div>
                           </td>
                           <td className="p-6"><div><p className="text-xs">{u.phone}</p><p className="text-[10px] text-slate-400">{u.email}</p></div></td>
                           {mode === 'teachers' && <td className="p-6 text-center"><span className="px-4 py-1 bg-indigo-50 text-indigo-700 rounded-lg font-black">{getStudentCountForTeacher(u.id)} طالب</span></td>}
                           {mode === 'students' && (
                              <td className="p-6 border-r">
                                 <div className="flex flex-col text-slate-500">
                                    <p className="text-xs font-black">{u.parentName || 'غير مسجل'}</p>
                                    <p className="text-[10px] text-slate-400">{u.parentPhone || '---'}</p>
                                 </div>
                              </td>
                           )}
                           <td className="p-6 text-center">
                              <button className="p-3 bg-slate-50 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm"><Edit3 size={16} /></button>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>

         {showAddModal && (
            <div className="fixed inset-0 z-[700] premium-modal-backdrop flex items-center justify-center p-6 no-print">
               <div className="premium-modal-content w-full max-w-5xl animate-view flex flex-col max-h-[90vh]">
                  {!successStatus ? (
                     <div className="flex-1 overflow-y-auto p-12 space-y-8 no-scrollbar">
                        <div className="flex justify-between items-center border-b pb-6 text-right">
                           <h3 className="text-3xl font-black">تكويد {mode === 'students' ? 'طالب' : 'موظف'} جديد</h3>
                           <button onClick={() => setShowAddModal(false)} className="p-3 bg-slate-50 rounded-2xl hover:bg-rose-50 hover:text-rose-600 transition-all"><X size={24} /></button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                           <div className="space-y-6">
                              <h4 className="text-indigo-600 font-black text-xs uppercase tracking-widest flex items-center gap-3"><UserIcon size={18} /> البيانات الشخصية</h4>
                              <div className="grid grid-cols-2 gap-4">
                                 <Field label="الاسم الأول" value={formData.firstName} onChange={v => setFormData({ ...formData, firstName: v })} />
                                 <Field label="اللقب" value={formData.lastName} onChange={v => setFormData({ ...formData, lastName: v })} />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                 <Field label="رقم الهاتف" value={formData.phone} onChange={v => setFormData({ ...formData, phone: v })} />
                                 <Field label="البريد الإلكتروني" value={formData.email} onChange={v => setFormData({ ...formData, email: v })} />
                              </div>

                              {mode === 'students' ? (
                                 <>
                                    {isAdmin && (
                                       <div className="space-y-1">
                                          <label className="text-[10px] font-black text-slate-400 tracking-widest px-2">تخصيص المعلم</label>
                                          <select value={formData.teacherId} onChange={e => setFormData({ ...formData, teacherId: e.target.value })} className="w-full p-4 rounded-2xl font-bold border bg-white border-slate-200 outline-none">
                                             <option value="">-- اختر معلم --</option>
                                             {teachers.map(t => <option key={t.id} value={t.id}>م/ {t.firstName} {t.lastName}</option>)}
                                          </select>
                                       </div>
                                    )}
                                    <div className="space-y-4 pt-4 border-t">
                                       <h4 className="text-blue-600 font-black text-xs uppercase tracking-widest flex items-center gap-3"><Smartphone size={18} /> بيانات ولي الأمر</h4>
                                       <Field label="اسم ولي الأمر" value={formData.parentName} onChange={v => setFormData({ ...formData, parentName: v })} />
                                       <Field label="هاتف ولي الأمر" value={formData.parentPhone} onChange={v => setFormData({ ...formData, parentPhone: v })} />
                                    </div>
                                 </>
                              ) : (
                                 <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 tracking-widest px-2">المسمى الوظيفي</label>
                                    <div className="flex gap-2">
                                       <input value={formData.jobTitle} onChange={e => setFormData({ ...formData, jobTitle: e.target.value })} className="flex-1 p-4 rounded-2xl font-bold border border-slate-200 outline-none" placeholder="محاسب، سكرتير، فني..." />
                                       <button onClick={() => setFormData({ ...formData, jobTitle: 'محاسب' })} className="px-4 bg-slate-100 rounded-xl text-[10px] font-black">محاسب</button>
                                    </div>
                                 </div>
                              )}
                           </div>

                           <div className="space-y-6 bg-slate-50/50 p-8 rounded-[2.5rem] border-2 border-dashed border-slate-200">
                              <h4 className="text-rose-600 font-black text-xs uppercase tracking-widest flex items-center gap-3"><Key size={18} /> إعدادات حسابات الدخول</h4>

                              <div className="space-y-6">
                                 <div className="flex items-center justify-between p-4 bg-white rounded-2xl border">
                                    <div className="flex items-center gap-3"><Lock size={16} className="text-slate-400" /> <span className="text-xs font-bold">إنشاء يوزر دخول لـ {mode === 'students' ? 'الطالب' : 'الموظف'}</span></div>
                                    <input type="checkbox" checked={formData.createLogin} onChange={e => setFormData({ ...formData, createLogin: e.target.checked })} className="w-5 h-5 rounded-lg border-2" />
                                 </div>

                                 {formData.createLogin && (
                                    <div className="space-y-4 animate-view px-2">
                                       <Field label="يوزر الدخول" value={formData.username} onChange={v => setFormData({ ...formData, username: v })} />
                                       <Field label="كلمة السر" type="password" value={formData.password} onChange={v => setFormData({ ...formData, password: v })} />
                                    </div>
                                 )}

                                 {mode === 'students' && (
                                    <div className="flex items-center justify-between p-4 bg-white rounded-2xl border mt-4">
                                       <div className="flex items-center gap-3"><UserCircle size={16} className="text-slate-400" /> <span className="text-xs font-bold">إنشاء يوزر دخول لولي الأمر</span></div>
                                       <input type="checkbox" checked={formData.createParentLogin} onChange={e => setFormData({ ...formData, createParentLogin: e.target.checked })} className="w-5 h-5 rounded-lg border-2" />
                                    </div>
                                 )}

                                 {formData.createParentLogin && mode === 'students' && (
                                    <div className="space-y-4 animate-view px-2">
                                       <Field label="يوزر ولي الأمر" value={formData.parentUsername} onChange={v => setFormData({ ...formData, parentUsername: v })} />
                                    </div>
                                 )}
                              </div>
                           </div>
                        </div>

                        <button onClick={handleAddAction} className="w-full py-6 bg-slate-950 text-white rounded-3xl font-black text-2xl shadow-3xl hover:bg-indigo-600 transition-all active:scale-95 flex items-center justify-center gap-4">
                           <UserCheck2 size={28} /> اعتماد وحفظ البيانات
                        </button>
                     </div>
                  ) : (
                     <div className="text-center py-20 p-12 space-y-8 animate-view">
                        <div className="w-28 h-28 bg-emerald-100 text-emerald-600 rounded-[2.5rem] flex items-center justify-center mx-auto border-2 border-emerald-200"><CheckCircle size={60} /></div>
                        <h3 className="text-4xl font-black">تم التسجيل بنجاح</h3>
                        <button onClick={() => setShowAddModal(false)} className="px-16 py-6 bg-slate-950 text-white rounded-3xl font-black text-xl active:scale-95 transition-all">العودة للوحة الإدارة</button>
                     </div>
                  )}
               </div>
            </div>
         )}
      </div>
   );
};

const Field = ({ label, value, onChange, type = 'text' }: any) => (
   <div className="space-y-1 text-right">
      <label className="text-[10px] font-black uppercase text-slate-400 px-2 tracking-widest">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} className="w-full p-4 rounded-2xl font-bold border border-slate-200 outline-none focus:border-indigo-600 bg-white transition-all shadow-inner" />
   </div>
);

export default ManagementModule;
