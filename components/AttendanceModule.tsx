
import React, { useState } from 'react';
import {
   Users, Calendar, Search,
   CheckCircle2, XCircle, Clock, AlertCircle,
   FileSpreadsheet, Filter, ChevronDown,
   Save, UserCheck, ShieldCheck
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import * as XLSX from 'xlsx';

const AttendanceModule: React.FC = () => {
   const { lang, t, isRtl, allUsers } = useAppContext();
   const [selectedClass, setSelectedClass] = useState('Group A');
   const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
   const [searchTerm, setSearchTerm] = useState('');

   // Mock Attendance Data
   const students = allUsers.filter(u => u.role === 'student');
   const [attendance, setAttendance] = useState<Record<string, string>>(
      students.reduce((acc, s) => ({ ...acc, [s.id]: 'present' }), {})
   );

   const toggleStatus = (id: string, status: string) => {
      setAttendance(prev => ({ ...prev, [id]: status }));
   };

   const exportToExcel = () => {
      const data = students.map(s => ({
         'Student Name': `${s.firstName} ${s.lastName}`,
         'ID': s.code,
         'Date': currentDate,
         'Status': attendance[s.id] || 'N/A'
      }));

      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance');
      XLSX.writeFile(workbook, `Attendance_${selectedClass}_${currentDate}.xlsx`);
   };

   return (
      <div className="space-y-10 animate-view pb-16">
         {/* 1. Module Header */}
         <div className="glass-card p-10 bg-white border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8 rounded-[3rem] shadow-xl">
            <div className="flex items-center gap-6">
               <div className="p-6 bg-indigo-600 text-white rounded-[2rem] shadow-xl shadow-indigo-600/20"><UserCheck size={40} /></div>
               <div>
                  <h2 className="text-3xl font-black text-slate-900">{isRtl ? 'دفتر الحضور والغياب' : 'Smart Attendance Ledger'}</h2>
                  <p className="text-slate-400 font-bold mt-1 uppercase tracking-widest text-xs">{isRtl ? 'إدارة حضور الطلاب آلياً' : 'Automated Student Tracking Management'}</p>
               </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
               <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 px-6 py-4 rounded-3xl">
                  <Calendar size={20} className="text-indigo-600" />
                  <input
                     type="date"
                     value={currentDate}
                     onChange={e => setCurrentDate(e.target.value)}
                     className="bg-transparent border-none outline-none font-black text-slate-900"
                  />
               </div>
               <button onClick={exportToExcel} className="p-5 bg-emerald-50 text-emerald-600 rounded-3xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm border border-emerald-100">
                  <FileSpreadsheet size={24} />
               </button>
            </div>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
            {/* 2. Filters & Stats Sidebar */}
            <div className="lg:col-span-1 space-y-8">
               <div className="glass-card p-10 bg-white border border-slate-100 rounded-[3rem] shadow-sm">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-8 border-b pb-4">{isRtl ? 'تصفية الفئات' : 'FILTERS & GROUPS'}</h4>
                  <div className="space-y-4">
                     {['Group A', 'Group B', 'VIP Section', 'Summer Camp'].map(group => (
                        <button
                           key={group}
                           onClick={() => setSelectedClass(group)}
                           className={`w-full p-5 rounded-2xl font-black text-sm flex items-center justify-between transition-all ${selectedClass === group ? 'bg-indigo-600 text-white shadow-xl' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                        >
                           {group}
                           {selectedClass === group && <ChevronDown size={18} />}
                        </button>
                     ))}
                  </div>
               </div>

               <div className="glass-card p-10 bg-slate-900 text-white rounded-[3rem] shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-8">{isRtl ? 'ملخص اليوم' : 'DAILY SUMMARY'}</h4>
                  <div className="grid grid-cols-2 gap-6">
                     <div className="text-center">
                        <p className="text-3xl font-black text-emerald-400">{Object.values(attendance).filter(v => v === 'present').length}</p>
                        <p className="text-[10px] font-black text-slate-400 mt-1 uppercase">{isRtl ? 'حضور' : 'Present'}</p>
                     </div>
                     <div className="text-center">
                        <p className="text-3xl font-black text-rose-400">{Object.values(attendance).filter(v => v === 'absent').length}</p>
                        <p className="text-[10px] font-black text-slate-400 mt-1 uppercase">{isRtl ? 'غياب' : 'Absent'}</p>
                     </div>
                  </div>
                  <div className="mt-8 pt-8 border-t border-white/10 flex items-center gap-3">
                     <ShieldCheck className="text-emerald-500" size={16} />
                     <p className="text-[10px] font-bold text-slate-400 italic">{isRtl ? 'البيانات مؤمنة ومشفرة' : 'Data is secured and synced'}</p>
                  </div>
               </div>
            </div>

            {/* 3. Student List & Controls */}
            <div className="lg:col-span-3 space-y-8">
               <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm relative z-10">
                  <div className={`flex items-center gap-4 bg-slate-50 px-6 py-3 rounded-2xl border-2 border-transparent focus-within:border-indigo-600 transition-all flex-1 max-w-md ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
                     <Search size={20} className="text-slate-400" />
                     <input
                        placeholder={isRtl ? 'ابحث عن اسم الطالب...' : 'Search for a student...'}
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className={`bg-transparent border-none outline-none font-bold text-sm w-full ${isRtl ? 'text-right' : 'text-left'}`}
                     />
                  </div>
                  <div className="flex gap-4">
                     <button className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-xs flex items-center gap-3 hover:bg-slate-800 transition-all">
                        <Save size={18} /> {isRtl ? 'حفظ الحضور' : 'Save Attendance'}
                     </button>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {students.filter(s => `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())).map(student => (
                     <div key={student.id} className="glass-card p-8 bg-white border border-slate-100 hover:border-indigo-100 hover:shadow-lg transition-all rounded-[2.5rem] flex flex-col items-center text-center gap-6 relative group overflow-hidden">
                        <div className={`absolute top-0 left-0 w-2 h-full transition-all ${attendance[student.id] === 'present' ? 'bg-emerald-500' : attendance[student.id] === 'absent' ? 'bg-rose-500' : 'bg-amber-500'}`}></div>

                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.username}`} className="w-20 h-20 rounded-2xl bg-slate-50 p-1 border-2 border-white shadow-md group-hover:scale-110 transition-transform" alt="Avatar" />

                        <div>
                           <h4 className="font-black text-lg text-slate-900">{student.firstName} {student.lastName}</h4>
                           <p className="text-[10px] font-black text-slate-400 tracking-widest mt-1">ID: {student.code}</p>
                        </div>

                        <div className="grid grid-cols-3 gap-3 w-full">
                           <button
                              onClick={() => toggleStatus(student.id, 'present')}
                              className={`p-4 rounded-2xl flex flex-col items-center gap-2 transition-all ${attendance[student.id] === 'present' ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-600/20' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                           >
                              <CheckCircle2 size={24} />
                              <span className="text-[9px] font-black uppercase tracking-widest">{isRtl ? 'حاضر' : 'Present'}</span>
                           </button>
                           <button
                              onClick={() => toggleStatus(student.id, 'absent')}
                              className={`p-4 rounded-2xl flex flex-col items-center gap-2 transition-all ${attendance[student.id] === 'absent' ? 'bg-rose-600 text-white shadow-xl shadow-rose-600/20' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                           >
                              <XCircle size={24} />
                              <span className="text-[9px] font-black uppercase tracking-widest">{isRtl ? 'غائب' : 'Absent'}</span>
                           </button>
                           <button
                              onClick={() => toggleStatus(student.id, 'late')}
                              className={`p-4 rounded-2xl flex flex-col items-center gap-2 transition-all ${attendance[student.id] === 'late' ? 'bg-amber-600 text-white shadow-xl shadow-amber-600/20' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                           >
                              <Clock size={24} />
                              <span className="text-[9px] font-black uppercase tracking-widest">{isRtl ? 'تأخير' : 'Late'}</span>
                           </button>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </div>
   );
};

export default AttendanceModule;
