import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
    const token = localStorage.getItem("token");

    // if not logged in, redirect to login page
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // if logged in, render the child components
    return children;
}
