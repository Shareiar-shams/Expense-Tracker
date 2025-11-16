import { Navigate } from "react-router-dom";
import Navbar from "./Navbar";

export default function ProtectedRoute({ children }) {
    const token = localStorage.getItem("token");

    // if not logged in, redirect to login page
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // if logged in, render the child components with Navbar
    return (
        <>
            <Navbar />
            {children}
        </>
    );
}
