import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState('');

    const login = async (username, password) => {
        try {
            const response = await fetch('http://localhost:3001/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
    
            const data = await response.json();
            localStorage.setItem('accessToken', data.token);
            if (response.ok) {
                setUser(data);
                return { success: true, user: data };
            } else {
                throw new Error(data.message || "Failed to login");
            }
        } catch (error) {
            console.error("Login failed:", error);
            return { success: false, message: error.message };
        }
    };
    

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
