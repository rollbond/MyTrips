import { useEffect, useState } from "react";

import {
	Container,
	Grid,
	Card,
	CardContent,
	Typography,
	Box,
	List,
	ListItem,
	ListItemText,
	LinearProgress,
	Divider,
} from "@mui/material";

import PublicIcon from "@mui/icons-material/Public";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import LuggageIcon from "@mui/icons-material/Luggage";

import { getDashboard } from "../api/api";
import { useProfile } from "../context/ProfileContext";

import StatCard from "../components/StatCard";

export default function Dashboard() {
	const [stats, setStats] = useState({
		countries: 0,
		trips: 0,
		travel_days: 0,
		last_trip: "-",
		recent_trips: [],
		top_countries: [],
	});

	const { activeProfile } = useProfile();

	async function loadDashboard(profileId) {
		try {
			const data = await getDashboard(profileId);

			setStats(data);
		} catch (error) {
			console.error("Dashboard load error:", error);
		}
	}

	useEffect(() => {
		if (!activeProfile?.id) return;

		loadDashboard(activeProfile.id);
	}, [activeProfile]);

	const worldProgress = Math.round((stats.countries / 195) * 100);

	return (
		<Container maxWidth="lg">
			<Typography
				variant="h4"
				sx={{
					mt: 4,
					mb: 1,
				}}
			>
				Willkommen bei MyTrips
			</Typography>

			<Typography color="text.secondary" sx={{ mb: 4 }}>
				Behalte den Überblick über deine Reisen und entdecke die Welt.
			</Typography>

			<Grid container spacing={3}>
				<Grid size={{ xs: 12, md: 3 }}>
					<StatCard
						label="Länder besucht"
						value={stats.countries}
						color="success"
						icon={<PublicIcon color="success" sx={{ fontSize: 42 }} />}
					/>
				</Grid>

				<Grid size={{ xs: 12, md: 3 }}>
					<StatCard
						label="Reisen"
						value={stats.trips}
						color="primary"
						icon={<FlightTakeoffIcon color="primary" sx={{ fontSize: 42 }} />}
					/>
				</Grid>

				<Grid size={{ xs: 12, md: 3 }}>
					<StatCard
						label="Reisetage"
						value={stats.travel_days}
						color="warning"
						icon={<CalendarMonthIcon color="warning" sx={{ fontSize: 42 }} />}
					/>
				</Grid>

				<Grid size={{ xs: 12, md: 3 }}>
					<StatCard
						label="Letzte Reise"
						value={stats.last_trip}
						color="secondary"
						icon={<LuggageIcon color="secondary" sx={{ fontSize: 42 }} />}
					/>
				</Grid>
			</Grid>

			<Card
				sx={{
					mt: 4,
					mb: 4,
					background: "linear-gradient(135deg,#1976d2 0%,#42a5f5 100%)",
					color: "white",
				}}
			>
				<CardContent>
					<Typography variant="h5" fontWeight="bold" gutterBottom>
						🌎 Welt entdeckt
					</Typography>

					<Typography sx={{ mb: 2 }}>
						{stats.countries} von 195 Ländern besucht
					</Typography>

					<Box sx={{ position: "relative" }}>
						<LinearProgress
							variant="determinate"
							value={worldProgress}
							sx={{
								height: 22,
								borderRadius: 11,

								backgroundColor: "rgba(255,255,255,0.3)",

								"& .MuiLinearProgress-bar": {
									backgroundColor: "#fff",
								},
							}}
						/>

						<Typography
							sx={{
								position: "absolute",
								left: "50%",
								top: "50%",
								transform: "translate(-50%,-50%)",
								fontWeight: "bold",
								color: "#1976d2",
							}}
						>
							{worldProgress}%
						</Typography>
					</Box>
				</CardContent>
			</Card>

			<Grid container spacing={3} sx={{ mt: 1 }}>
				<Grid
					size={{
						xs: 12,
						md: 6,
					}}
				>
					<Card elevation={3}>
						<CardContent>
							<Typography variant="h6">✈️ Letzte Reisen</Typography>

							<Divider sx={{ my: 2 }} />

							<List>
								{stats.recent_trips?.length > 0 ? (
									stats.recent_trips.map((trip) => (
										<ListItem key={trip.id}>
											<ListItemText
												primary={trip.country_name}
												secondary={`${trip.start_date} - ${trip.end_date}`}
											/>
										</ListItem>
									))
								) : (
									<Typography>Keine Reisen vorhanden</Typography>
								)}
							</List>
						</CardContent>
					</Card>
				</Grid>

				<Grid
					size={{
						xs: 12,
						md: 6,
					}}
				>
					<Card elevation={3}>
						<CardContent>
							<Typography variant="h6">🏆 Meist besucht</Typography>

							<Divider sx={{ my: 2 }} />

							<List>
								{stats.top_countries?.length > 0 ? (
									stats.top_countries.map((country) => (
										<ListItem key={country.name_de}>
											<ListItemText
												primary={country.name_de}
												secondary={`${country.visits} Reisen`}
											/>
										</ListItem>
									))
								) : (
									<Typography>Keine Daten vorhanden</Typography>
								)}
							</List>
						</CardContent>
					</Card>
				</Grid>
			</Grid>
		</Container>
	);
}
