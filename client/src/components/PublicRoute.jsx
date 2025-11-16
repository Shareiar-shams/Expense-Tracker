import { Navigate } from "react-router-dom";

export default function PublicRoute({ children }) {
    const token = localStorage.getItem("token");

    // if already logged in, redirect to dashboard
    if (token) {
        return <Navigate to="/dashboard" replace />;
    }

    // if not logged in, render the child components (login/register page)
    return children;
}