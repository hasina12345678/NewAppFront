import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/serv_authentification';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        setLoading(true);
        if (authService.isAuthenticated()) {
            try {
                const result = await authService.getCurrentCustomer();
                setUser(result.data);
                setIsAdmin(result.data?.email === 'admin@gmail.com');
            } catch (error) {
                console.error('Auth check failed:', error);
                authService.logout();
                setUser(null);
                setIsAdmin(false);
            }
        }
        setLoading(false);
    };

    const login = async (email, password) => {
        const result = await authService.login(email, password);
        if (result.data) {
            setUser(result.data);
            const isAdminUser = result.data.email === 'admin@gmail.com';
            setIsAdmin(isAdminUser);
            
            if (isAdminUser) {
                window.location.href = '/admin/home';
            } else {
                window.location.href = '/client/home';
            }
        }
        return result;
    };

    const register = async (userData) => {
        const result = await authService.register(userData);
        if (result.message && result.message.includes('success')) {
            window.location.href = '/login';
        }
        return result;
    };

    const logout = async () => {
        await authService.logout();
        setUser(null);
        setIsAdmin(false);
    };

    const value = {
        user,
        loading,
        isAdmin,
        login,
        register,
        logout,
        isAuthenticated: authService.isAuthenticated,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};