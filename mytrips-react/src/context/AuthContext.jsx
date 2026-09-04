import { createContext, useContext, useEffect, useState } from "react";

import {
	loginUser,
	registerUser,
	forgotPasswordRequest,
	resetPasswordRequest,
} from "../api/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null);

	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const savedUser = localStorage.getItem("mytrips_user");

		if (savedUser) {
			setUser(JSON.parse(savedUser));
		}

		setLoading(false);
	}, []);

	async function login(email, password) {
		try {
			const response = await loginUser(email, password);

			if (response.success) {
				setUser(response.user);

				localStorage.setItem(
					"mytrips_user",

					JSON.stringify(response.user),
				);
			}

			return response;
		} catch (error) {
			console.error("Login failed:", error);

			throw error;
		}
	}

	async function register(data) {
		try {
			return await registerUser(data);
		} catch (error) {
			console.error("Register failed:", error);

			throw error;
		}
	}

	async function forgotPassword(email) {
		try {
			return await forgotPasswordRequest(email);
		} catch (error) {
			console.error("Forgot password failed:", error);

			throw error;
		}
	}

	async function resetPassword(token, password) {
		try {
			return await resetPasswordRequest(token, password);
		} catch (error) {
			console.error("Reset password failed:", error);

			throw error;
		}
	}

	function logout() {
		setUser(null);

		localStorage.removeItem("mytrips_user");

		localStorage.removeItem("activeProfileId");
	}

	return (
		<AuthContext.Provider
			value={{
				user,

				loading,

				login,

				register,

				forgotPassword,

				resetPassword,

				logout,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);

	if (!context) {
		throw new Error("useAuth must be used inside AuthProvider");
	}

	return context;
}
