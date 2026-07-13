import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Guarda { username, rol }
    const [token, setToken] = useState(localStorage.getItem('token') || null);

    // Si al arrancar la app ya hay un token, podríamos decodificarlo.
    // De momento, guardamos una estructura básica en el estado.
    useEffect(() => {
        const storedRole = localStorage.getItem('rol');
        const storedUser = localStorage.getItem('username');
        if (token && storedRole) {
            setUser({ username: storedUser, rol: storedRole });
        }
    }, [token]);

    const loginUser = (jwtToken, username, rol) => {
        localStorage.setItem('token', jwtToken);
        localStorage.setItem('username', username);
        localStorage.setItem('rol', rol);
        setToken(jwtToken);
        setUser({ username, rol });
    };

    const logoutUser = () => {
        localStorage.clear();
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, loginUser, logoutUser }}>
            {children}
        </AuthContext.Provider>
    );
};