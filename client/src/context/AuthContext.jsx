import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import api from '../services/api.js';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                if (decoded.exp * 1000 < Date.now()) {
                    localStorage.removeItem("token");
                    setLoading(false);
                    return;
                }
                api.get("/api/users/me")
                    .then(res => {
                        setUser(res.data.user || null);
                        setLoading(false);
                    })
                    .catch(() => {
                        setUser(null);
                        setLoading(false);
                    });
            } catch {
                localStorage.removeItem("token");
                setUser(null);
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
};