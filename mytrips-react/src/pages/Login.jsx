import { useState } from "react";

import {
	Container,
	Card,
	CardContent,
	Typography,
	TextField,
	Button,
	Box,
	Alert,
	Link,
} from "@mui/material";

import { Link as RouterLink, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function Login() {
	const { login } = useAuth();

	const navigate = useNavigate();

	const [form, setForm] = useState({
		email: "",
		password: "",
	});

	const [error, setError] = useState("");

	const [loading, setLoading] = useState(false);

	function handleChange(e) {
		setForm({
			...form,

			[e.target.name]: e.target.value,
		});
	}

	async function handleSubmit(e) {
		e.preventDefault();

		try {
			setLoading(true);

			setError("");

			const result = await login(form.email, form.password);

			if (result.success) {
				navigate("/");
			} else {
				setError(result.message || "Login fehlgeschlagen");
			}
		} catch (error) {
			setError("Login fehlgeschlagen");
		} finally {
			setLoading(false);
		}
	}

	return (
		<Container maxWidth="sm">
			<Card
				sx={{
					mt: 8,
				}}
			>
				<CardContent>
					<Typography
						variant="h4"
						sx={{
							mb: 3,
						}}
					>
						🌍 MyTrips Login
					</Typography>

					{error && (
						<Alert
							severity="error"
							sx={{
								mb: 2,
							}}
						>
							{error}
						</Alert>
					)}

					<Box component="form" onSubmit={handleSubmit}>
						<TextField
							fullWidth
							label="E-Mail"
							name="email"
							type="email"
							margin="normal"
							value={form.email}
							onChange={handleChange}
						/>

						<TextField
							fullWidth
							label="Passwort"
							name="password"
							type="password"
							margin="normal"
							value={form.password}
							onChange={handleChange}
						/>

						<Button
							fullWidth
							variant="contained"
							type="submit"
							sx={{
								mt: 2,
							}}
							disabled={loading}
						>
							{loading ? "Anmelden..." : "Anmelden"}
						</Button>
					</Box>

					<Box
						sx={{
							mt: 3,
							display: "flex",
							flexDirection: "column",
							gap: 1,
						}}
					>
						<Link component={RouterLink} to="/register">
							Neues Konto erstellen
						</Link>

						<Link component={RouterLink} to="/forgot-password">
							Passwort vergessen?
						</Link>
					</Box>
				</CardContent>
			</Card>
		</Container>
	);
}
