import React, { useState } from 'react';
import { Database, Trash2, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { seedTestDatabase, cleanupTestData } from '../utils/seedData';
import { testConnection } from '../lib/supabaseClient';

/**
 * 🔧 ADMIN SEEDER PANEL
 * Temporary component for database seeding during deployment phase
 * Remove this from production!
 */

const DatabaseSeederPanel: React.FC = () => {
    const [status, setStatus] = useState<'idle' | 'seeding' | 'cleaning' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');
    const [connectionOk, setConnectionOk] = useState<boolean | null>(null);

    const handleTestConnection = async () => {
        setStatus('idle');
        setMessage('Testing connection...');
        const result = await testConnection();
        setConnectionOk(result);
        setMessage(result ? '✅ Connection successful!' : '❌ Connection failed. Check console.');
    };

    const handleSeed = async () => {
        if (!confirm('⚠️ This will create 6 months of test data. Continue?')) return;

        setStatus('seeding');
        setMessage('🚀 Seeding database... This may take 30-60 seconds.');

        try {
            const result = await seedTestDatabase();

            if (result.success) {
                setStatus('success');
                setMessage(`✅ Seeding complete! 
                    Created: ${result.data.stats.students} students, 
                    ${result.data.stats.transactions} transactions, 
                    ${result.data.stats.examResults} exam results.`);
            } else {
                setStatus('error');
                setMessage(`❌ Seeding failed: ${result.error}`);
            }
        } catch (error) {
            setStatus('error');
            setMessage(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };

    const handleCleanup = async () => {
        if (!confirm('⚠️ This will DELETE all test data! Are you sure?')) return;

        setStatus('cleaning');
        setMessage('🧹 Cleaning up test data...');

        try {
            const result = await cleanupTestData();

            if (result.success) {
                setStatus('success');
                setMessage('✅ Cleanup complete! All test data removed.');
            } else {
                setStatus('error');
                setMessage('❌ Cleanup failed. Check console.');
            }
        } catch (error) {
            setStatus('error');
            setMessage(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-8 space-y-6">
            {/* Warning Banner */}
            <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-xl">
                <div className="flex items-center gap-3">
                    <AlertCircle className="text-amber-600" size={24} />
                    <div>
                        <h3 className="font-black text-amber-900">⚠️ DEPLOYMENT TOOL - REMOVE IN PRODUCTION</h3>
                        <p className="text-sm text-amber-700 mt-1">
                            This panel is for initial database setup only. Delete this component after deployment!
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Panel */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-4 bg-indigo-100 rounded-xl">
                        <Database className="text-indigo-600" size={32} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-slate-900">Database Seeder</h2>
                        <p className="text-slate-500 font-bold">Supabase Test Data Generator</p>
                    </div>
                </div>

                {/* Connection Test */}
                <div className="mb-6 p-4 bg-slate-50 rounded-xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-bold text-slate-700">Connection Status</p>
                            <p className="text-xs text-slate-500">Test your Supabase connection</p>
                        </div>
                        <button
                            onClick={handleTestConnection}
                            className="px-4 py-2 bg-slate-900 text-white rounded-xl font-bold text-xs hover:bg-slate-700 transition-all"
                        >
                            Test Connection
                        </button>
                    </div>
                    {connectionOk !== null && (
                        <div className={`mt-3 p-3 rounded-lg ${connectionOk ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                            <p className="text-xs font-bold">{connectionOk ? '✅ Connected to Supabase' : '❌ Connection Failed'}</p>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <button
                        onClick={handleSeed}
                        disabled={status === 'seeding' || status === 'cleaning'}
                        className="flex items-center justify-center gap-3 p-6 bg-indigo-600 text-white rounded-xl font-black hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {status === 'seeding' ? (
                            <>
                                <Loader className="animate-spin" size={20} />
                                Seeding...
                            </>
                        ) : (
                            <>
                                <Database size={20} />
                                Seed 6 Months Data
                            </>
                        )}
                    </button>

                    <button
                        onClick={handleCleanup}
                        disabled={status === 'seeding' || status === 'cleaning'}
                        className="flex items-center justify-center gap-3 p-6 bg-rose-600 text-white rounded-xl font-black hover:bg-rose-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {status === 'cleaning' ? (
                            <>
                                <Loader className="animate-spin" size={20} />
                                Cleaning...
                            </>
                        ) : (
                            <>
                                <Trash2 size={20} />
                                Cleanup Test Data
                            </>
                        )}
                    </button>
                </div>

                {/* Status Message */}
                {message && (
                    <div className={`p-4 rounded-xl border ${status === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-900' :
                            status === 'error' ? 'bg-rose-50 border-rose-200 text-rose-900' :
                                'bg-blue-50 border-blue-200 text-blue-900'
                        }`}>
                        <div className="flex items-start gap-3">
                            {status === 'success' && <CheckCircle size={20} className="mt-0.5 flex-shrink-0" />}
                            {status === 'error' && <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />}
                            {(status === 'seeding' || status === 'cleaning') && <Loader size={20} className="animate-spin mt-0.5 flex-shrink-0" />}
                            <p className="text-sm font-bold whitespace-pre-line">{message}</p>
                        </div>
                    </div>
                )}

                {/* Instructions */}
                <div className="mt-8 p-6 bg-slate-50 rounded-xl border border-slate-200">
                    <h3 className="font-black text-slate-900 mb-4">📚 Instructions</h3>
                    <ol className="space-y-2 text-sm text-slate-700">
                        <li className="flex gap-2">
                            <span className="font-black">1.</span>
                            <span>Make sure you've run the <code className="px-2 py-0.5 bg-slate-200 rounded font-mono text-xs">supabase/schema.sql</code> in Supabase SQL Editor</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="font-black">2.</span>
                            <span>Test the connection using the button above</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="font-black">3.</span>
                            <span>Click "Seed 6 Months Data" to generate test data</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="font-black">4.</span>
                            <span>Wait 30-60 seconds for completion</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="font-black text-rose-600">⚠️</span>
                            <span className="text-rose-600 font-bold">Delete this component before production deployment!</span>
                        </li>
                    </ol>
                </div>
            </div>
        </div>
    );
};

export default DatabaseSeederPanel;
