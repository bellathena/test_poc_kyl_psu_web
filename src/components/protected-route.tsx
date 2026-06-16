import { Navigate } from "react-router-dom";
import { Spin } from "antd";
import { useAuth } from "../contexts/auth-context";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
    children: ReactNode;
    adminOnly?: boolean;
}

export default function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
    const { isAuthenticated, isAdmin, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
                <Spin size="large" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (adminOnly && !isAdmin) {
        return <Navigate to="/request" replace />;
    }

    return <>{children}</>;
}
