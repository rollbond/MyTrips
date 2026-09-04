import {
	Card,
	CardContent,
	CardActions,
	Grid,
	Typography,
	IconButton,
	Chip,
	Stack,
	Divider,
	Box,
} from "@mui/material";

import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

export default function TripCards({ trips, onEdit, onDelete, getDuration }) {
	return (
		<Grid container spacing={3}>
			{trips.map((trip) => (
				<Grid
					key={trip.id}
					size={{
						xs: 12,
						sm: 6,
						md: 4,
					}}
				>
					<Card
						elevation={3}
						sx={{
							height: "100%",
							display: "flex",
							flexDirection: "column",
							transition: "0.2s",

							"&:hover": {
								transform: "translateY(-4px)",
								boxShadow: 8,
							},
						}}
					>
						<CardContent sx={{ flexGrow: 1 }}>
							<Box
								sx={{
									display: "flex",
									alignItems: "center",
									mb: 2,
								}}
							>
								<img
									src={`https://flagcdn.com/48x36/${trip.country_code
										.substring(0, 2)
										.toLowerCase()}.png`}
									alt={trip.country_name}
									style={{
										marginRight: 12,
										borderRadius: 4,
									}}
								/>

								<Typography variant="h6" fontWeight="bold">
									{trip.country_name}
								</Typography>
							</Box>

							<Divider sx={{ mb: 2 }} />

							<Stack spacing={1}>
								<Box
									sx={{
										display: "flex",
										alignItems: "center",
									}}
								>
									<CalendarMonthIcon fontSize="small" sx={{ mr: 1 }} />

									<Typography variant="body2">
										{trip.start_date} – {trip.end_date}
									</Typography>
								</Box>

								<Box
									sx={{
										display: "flex",
										alignItems: "center",
									}}
								>
									<AccessTimeIcon fontSize="small" sx={{ mr: 1 }} />

									<Chip
										size="small"
										label={`${getDuration(trip)} Tage`}
										color="primary"
									/>
								</Box>
							</Stack>

							{trip.notes && (
								<>
									<Divider sx={{ my: 2 }} />

									<Typography variant="body2" color="text.secondary">
										{trip.notes}
									</Typography>
								</>
							)}
						</CardContent>

						<CardActions
							sx={{
								justifyContent: "flex-end",
							}}
						>
							<IconButton color="primary" onClick={() => onEdit(trip)}>
								<EditIcon />
							</IconButton>

							<IconButton color="error" onClick={() => onDelete(trip.id)}>
								<DeleteForeverIcon />
							</IconButton>
						</CardActions>
					</Card>
				</Grid>
			))}
		</Grid>
	);
}
