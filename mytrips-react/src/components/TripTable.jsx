import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	IconButton,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

export default function TripTable({ trips, onEdit, onDelete, getDuration }) {
	return (
		<TableContainer component={Paper}>
			<Table>
				<TableHead>
					<TableRow>
						<TableCell>Land</TableCell>

						<TableCell>Von</TableCell>

						<TableCell>Bis</TableCell>

						<TableCell>Dauer</TableCell>

						<TableCell>Notizen</TableCell>

						<TableCell>Aktion</TableCell>
					</TableRow>
				</TableHead>

				<TableBody>
					{trips.map((trip) => (
						<TableRow key={trip.id}>
							<TableCell>
								<img
									src={`https://flagcdn.com/24x18/${(trip.country_code || "")
										.slice(0, 2)
										.toLowerCase()}.png`}
									alt=""
								/>{" "}
								{trip.country_name}
							</TableCell>

							<TableCell>{trip.start_date}</TableCell>

							<TableCell>{trip.end_date}</TableCell>

							<TableCell>
								{getDuration(trip)}
								{" Tage"}
							</TableCell>

							<TableCell>{trip.notes}</TableCell>

							<TableCell>
								<IconButton color="primary" onClick={() => onEdit(trip)}>
									<EditIcon />
								</IconButton>

								<IconButton color="error" onClick={() => onDelete(trip.id)}>
									<DeleteForeverIcon />
								</IconButton>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
}
