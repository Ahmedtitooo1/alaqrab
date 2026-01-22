
import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Rocket, AlertTriangle } from 'lucide-react';
import mockAuthService from '../../services/mockAuth';

/**
 * Ensures user is authenticated before showing child routes.
 * Also handles the global Trial/Subscription banners.
 */
const ProtectedLayout: React.FC = () => {
    const { isAuthenticated, isLoading, tenant, logout } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return (
            <div className="flex flex-col gap-4 justify-center items-center h-screen">
                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-500 text-sm font-medium">Verifying Session...</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    const subscriptionStatus = tenant ? mockAuthService.checkSubscriptionStatus(tenant) : 'active';
    const trialEndDate = tenant?.trial_ends_at ? new Date(tenant.trial_ends_at) : new Date();
    const daysLeft = Math.ceil((trialEndDate.getTime() - Date.now()) / (1000 * 3600 * 24));

    return (
        <div className="flex flex-col min-h-screen bg-slate-50">

            {/* 🚀 Trial Banner */}
            {subscriptionStatus === 'trial' && (
                <div className="bg-slate-900 text-white p-3 flex justify-center items-center gap-4 shadow-sm">
                    <div className="flex items-center gap-2">
                        <Rocket size={18} className="text-blue-400 animate-pulse" />
                        <span className="text-sm font-medium">
                            You are on a Free Trial. <span className="text-blue-400 font-bold">{daysLeft} Days remaining.</span>
                        </span>
                    </div>
                    <button className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-1 px-4 rounded transition-colors">
                        Upgrade Now
                    </button>
                </div>
            )}

            {/* ⚠️ Grace Period Banner */}
            {subscriptionStatus === 'grace_period' && (
                <div className="bg-red-500 text-white p-3 flex justify-center items-center gap-4">
                    <AlertTriangle size={18} />
                    <span className="text-sm font-bold">
                        Subscription Expired. You have {Math.max(0, daysLeft + 3)} days left before suspension.
                    </span>
                    <button className="bg-white text-red-500 hover:bg-red-50 text-xs font-bold py-1 px-4 rounded transition-colors">
                        Pay Now
                    </button>
                </div>
            )}

            {/* Main Content Area */}
            <div className="flex-grow flex flex-col">
                <Outlet />
            </div>
        </div>
    );
};

export default ProtectedLayout;
