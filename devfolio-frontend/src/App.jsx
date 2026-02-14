import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProjectsPage from "./pages/ProjectsPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
	return (
		<Routes>
			{/* Public pages */}
			<Route path="/" element={<HomePage/>} />
			<Route path="/projects" element={<ProjectsPage />} />
			<Route path="/about" element={<AboutPage />} />
			<Route path="/contact" element={<ContactPage />} />
			
			{/* Admin routes */}
			<Route path="/admin/login" element={<AdminLogin />} />
			<Route
				path="/admin"
				element={
					<ProtectedRoute>
						<AdminDashboard />
					</ProtectedRoute>
				}
			/>
			
			{/* Catch-all redirect */}
			<Route path="*" element={<Navigate to="/" replace />} />
		</Routes>
	);
}
