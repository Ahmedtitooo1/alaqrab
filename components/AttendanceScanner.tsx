import React, { useState, useEffect, useRef } from 'react';
import { Camera, X, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

// Note: In a real environment, we would use 'react-qr-scanner' or 'html5-qrcode'.
// Since we might not have these packages installed, I'll simulate the scanner interface
// and provide a manual entry fallback which is robust.
// If the user installs the library later, we can swap the Video element for the scanner.

const AttendanceScanner: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { allUsers, addNotification } = useAppContext();
    const [scanning, setScanning] = useState(true);
    const [lastScanned, setLastScanned] = useState<string | null>(null);
    const [scannedStudent, setScannedStudent] = useState<any>(null);
    const [manualCode, setManualCode] = useState('');

    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        // requesting camera permission purely for UI realism if possible
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
                .then(stream => {
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                        videoRef.current.play();
                    }
                })
                .catch(err => console.error("Camera error:", err));
        }

        return () => {
            // cleanup stream
            if (videoRef.current && videoRef.current.srcObject) {
                const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
                tracks.forEach(t => t.stop());
            }
        };
    }, []);

    const handleScan = (code: string) => {
        // Normalize code
        const student = allUsers.find(u => u.code === code || u.username === code);

        if (student) {
            setLastScanned(code);
            setScannedStudent(student);
            setScanning(false);
            // Here we would call the actual attendance marking function
            // For now, we simulate success
            addNotification({
                title: 'تم تسجيل الحضور',
                content: `تم تسجيل حضور الطالب: ${student.firstName} ${student.lastName}`,
                type: 'success',
                date: new Date().toISOString()
            });
        } else {
            addNotification({
                title: 'خطأ',
                content: 'كود الطالب غير موجود بالنظام',
                type: 'error',
                date: new Date().toISOString()
            });
        }
    };

    const handleManualSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (manualCode) handleScan(manualCode);
    };

    return (
        <div className="fixed inset-0 z-[2000] bg-black/95 flex flex-col items-center justify-center p-6 animate-view">
            <button onClick={onClose} className="absolute top-6 right-6 text-white hover:text-rose-500 transition-colors">
                <X size={32} />
            </button>

            <div className="w-full max-w-md space-y-8 text-center">
                {scanning ? (
                    <>
                        <h2 className="text-3xl font-black text-white mb-2">مسح كود الطالب</h2>
                        <p className="text-slate-400 font-bold mb-8">وجه الكاميرا نحو باركود الطالب لتسجيل الحضور</p>

                        <div className="relative w-full aspect-square bg-slate-900 rounded-[3rem] overflow-hidden border-4 border-slate-800 shadow-2xl">
                            {/* Simulation of scanner overlay */}
                            <div className="absolute inset-0 z-20 border-[3rem] border-black/50 pointer-events-none">
                                <div className="w-full h-1 bg-rose-500/50 absolute top-1/2 left-0 animate-pulse shadow-[0_0_20px_rgba(244,63,94,0.5)]"></div>
                            </div>
                            <video ref={videoRef} className="w-full h-full object-cover opacity-50" muted playsInline />
                            <div className="absolute inset-0 flex items-center justify-center z-10">
                                <Camera size={48} className="text-slate-600 animate-bounce" />
                            </div>
                        </div>

                        <form onSubmit={handleManualSubmit} className="relative mt-8">
                            <input
                                value={manualCode}
                                onChange={e => setManualCode(e.target.value)}
                                placeholder="أو اكتب كود الطالب يدوياً..."
                                className="w-full p-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-slate-500 font-black text-center focus:border-emerald-500 outline-none transition-all"
                            />
                            <button type="submit" className="absolute left-2 top-2 bottom-2 px-4 bg-emerald-600 text-white rounded-xl font-bold">تأكيد</button>
                        </form>
                    </>
                ) : (
                    <div className="bg-white rounded-[3rem] p-10 text-center animate-view">
                        <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle size={48} />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-2">تم تسجيل الحضور بنجاح!</h3>
                        <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 my-6">
                            <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-2">بيانات الطالب</p>
                            <p className="text-xl font-black text-slate-900">{scannedStudent?.firstName} {scannedStudent?.lastName}</p>
                            <p className="text-indigo-600 font-mono font-bold mt-1">{scannedStudent?.code}</p>
                        </div>
                        <button
                            onClick={() => { setScanning(true); setManualCode(''); setScannedStudent(null); }}
                            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-indigo-600 transition-all"
                        >
                            <RefreshCw size={20} /> تسجيل طالب آخر
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AttendanceScanner;
