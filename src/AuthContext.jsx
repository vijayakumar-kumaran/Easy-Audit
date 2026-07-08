// src/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

// Create a context for authentication
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

    // Function to handle login and store user details
    const login = (userType, username) => {
        const userData = { userType, username };
        setUser(userData);
        // Optionally, persist the user data in localStorage for session persistence
        localStorage.setItem('user', JSON.stringify(userData));
    };

    // Function to handle logout
    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    // Toggle theme function
    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    // Load user data from localStorage on app load
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setUser(storedUser);
        }
    }, []);

    // Toggle body class on theme change
    useEffect(() => {
        document.body.className = theme === 'light' ? 'light-mode' : 'dark-mode';
        localStorage.setItem('theme', theme);
    }, [theme]);

    return (
        <AuthContext.Provider value={{ user, login, logout, setUser, theme, toggleTheme }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);
