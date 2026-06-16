import { useRoutes, Navigate } from "react-router-dom";
import MainLayout from "../components/layout/main-layout";
import ProtectedRoute from "../components/protected-route";
import Homepage from "../pages/home/home-page";
import Requestpage from "../pages/request/request-page";
import RequestFormPage from "../pages/request/components/create-update-request/request-form-page";
import LoginPage from "../pages/auth/login-page";
import RegisterPage from "../pages/auth/register-page";
import AdminRequestPage from "../pages/admin/request-management-page";

const Router = () => {
    const element = useRoutes([
        // Public routes (no layout)
        {
            path: "login",
            element: <LoginPage />,
        },
        {
            path: "register",
            element: <RegisterPage />,
        },
        // Protected routes with MainLayout
        {
            element: (
                <ProtectedRoute>
                    <MainLayout />
                </ProtectedRoute>
            ),
            children: [
                {
                    path: "",
                    element: <Homepage />,
                },
                {
                    path: "request",
                    element: <Requestpage />,
                },
                {
                    path: "request/add",
                    element: <RequestFormPage />,
                },
                {
                    path: "request/:request_id/edit",
                    element: <RequestFormPage />,
                },
                // Admin routes
                {
                    path: "admin/requests",
                    element: (
                        <ProtectedRoute adminOnly>
                            <AdminRequestPage />
                        </ProtectedRoute>
                    ),
                },
            ],
        },
        // Catch-all redirect
        {
            path: "*",
            element: <Navigate to="/" replace />,
        },
    ]);
    return element;
};

export default Router;
