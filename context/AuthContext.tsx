import React, { createContext, useContext, useState, useEffect } from 'react';
import mockAuthService, { AuthResponse, User } from '../services/mockAuth';

interface AuthContextType {
    user: User | null;
    token: string | null;
    tenant: any | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    login: (email, password) => Promise<void>;
    register: (data) => Promise<void>;
    logout: () => void;
    quickLogin: (role: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>(null!);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [tenant, setTenant] = useState<any | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Check local storage on mount
        const storedUser = localStorage.getItem('auth_user');
        const storedToken = localStorage.getItem('auth_token');
        const storedTenant = localStorage.getItem('auth_tenant');

        if (storedUser && storedToken && storedTenant) {
            setUser(JSON.parse(storedUser));
            setToken(storedToken);
            setTenant(JSON.parse(storedTenant));
        }
        setIsLoading(false);
    }, []);

    const persistAuthState = (data: AuthResponse) => {
        setUser(data.user);
        setToken(data.token);
        setTenant(data.tenant);

        localStorage.setItem('auth_user', JSON.stringify(data.user));
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('auth_tenant', JSON.stringify(data.tenant));
    };

    const login = async (email, password) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await mockAuthService.login(email, password);
            persistAuthState(response);
        } catch (err: any) {
            setError(err.message || 'Login failed');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const quickLogin = async (roleName: string) => {
        // Helper for dev mode to quickly login
        let email = '';
        if (roleName === 'ADMIN') email = 'admin@aleaqrab.com';
        if (roleName === 'TEACHER') email = 'teacher@demo.com';
        if (roleName === 'STUDENT') email = 'student@demo.com';
        if (roleName === 'ACCOUNTANT') email = 'accountant@demo.com';

        if (email) await login(email, 'password');
    }

    const register = async (data) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await mockAuthService.register(data);
            persistAuthState(response);
        } catch (err: any) {
            setError(err.message || 'Registration failed');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        setTenant(null);
        localStorage.removeItem('auth_user');
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_tenant');
    };

    return (
        <AuthContext.Provider value={{
            user,
            token,
            tenant,
            isAuthenticated: !!user,
            isLoading,
            error,
            login,
            register,
            logout,
            quickLogin
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
