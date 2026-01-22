
import React, { useState, useEffect, useRef } from 'react';
import { Send, Search, MoreVertical, Phone, Video, User, CheckCheck, Smile, Paperclip } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { UserRole } from '../types';

interface Contact {
  id: string;
  name: string;
  role: UserRole;
  avatar: string;
  lastMessage: string;
  time: string;
  unread?: number;
  online: boolean;
}

interface Message {
  id: string;
  senderId: string;
  text: string;
  time: string;
  isMe: boolean;
}

interface ChatSystemProps {
  currentUserRole: UserRole;
}

const ChatSystem: React.FC<ChatSystemProps> = ({ currentUserRole }) => {
  const { t, lang, theme } = useAppContext();
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isRtl = lang === 'ar';

  // Simulated contacts based on role
  const allContacts: Contact[] = [
    { id: '1', name: 'م/ محمود العزازي', role: UserRole.TEACHER, avatar: 'Teacher1', lastMessage: 'هل تم الانتهاء من الدرس؟', time: '10:30 AM', online: true },
    { id: '2', name: 'ولي أمر/ أحمد محمد', role: UserRole.PARENT, avatar: 'Parent1', lastMessage: 'شكراً جزيلاً لاهتمامكم', time: '09:15 AM', online: false, unread: 2 },
    { id: '3', name: 'أحمد علي (طالب)', role: UserRole.STUDENT, avatar: 'Student1', lastMessage: 'ممكن إعادة شرح النقطة الأخيرة؟', time: 'أمس', online: true },
    { id: '4', name: 'مدير المنصة', role: UserRole.ADMIN, avatar: 'Admin1', lastMessage: 'يرجى مراجعة الجدول الجديد', time: 'أمس', online: true },
    { id: '5', name: 'المحاسب المالي', role: UserRole.ACCOUNTANT, avatar: 'Accountant1', lastMessage: 'تم تحويل الراتب لشهر أكتوبر', time: 'قبل يومين', online: false },
  ];

  // Filter contacts based on who can talk to whom
  const contacts = allContacts.filter(c => {
    if (currentUserRole === UserRole.TEACHER) return true; // Teacher talks to everyone
    if (currentUserRole === UserRole.STUDENT) return c.role === UserRole.TEACHER; // Student only to teachers
    if (currentUserRole === UserRole.PARENT) return c.role === UserRole.TEACHER || c.role === UserRole.ADMIN;
    if (currentUserRole === UserRole.ACCOUNTANT) return c.role === UserRole.TEACHER || c.role === UserRole.ADMIN;
    if (currentUserRole === UserRole.ADMIN) return true;
    return false;
  }).filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const [messages, setMessages] = useState<Message[]>([
    { id: '1', senderId: 'other', text: 'أهلاً بك، كيف يمكنني مساعدتك اليوم؟', time: '10:00 AM', isMe: false },
    { id: '2', senderId: 'me', text: 'كنت أريد الاستفسار عن موعد الحصة القادمة', time: '10:05 AM', isMe: true },
  ]);

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    const newMsg: Message = {
      id: Date.now().toString(),
      senderId: 'me',
      text: messageText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
    };
    setMessages([...messages, newMsg]);
    setMessageText('');
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className={`flex h-[calc(100vh-140px)] rounded-[2.5rem] overflow-hidden border shadow-2xl ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
      {/* Contacts List */}
      <div className={`w-full md:w-96 flex flex-col border-r dark:border-slate-800 ${selectedContact ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-6 border-b dark:border-slate-800">
          <h2 className="text-xl font-black mb-4">{t('messages')}</h2>
          <div className="relative">
            <Search className={`absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-gray-400`} size={18} />
            <input 
              type="text" 
              placeholder={t('search_placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-2xl py-3 px-10 text-xs font-bold outline-none focus:ring-2 focus:ring-amber-500/20"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar p-2">
          {contacts.map((contact) => (
            <button
              key={contact.id}
              onClick={() => setSelectedContact(contact)}
              className={`w-full flex items-center gap-4 p-4 rounded-[2rem] transition-all mb-1 ${selectedContact?.id === contact.id ? 'bg-amber-500 text-slate-900' : 'hover:bg-gray-50 dark:hover:bg-slate-800'}`}
            >
              <div className="relative">
                <img 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${contact.avatar}`} 
                  className="w-12 h-12 rounded-2xl bg-white/20 p-1"
                  alt="avatar"
                />
                {contact.online && (
                  <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full"></div>
                )}
              </div>
              <div className="flex-1 text-right">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="font-black text-sm">{contact.name}</h4>
                  <span className={`text-[9px] font-bold ${selectedContact?.id === contact.id ? 'text-slate-800' : 'text-gray-400'}`}>{contact.time}</span>
                </div>
                <div className="flex justify-between items-center">
                  <p className={`text-xs truncate max-w-[150px] ${selectedContact?.id === contact.id ? 'text-slate-800' : 'text-gray-500'}`}>{contact.lastMessage}</p>
                  {contact.unread && (
                    <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">{contact.unread}</span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`flex-1 flex flex-col ${!selectedContact ? 'hidden md:flex items-center justify-center bg-gray-50 dark:bg-slate-950/50' : 'flex'}`}>
        {selectedContact ? (
          <>
            {/* Chat Header */}
            <div className="p-6 border-b dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button className="md:hidden" onClick={() => setSelectedContact(null)}>
                  <MoreVertical className={isRtl ? 'rotate-180' : ''} />
                </button>
                <img 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedContact.avatar}`} 
                  className="w-12 h-12 rounded-2xl bg-amber-500/10 p-1"
                  alt="avatar"
                />
                <div>
                  <h3 className="font-black text-base">{selectedContact.name}</h3>
                  <p className="text-[10px] font-bold text-green-500">{selectedContact.online ? t('online') : t('offline')}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-3 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-2xl transition-all"><Phone size={20} className="text-gray-500" /></button>
                <button className="p-3 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-2xl transition-all"><Video size={20} className="text-gray-500" /></button>
                <button className="p-3 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-2xl transition-all"><MoreVertical size={20} className="text-gray-500" /></button>
              </div>
            </div>

            {/* Messages List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar bg-gray-50/50 dark:bg-slate-950/20">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] group ${msg.isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                    <div className={`p-4 rounded-[2rem] text-sm shadow-sm ${msg.isMe ? 'bg-amber-500 text-slate-900 rounded-br-none' : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-bl-none'}`}>
                      {msg.text}
                    </div>
                    <div className="flex items-center gap-2 mt-1 px-2">
                      <span className="text-[9px] font-bold text-gray-400 uppercase">{msg.time}</span>
                      {msg.isMe && <CheckCheck size={12} className="text-blue-500" />}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-6 border-t dark:border-slate-800">
              <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800 p-2 rounded-[2rem]">
                <button className="p-3 text-gray-400 hover:text-amber-500 transition-colors"><Smile size={24} /></button>
                <button className="p-3 text-gray-400 hover:text-amber-500 transition-colors"><Paperclip size={24} /></button>
                <input 
                  type="text" 
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder={t('type_message')}
                  className="flex-1 bg-transparent border-none outline-none text-sm font-medium py-2 px-2"
                />
                <button 
                  onClick={handleSendMessage}
                  disabled={!messageText.trim()}
                  className="p-4 bg-amber-500 text-slate-900 rounded-full shadow-lg hover:scale-105 transition-all disabled:opacity-50"
                >
                  <Send size={20} className={isRtl ? 'rotate-180' : ''} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center">
            <div className="w-24 h-24 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Send size={48} className={isRtl ? 'rotate-180' : ''} />
            </div>
            <h3 className="text-2xl font-black mb-2">{t('messages')}</h3>
            <p className="text-gray-500 font-bold">{isRtl ? 'اختر جهة اتصال لبدء المحادثة' : 'Select a contact to start chatting'}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatSystem;
