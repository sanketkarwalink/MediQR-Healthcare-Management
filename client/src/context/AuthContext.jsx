import { createContext, useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                console.log("Token: ", token);
                const decoded = jwtDecode(token);
                if(decoded.exp * 1000 < Date.now()){
                    console.log("Token expired");
                    localStorage.removeItem("token");
                    return;
                }
                setUser(decoded);
            } catch (error) {
                console.error("Invalid token", error);
                localStorage.removeItem("token"); // Clear invalid token
                setUser(null);
            }
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};