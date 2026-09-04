import {
	AppBar,
	Toolbar,
	Typography,
	Button,
	Box,
	FormControl,
	Select,
	MenuItem,
	Avatar,
} from "@mui/material";

import { Link } from "react-router-dom";

import { useProfile } from "../context/ProfileContext";

import { useAuth } from "../context/AuthContext";

export default function Navbar() {
	const { profiles, activeProfile, selectProfile } = useProfile();

	const { user, logout } = useAuth();

	function handleProfileChange(event) {
		const selectedId = Number(event.target.value);

		const selected = profiles.find((profile) => profile.id === selectedId);

		if (selected) {
			selectProfile(selected);
		}
	}

	return (
		<AppBar position="static">
			<Toolbar>
				<Typography
					variant="h6"
					sx={{
						flexGrow: 1,
						fontWeight: "bold",
					}}
				>
					🌍 MyTrips
				</Typography>

				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						gap: 1,
					}}
				>
					<Button color="inherit" component={Link} to="/">
						Dashboard
					</Button>

					<Button color="inherit" component={Link} to="/trips">
						Reisen
					</Button>

					<Button color="inherit" component={Link} to="/map">
						Weltkarte
					</Button>

					<Button color="inherit" component={Link} to="/profiles">
						Profile
					</Button>

					<FormControl
						size="small"
						sx={{
							ml: 2,

							minWidth: 170,

							backgroundColor: "rgba(255,255,255,0.15)",

							borderRadius: 1,
						}}
					>
						<Select
							value={activeProfile?.id || ""}
							onChange={handleProfileChange}
							sx={{
								color: "white",

								"& .MuiOutlinedInput-notchedOutline": {
									border: "none",
								},

								"& .MuiSvgIcon-root": {
									color: "white",
								},
							}}
						>
							{profiles.map((profile) => (
								<MenuItem key={profile.id} value={profile.id}>
									<Box
										sx={{
											width: 12,

											height: 12,

											borderRadius: "50%",

											backgroundColor: profile.color,

											mr: 1,
										}}
									/>

									{profile.name}
								</MenuItem>
							))}
						</Select>
					</FormControl>

					<Box
						sx={{
							display: "flex",

							alignItems: "center",

							ml: 2,

							gap: 1,
						}}
					>
						<Avatar
							sx={{
								width: 32,

								height: 32,
							}}
						>
							{user?.name?.charAt(0)?.toUpperCase()}
						</Avatar>

						<Typography
							variant="body2"
							sx={{
								color: "white",
							}}
						>
							{user?.name}
						</Typography>

						<Button color="inherit" onClick={logout}>
							Logout
						</Button>
					</Box>
				</Box>
			</Toolbar>
		</AppBar>
	);
}
