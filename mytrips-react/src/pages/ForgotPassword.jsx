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

import { Link as RouterLink } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function ForgotPassword() {
	const { forgotPassword } = useAuth();

	const [email, setEmail] = useState("");

	const [message, setMessage] = useState("");

	const [error, setError] = useState("");

	const [loading, setLoading] = useState(false);

	async function handleSubmit(e) {
		e.preventDefault();

		setMessage("");

		setError("");

		try {
			setLoading(true);

			const result = await forgotPassword(email);

			if (result.success) {
				setMessage(
					"Falls ein Konto mit dieser E-Mail existiert, wurde eine Nachricht zum Zurücksetzen gesendet.",
				);
			} else {
				setError(result.message || "Anfrage fehlgeschlagen");
			}
		} catch (error) {
			setError("Anfrage fehlgeschlagen");
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
						🔑 Passwort vergessen
					</Typography>

					<Typography
						color="text.secondary"
						sx={{
							mb: 2,
						}}
					>
						Gib deine E-Mail-Adresse ein. Wir senden dir einen Link zum
						Zurücksetzen deines Passworts.
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
							label="E-Mail"
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
							margin="normal"
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
							{loading ? "Sende..." : "Passwort zurücksetzen"}
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
