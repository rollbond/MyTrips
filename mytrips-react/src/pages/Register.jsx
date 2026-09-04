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

export default function Register() {
	const { register } = useAuth();

	const navigate = useNavigate();

	const [form, setForm] = useState({
		username: "",
		email: "",
		password: "",
		passwordConfirm: "",
	});

	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [loading, setLoading] = useState(false);

	function handleChange(e) {
		setForm({
			...form,

			[e.target.name]: e.target.value,
		});
	}

	async function handleSubmit(e) {
		e.preventDefault();
		setError("");
		setSuccess("");

		if (form.password !== form.passwordConfirm) {
			setError("Die Passwörter stimmen nicht überein");
			return;
		}

		try {
			setLoading(true);
			//const result = await register(form.username, form.email, form.password);
			const result = await register({
				username: form.username,
				email: form.email,
				password: form.password,
			});
			if (result.success) {
				setSuccess(
					"Konto erfolgreich erstellt. Du kannst dich jetzt anmelden.",
				);

				setTimeout(() => {
					navigate("/login");
				}, 1500);
			} else {
				setError(result.message || "Registrierung fehlgeschlagen");
			}
		} catch (error) {
			setError("Registrierung fehlgeschlagen");
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
						🌍 MyTrips Registrierung
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

					{success && (
						<Alert
							severity="success"
							sx={{
								mb: 2,
							}}
						>
							{success}
						</Alert>
					)}

					<Box component="form" onSubmit={handleSubmit}>
						<TextField
							fullWidth
							label="Name"
							name="username"
							margin="normal"
							value={form.username}
							onChange={handleChange}
							required
						/>

						<TextField
							fullWidth
							label="E-Mail"
							name="email"
							type="email"
							margin="normal"
							value={form.email}
							onChange={handleChange}
							required
						/>

						<TextField
							fullWidth
							label="Passwort"
							name="password"
							type="password"
							margin="normal"
							value={form.password}
							onChange={handleChange}
							required
						/>

						<TextField
							fullWidth
							label="Passwort wiederholen"
							name="passwordConfirm"
							type="password"
							margin="normal"
							value={form.passwordConfirm}
							onChange={handleChange}
							required
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
							{loading ? "Erstelle Konto..." : "Registrieren"}
						</Button>
					</Box>

					<Box
						sx={{
							mt: 3,
						}}
					>
						<Link component={RouterLink} to="/login">
							Zurück zum Login
						</Link>
					</Box>
				</CardContent>
			</Card>
		</Container>
	);
}
