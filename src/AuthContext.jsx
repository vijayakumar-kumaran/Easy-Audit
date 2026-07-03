// src/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

// Create a context for authentication
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // Function to handle login and store user details
    const login = (userType, username, avatar) => {
        const userData = { 
            userType, 
            username, 
            avatar: avatar || "" 
        };
        setUser(userData);
        // Optionally, persist the user data in localStorage for session persistence
        localStorage.setItem('user', JSON.stringify(userData));
    };

    // Function to handle logout
    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    // Load user data from localStorage on app load
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setUser(storedUser);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);
