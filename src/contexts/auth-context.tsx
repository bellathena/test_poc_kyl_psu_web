import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { authService } from "../services/auth";
import type { AuthUser, LoginResponse } from "../services/auth/types/response";
import type { LoginRequest, RegisterRequest } from "../services/auth/types/request";
import { UserRole } from "../const/enum/user-role";

const TOKEN_KEY = "access_token";
const USER_KEY = "auth_user";

interface AuthContextType {
    user: AuthUser | null;
    token: string | null;
    isAuthenticated: boolean;
    isAdmin: boolean;
    isLoading: boolean;
    login: (data: LoginRequest) => Promise<LoginResponse>;
    register: (data: RegisterRequest) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getStoredToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
}

function getStoredUser(): AuthUser | null {
    try {
        const raw = localStorage.getItem(USER_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

function setStoredAuth(token: string, user: AuthUser): void {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function clearStoredAuth(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(getStoredUser);
    const [token, setToken] = useState<string | null>(getStoredToken);
    const [isLoading, setIsLoading] = useState(true);

    const isAuthenticated = !!token && !!user;
    const isAdmin = user?.role === UserRole.ADMIN;

    // On mount: validate existing token by calling getMe
    useEffect(() => {
        const storedToken = getStoredToken();
        if (storedToken) {
            authService
                .getMe()
                .then((me) => {
                    const storedUser = getStoredUser();
                    if (storedUser) {
                        // Merge fresh data with stored data (getMe returns subset)
                        setUser({ ...storedUser, ...me });
                    }
                })
                .catch(() => {
                    // Token invalid → clear
                    clearStoredAuth();
                    setToken(null);
                    setUser(null);
                })
                .finally(() => setIsLoading(false));
        } else {
            setIsLoading(false);
        }
    }, []);

    const login = useCallback(async (data: LoginRequest): Promise<LoginResponse> => {
        const response = await authService.login(data);
        setStoredAuth(response.access_token, response.user);
        setToken(response.access_token);
        setUser(response.user);
        return response;
    }, []);

    const register = useCallback(async (data: RegisterRequest) => {
        await authService.register(data);
    }, []);

    const logout = useCallback(() => {
        clearStoredAuth();
        setToken(null);
        setUser(null);
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isAuthenticated,
                isAdmin,
                isLoading,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
