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

import {
	Link as RouterLink,
	useSearchParams,
	useNavigate,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function ResetPassword() {
	const { resetPassword } = useAuth();

	const [searchParams] = useSearchParams();

	const navigate = useNavigate();

	const token = searchParams.get("token");

	const [password, setPassword] = useState("");

	const [passwordConfirm, setPasswordConfirm] = useState("");

	const [error, setError] = useState("");

	const [message, setMessage] = useState("");

	const [loading, setLoading] = useState(false);

	async function handleSubmit(e) {
		e.preventDefault();

		setError("");

		setMessage("");

		if (password !== passwordConfirm) {
			setError("Die Passwörter stimmen nicht überein");

			return;
		}

		if (!token) {
			setError("Ungültiger Reset-Link");

			return;
		}

		try {
			setLoading(true);

			const result = await resetPassword(token, password);

			if (result.success) {
				setMessage(
					"Passwort erfolgreich geändert. Du wirst zum Login weitergeleitet.",
				);

				setTimeout(() => {
					navigate("/login");
				}, 2000);
			} else {
				setError(result.message || "Passwort konnte nicht geändert werden");
			}
		} catch (error) {
			setError("Passwort konnte nicht geändert werden");
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
						🔐 Neues Passwort
					</Typography>

					{message && (
						<Alert
							severity="success"
							sx={{
								mb: 2,
							}}
						>
							{message}
						</Alert>
					)}

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
							label="Neues Passwort"
							type="password"
							margin="normal"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>

						<TextField
							fullWidth
							label="Passwort wiederholen"
							type="password"
							margin="normal"
							value={passwordConfirm}
							onChange={(e) => setPasswordConfirm(e.target.value)}
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
							{loading ? "Speichere..." : "Passwort speichern"}
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
