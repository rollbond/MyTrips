import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./layout/MainLayout";

import Dashboard from "./pages/Dashboard";
import Trips from "./pages/Trips";
import Map from "./pages/Map";
import Profiles from "./pages/Profiles";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
	return (
		<BrowserRouter>
			<Routes>
				{/* AUTH */}

				<Route path="/login" element={<Login />} />

				<Route path="/register" element={<Register />} />

				<Route path="/forgot-password" element={<ForgotPassword />} />

				<Route path="/reset-password" element={<ResetPassword />} />

				{/* GESCHÜTZTER BEREICH */}

				<Route
					element={
						<ProtectedRoute>
							<MainLayout />
						</ProtectedRoute>
					}
				>
					<Route path="/" element={<Dashboard />} />

					<Route path="/trips" element={<Trips />} />

					<Route path="/map" element={<Map />} />

					<Route path="/profiles" element={<Profiles />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}
