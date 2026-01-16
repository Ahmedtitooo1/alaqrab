
import React, { useState, useMemo } from 'react';
import {
   Users, Search, UserPlus, Mail, Phone, Edit3, Trash2,
   X, Shield, Briefcase, GraduationCap, Printer,
   DollarSign, Key, CheckCircle, ArrowUpRight, Filter,
   ShieldAlert, BookOpen, UserCheck, Smartphone, Info,
   Lock, User as UserIcon, UserMinus, Hash, UserCheck2,
   Activity, Layers, FileSpreadsheet, CreditCard, UserCircle, ChevronDown, QrCode, Scan
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { UserRole, User } from '../types';
import AttendanceScanner from './AttendanceScanner';

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
   const [showIdCard, setShowIdCard] = useState<User | null>(null);
   const [showScanner, setShowScanner] = useState(false);
   const [successStatus, setSuccessStatus] = useState(false);

   const [formData, setFormData] = useState<any>({
      firstName: '', lastName: '', phone: '', email: '',
      username: '', password: '',
      jobTitle: mode === 'teachers' ? 'معلم' : '',
      salary: 3000,
      createLogin: false,
      createParentLogin: false,
      parentName: '', parentPhone: '', parentEmail: '', parentUsername: '',
      teacherId: isTeacher ? currentUser?.id : '',
      teacherCapacity: 100
   });

   const teachers = useMemo(() => allUsers.filter(u => u.role === UserRole.TEACHER), [allUsers]);


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
            teacherIds: formData.teacherId ? [formData.teacherId] : [],
            phone: formData.phone,
            email: formData.email,
            status: 'active',
            aiQuestionsCount: 10
         };

         if (studentData.teacherIds && studentData.teacherIds[0]) {
            const firstTeacherId = studentData.teacherIds[0];
            const teacher = allUsers.find(u => u.id === firstTeacherId);
            if (teacher) {
               const currentCount = getStudentCountForTeacher(teacher.id);
               const capacity = teacher.maxStudents || teacher.teacherCapacity || 100;
               if (currentCount >= capacity) {
                  return alert(`عفواً، لقد وصل المعلم ${teacher.firstName} للحد الأقصى من الطلاب (${capacity})`);
               }
            }
         }

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
            status: 'active',
            teacherCapacity: mode === 'teachers' ? (formData.maxStudents || 100) : undefined,
            maxStudents: mode === 'teachers' ? (formData.maxStudents || 100) : undefined,
            aiQuestionsCount: 50
         }, formData.createLogin);
      }
      setSuccessStatus(true);
      addNotification({ title: 'نجاح العملية', content: 'تم تسجيل البيانات وتحديث قاعدة بيانات الفرع.', type: 'success', date: new Date().toISOString() });

      if (mode !== 'students') {
         addNotification({
            title: 'تنبيه مالي',
            content: `تم إضافة موظف جديد [${formData.firstName} ${formData.lastName}]، يرجى مراجعة واستيراد البيانات في كشف الرواتب.`,
            type: 'warning',
            date: new Date().toISOString()
         });
      }
   };

   const getStudentCountForTeacher = (teacherId: string) => {
      return allUsers.filter(u => u.role === UserRole.STUDENT && u.teacherId === teacherId).length;
   };

   const handlePrint = () => {
      window.print();
   };

   // Advanced Search Filters
   const [filterTeacher, setFilterTeacher] = useState('');

   const filteredUsers = useMemo(() => {
      return allUsers.filter(u => {
         if (mode === 'teachers') return u.role === UserRole.TEACHER;
         if (mode === 'employees') return [UserRole.ACCOUNTANT, UserRole.ADMIN].includes(u.role) && u.id !== currentUser?.id;
         if (mode === 'students') {
            const matchesRole = u.role === UserRole.STUDENT;
            const matchesTeacher = isTeacher ? u.teacherIds?.includes(currentUser.id) : (filterTeacher ? u.teacherIds?.includes(filterTeacher) : true);
            return matchesRole && matchesTeacher;
         }
         return false;
      }).filter(u => {
         const searchStr = (u.firstName + ' ' + u.lastName + ' ' + (u.code || '') + ' ' + (u.phone || '')).toLowerCase();
         return searchStr.includes(search.toLowerCase());
      });
   }, [allUsers, mode, search, currentUser, isTeacher, filterTeacher]);

   return (
      <div className="space-y-10 animate-view pb-20 text-right">
         <div className="flex flex-col md:flex-row justify-between items-center gap-6 no-print">
            <div className="flex items-center gap-6">
               <div className="p-5 rounded-[1.75rem] shadow-xl bg-indigo-600 text-white">
                  {mode === 'teachers' ? <GraduationCap size={32} /> : mode === 'students' ? <Users size={32} /> : <Briefcase size={32} />}
               </div>
               <div>
                  <h2 className="text-3xl font-black">{mode === 'teachers' ? 'إدارة المعلمون' : mode === 'students' ? 'كشف الطلاب' : 'إدارة الموظفين'}</h2>
                  <p className="text-slate-500 font-bold">تنظيم وتكويد الكوادر التعليمية والإدارية والطلاب.</p>
               </div>
            </div>
            <div className="flex gap-4">
               {mode === 'students' && (
                  <button onClick={() => setShowScanner(true)} className="p-5 bg-rose-50 border border-slate-200 text-rose-600 rounded-2xl hover:bg-rose-600 hover:text-white transition-all shadow-sm flex items-center gap-2" title="تسجيل الحضور">
                     <Scan size={24} /> <span className="hidden md:inline text-xs font-black">تسجيل الحضور</span>
                  </button>
               )}
               <button onClick={handlePrint} className="p-5 bg-white border border-slate-200 text-slate-400 rounded-2xl hover:text-indigo-600 transition-all shadow-sm"><Printer size={24} /></button>
               <button onClick={() => { setFormData({ ...formData, teacherId: isTeacher ? currentUser?.id : '', jobTitle: mode === 'teachers' ? 'معلم' : '' }); setShowAddModal(true); setSuccessStatus(false); }} className="px-8 py-4 bg-slate-950 text-white rounded-2xl font-black flex items-center gap-3 shadow-xl hover:bg-indigo-600 transition-all">
                  <UserPlus size={20} /> إضافة {mode === 'students' ? 'طالب' : mode === 'teachers' ? 'معلم' : 'موظف'} جديد
               </button>
            </div>
         </div>

         <div className="glass-panel border overflow-hidden bg-white rounded-[2.5rem] shadow-sm">
            <div className="p-8 border-b flex flex-col md:flex-row items-center gap-6 bg-slate-50/30 no-print">
               <div className="flex-1 flex items-center gap-4 bg-white border p-4 rounded-2xl shadow-inner">
                  <Search className="text-slate-300" />
                  <input value={search} onChange={e => setSearch(e.target.value)} placeholder="بحث بالاسم، الكود، أو الهاتف..." className="flex-1 bg-transparent border-none outline-none font-bold text-sm" />
               </div>

               {mode === 'students' && !isTeacher && (
                  <div className="flex items-center gap-3">
                     <Filter className="text-slate-400" size={18} />
                     <select value={filterTeacher} onChange={e => setFilterTeacher(e.target.value)} className="p-4 rounded-2xl font-bold border border-slate-200 bg-white outline-none text-xs">
                        <option value="">كل المعلمين</option>
                        {teachers.map(t => <option key={t.id} value={t.id}>م/ {t.firstName} {t.lastName}</option>)}
                     </select>
                  </div>
               )}

               {mode === 'students' && (
                  <div className="px-6 py-4 bg-indigo-50 text-indigo-700 rounded-2xl font-black text-xs">
                     الطلاب النشطون: {filteredUsers.length}
                  </div>
               )}
            </div>

            <div className="overflow-x-auto">
               <table className="w-full text-right min-w-[1000px]">
                  <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 border-b">
                     <tr>
                        <th className="p-6">الكود</th>
                        <th className="p-6">الاسم والبيانات</th>
                        <th className="p-6">التواصل</th>
                        {mode === 'teachers' && <th className="p-6 text-center">أحصائيات الطلاب</th>}
                        {mode === 'students' && <th className="p-6">المعلم التابع له</th>}
                        {mode === 'students' && <th className="p-6 text-center">المبلغ المستحق</th>}
                        <th className="p-6 text-center">الحالة</th>
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
                           {mode === 'teachers' && (
                              <td className="p-6 text-center">
                                 <div className="flex flex-col items-center gap-1">
                                    <div className="flex gap-2">
                                       <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-[10px] font-black">{getStudentCountForTeacher(u.id)} مشترك</span>
                                       <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-[10px] font-black">السعة: {u.maxStudents || u.teacherCapacity || 100}</span>
                                    </div>
                                    <div className="w-24 h-1 bg-slate-100 rounded-full overflow-hidden mt-1">
                                       <div className="h-full bg-indigo-500" style={{ width: `${Math.min(100, (getStudentCountForTeacher(u.id) / (u.maxStudents || u.teacherCapacity || 100)) * 100)}%` }}></div>
                                    </div>
                                 </div>
                              </td>
                           )}
                           {mode === 'students' && (
                              <td className="p-6">
                                 <div className="flex items-center gap-2 text-slate-500">
                                    <UserCircle size={14} />
                                    <span className="text-xs font-bold">{teachers.find(t => u.teacherIds?.includes(t.id))?.firstName || '---'}</span>
                                 </div>
                              </td>
                           )}
                           {mode === 'students' && <td className="p-6 text-center tabular-nums font-black text-emerald-600">{u.subscriptionAmount?.toLocaleString() || 0} ج.م</td>}
                           <td className="p-6 text-center">
                              <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${u.status === 'active' ? 'bg-emerald-50 text-emerald-600' : u.status === 'inactive' ? 'bg-slate-100 text-slate-400' : 'bg-rose-50 text-rose-600'}`}>
                                 {u.status || 'active'}
                              </span>
                           </td>
                           <td className="p-6 text-center">
                              <div className="flex justify-center gap-2 no-print">
                                 <button className="p-2 bg-slate-50 text-indigo-600 rounded-lg hover:bg-indigo-600 hover:text-white transition-all"><Edit3 size={14} /></button>
                                 <button className={`p-2 rounded-lg transition-all ${u.status === 'inactive' ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white' : 'bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white'}`} title={u.status === 'inactive' ? 'تفعيل' : 'إيقاف'}>
                                    {u.status === 'inactive' ? <UserCheck size={14} /> : <UserMinus size={14} />}
                                 </button>
                                 <button className="p-2 bg-slate-50 text-rose-600 rounded-lg hover:bg-rose-600 hover:text-white transition-all"><Trash2 size={14} /></button>
                                 {mode === 'students' && (
                                    <button onClick={() => setShowIdCard(u)} className="p-2 bg-slate-50 text-slate-600 rounded-lg hover:bg-indigo-600 hover:text-white transition-all" title="بطاقة الطالب"><QrCode size={14} /></button>
                                 )}
                              </div>
                           </td>
                        </tr>
                     ))}
                  </tbody>

               </table>
            </div>
         </div>

         {showAddModal && (
            <div className="fixed inset-0 z-[700] premium-modal-backdrop flex items-center justify-center p-6 no-print" onClick={() => setShowAddModal(false)}>
               <div className="premium-modal-content w-full max-w-5xl animate-view flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
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
                                 <>
                                    <div className="space-y-2">
                                       <label className="text-[10px] font-black text-slate-400 tracking-widest px-2">المسمى الوظيفي</label>
                                       <div className="flex gap-2">
                                          <input value={formData.jobTitle} onChange={e => setFormData({ ...formData, jobTitle: e.target.value })} className="flex-1 p-4 rounded-2xl font-bold border border-slate-200 outline-none" placeholder="محاسب، سكرتير، فني..." />
                                          <button onClick={() => setFormData({ ...formData, jobTitle: 'محاسب' })} className="px-4 bg-slate-100 rounded-xl text-[10px] font-black">محاسب</button>
                                       </div>
                                    </div>
                                    {mode === 'teachers' && (
                                       <div className="space-y-1">
                                          <label className="text-[10px] font-black text-slate-400 tracking-widest px-2 uppercase">السعة القصوى للطلاب (بشرط التعيين)</label>
                                          <input type="number" value={formData.maxStudents || 100} onChange={e => setFormData({ ...formData, maxStudents: parseInt(e.target.value) })} className="w-full p-4 rounded-2xl font-bold border border-slate-200 outline-none" />
                                       </div>
                                    )}
                                 </>
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
         {showIdCard && (
            <div className="fixed inset-0 z-[800] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-6 no-print" onClick={() => setShowIdCard(null)}>
               <div className="bg-white rounded-[2.5rem] w-full max-w-sm overflow-hidden shadow-2xl animate-view relative" onClick={e => e.stopPropagation()}>
                  <button onClick={() => setShowIdCard(null)} className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full hover:bg-rose-50 hover:text-rose-600 transition-all z-10"><X size={20} /></button>

                  <div className="h-32 bg-indigo-600 relative">
                     <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${showIdCard.username}`} className="w-24 h-24 rounded-full bg-white border-4 border-white shadow-lg" alt="student" />
                     </div>
                  </div>

                  <div className="pt-16 pb-8 px-6 text-center space-y-6">
                     <div>
                        <h3 className="text-xl font-black text-slate-900">{showIdCard.firstName} {showIdCard.lastName}</h3>
                        <p className="text-sm font-bold text-slate-400">{showIdCard.code}</p>
                     </div>

                     <div className="p-6 bg-white border-2 border-dashed border-slate-200 rounded-2xl inline-block">
                        <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${showIdCard.code}`} className="w-32 h-32" alt="QR Code" />
                     </div>

                     <div className="flex gap-2 justify-center">
                        <button onClick={() => window.print()} className="px-6 py-2 bg-slate-900 text-white rounded-xl font-black text-xs flex items-center gap-2"><Printer size={14} /> طباعة البطاقة</button>
                     </div>
                  </div>

                  {/* Print Version - Hidden unless printing */}
                  <div className="hidden print:block fixed inset-0 bg-white z-[9999] flex flex-col items-center justify-center text-center p-10 border-[10px] border-black">
                     <h1 className="text-4xl font-black mb-4">بطاقة هوية طالب</h1>
                     <img src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${showIdCard.code}`} className="w-64 h-64 mb-6 border-4 border-black p-2" alt="qr" />
                     <h2 className="text-6xl font-black mb-2">{showIdCard.firstName} {showIdCard.lastName}</h2>
                     <p className="text-3xl font-mono">{showIdCard.code}</p>
                  </div>
               </div>
            </div>
         )}

         {showScanner && <AttendanceScanner onClose={() => setShowScanner(false)} />}
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
