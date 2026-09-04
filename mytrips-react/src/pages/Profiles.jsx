import { useState } from "react";

import {
	Container,
	Grid,
	Card,
	CardContent,
	Typography,
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	Box,
	IconButton,
	Snackbar,
	Alert,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import PublicIcon from "@mui/icons-material/Public";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";

import { createProfile, deleteProfile } from "../api/api";

import { useProfile } from "../context/ProfileContext";

const USER_ID = 1;

export default function Profiles() {
	const { profiles, reloadProfiles, activeProfile, selectProfile } =
		useProfile();

	const [open, setOpen] = useState(false);

	const [snackbarOpen, setSnackbarOpen] = useState(false);

	const [form, setForm] = useState({
		name: "",
		color: "#2196f3",
	});

	async function saveProfile() {
		try {
			await createProfile({
				user_id: USER_ID,
				...form,
			});

			await reloadProfiles();

			setOpen(false);

			setSnackbarOpen(true);

			setForm({
				name: "",
				color: "#2196f3",
			});
		} catch (error) {
			console.error(error);
		}
	}

	async function removeProfile(id) {
		if (!window.confirm("Profil wirklich löschen?")) {
			return;
		}

		try {
			await deleteProfile(id);

			// Falls das aktive Profil gelöscht wurde
			if (activeProfile?.id === id) {
				selectProfile(null);
			}

			await reloadProfiles();
		} catch (error) {
			console.error(error);
		}
	}

	return (
		<Container maxWidth="lg">
			<Box
				sx={{
					mt: 4,
					mb: 3,
					display: "flex",
					justifyContent: "space-between",
				}}
			>
				<Typography variant="h4">Profile 👤</Typography>

				<Button
					variant="contained"
					startIcon={<AddIcon />}
					onClick={() => setOpen(true)}
				>
					Profil anlegen
				</Button>
			</Box>

			<Grid container spacing={3}>
				{profiles.map((profile) => (
					<Grid
						key={profile.id}
						size={{
							xs: 12,
							md: 4,
						}}
					>
						<Card
							elevation={activeProfile?.id === profile.id ? 8 : 2}
							sx={{
								border:
									activeProfile?.id === profile.id
										? `2px solid ${profile.color}`
										: "1px solid #eee",
							}}
						>
							<CardContent>
								<Box
									sx={{
										width: 56,
										height: 56,
										borderRadius: "50%",
										backgroundColor: profile.color,
										mb: 2,
									}}
								/>

								<Typography variant="h6" fontWeight="bold">
									{profile.name}
								</Typography>

								<Box sx={{ mt: 2 }}>
									<Typography>
										<FlightTakeoffIcon
											fontSize="small"
											sx={{
												mr: 1,
												verticalAlign: "middle",
											}}
										/>
										{profile.trips} Reisen
									</Typography>

									<Typography>
										<PublicIcon
											fontSize="small"
											sx={{
												mr: 1,
												verticalAlign: "middle",
											}}
										/>
										{profile.countries} Länder
									</Typography>
								</Box>

								<Box
									sx={{
										mt: 2,
										display: "flex",
										justifyContent: "flex-end",
									}}
								>
									<IconButton color="primary" disabled>
										<EditIcon />
									</IconButton>

									<IconButton
										color="error"
										onClick={() => removeProfile(profile.id)}
									>
										<DeleteForeverIcon />
									</IconButton>
								</Box>
							</CardContent>
						</Card>
					</Grid>
				))}
			</Grid>

			<Dialog
				open={open}
				onClose={() => setOpen(false)}
				fullWidth
				maxWidth="sm"
			>
				<DialogTitle>Neues Profil</DialogTitle>

				<DialogContent>
					<TextField
						fullWidth
						label="Profilname"
						margin="normal"
						value={form.name}
						onChange={(e) =>
							setForm({
								...form,
								name: e.target.value,
							})
						}
					/>

					<TextField
						fullWidth
						type="color"
						margin="normal"
						label="Farbe"
						value={form.color}
						onChange={(e) =>
							setForm({
								...form,
								color: e.target.value,
							})
						}
						InputLabelProps={{
							shrink: true,
						}}
					/>
				</DialogContent>

				<DialogActions>
					<Button onClick={() => setOpen(false)}>Abbrechen</Button>

					<Button variant="contained" onClick={saveProfile}>
						Speichern
					</Button>
				</DialogActions>
			</Dialog>

			<Snackbar
				open={snackbarOpen}
				autoHideDuration={3000}
				onClose={() => setSnackbarOpen(false)}
			>
				<Alert severity="success" variant="filled">
					Profil erfolgreich angelegt.
				</Alert>
			</Snackbar>
		</Container>
	);
}
