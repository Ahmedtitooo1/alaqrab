import React, { useRef } from 'react';
import { Download, X, ScanLine, QrCode } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
// import html2canvas from 'html2canvas'; // Missing dependency
// import QRCode from 'react-qr-code'; // Missing/failed dependency
// import Barcode from 'react-barcode'; // Missing/failed dependency

interface StudentIDCardProps {
    onClose: () => void;
}

const StudentIDCard: React.FC<StudentIDCardProps> = ({ onClose }) => {
    const { user, systemLogo, systemName } = useAppContext();
    const cardRef = useRef<HTMLDivElement>(null);

    const handleDownload = async () => {
        alert("Downloading requires 'html2canvas' to be installed. Please run: npm install html2canvas react-qr-code react-barcode");
        /*
        if (!cardRef.current) return;
        const canvas = await html2canvas(cardRef.current, { scale: 3 });
        const link = document.createElement('a');
        link.download = `student-id-${user?.code}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        */
    };

    if (!user) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <div className="relative animate-view max-w-sm w-full">
                <button
                    onClick={onClose}
                    className="absolute -top-12 right-0 p-2 text-white/50 hover:text-white transition-colors"
                >
                    <X size={32} />
                </button>

                <div className="bg-white rounded-[2rem] overflow-hidden shadow-3xl" ref={cardRef}>
                    {/* Header */}
                    <div className="bg-slate-900 p-6 text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 blur-[50px] rounded-full"></div>
                        <div className="relative z-10">
                            <img src={systemLogo} className="w-16 h-16 mx-auto mb-3 object-contain brightness-0 invert" alt="logo" />
                            <h2 className="text-xl font-black text-white uppercase tracking-widest">{systemName}</h2>
                            <p className="text-[10px] text-blue-400 font-bold uppercase tracking-[0.2em] mt-1">Student Identity Card</p>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="p-8 text-center space-y-6">
                        <div className="relative inline-block">
                            <div className="w-32 h-32 rounded-[2rem] p-1 bg-gradient-to-br from-blue-500 to-indigo-600 mx-auto shadow-xl">
                                <img
                                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                                    className="w-full h-full rounded-[1.8rem] bg-white object-cover"
                                    alt="Student"
                                />
                            </div>
                            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-full border-2 border-white">
                                {user.role}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-2xl font-black text-slate-900">{user.firstName} {user.lastName}</h3>
                            <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest">ID: {user.code}</p>
                        </div>

                        <div className="space-y-6 pt-4 border-t border-slate-100">
                            {/* QR Code Placeholder */}
                            <div className="flex justify-center flex-col items-center gap-2">
                                {/* <QRCode value={user.code} size={96} /> */}
                                <div className="w-24 h-24 bg-slate-100 rounded-xl flex items-center justify-center border-2 border-slate-200 border-dashed text-slate-400">
                                    <QrCode size={40} />
                                </div>
                                <span className="text-[9px] text-slate-400 font-bold">QR Code</span>
                            </div>

                            {/* Barcode Placeholder */}
                            <div className="flex justify-center opacity-80 flex-col items-center gap-2">
                                {/* <Barcode value={user.code} width={1.5} height={40} displayValue={false} /> */}
                                <div className="h-12 w-48 bg-slate-100 rounded-lg flex items-center justify-center border-slate-200 border-dashed border text-slate-400">
                                    <ScanLine size={20} />
                                </div>
                                <span className="text-[9px] text-slate-400 font-bold">{user.code}</span>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="bg-slate-50 p-4 border-t border-slate-100 text-center">
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Valid for Academic Year 2024-2025</p>
                    </div>
                </div>

                <div className="mt-8 flex justify-center">
                    <button
                        onClick={handleDownload}
                        className="px-8 py-4 bg-indigo-600 text-white rounded-full font-black flex items-center gap-3 shadow-xl hover:bg-indigo-700 transition-all hover:scale-105 active:scale-95"
                    >
                        <Download size={20} /> تحميل البطاقة
                    </button>
                    <div className="text-[10px] text-slate-400 mt-2 text-center w-full absolute -bottom-8">
                        Dependency missing: install html2canvas & react-qr-code
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentIDCard;
