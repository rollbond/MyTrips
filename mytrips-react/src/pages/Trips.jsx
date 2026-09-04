import { useEffect, useState } from "react";
import {
	Container,
	Typography,
	Button,
	Box,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	MenuItem,
	Snackbar,
	Alert,
	ToggleButtonGroup,
	ToggleButton,
	Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import TableRowsIcon from "@mui/icons-material/TableRows";
import GridViewIcon from "@mui/icons-material/GridView";
import TripTable from "../components/TripTable";
import TripCards from "../components/TripCards";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { format, differenceInCalendarDays, parseISO } from "date-fns";
import { de } from "date-fns/locale";
import {
	getCountries,
	getTrips,
	createTrip,
	updateTrip,
	deleteTrip,
} from "../api/api";
import { useProfile } from "../context/ProfileContext";
import { useAuth } from "../context/AuthContext";

export default function Trips() {
	const { activeProfile } = useProfile();
	const { user } = useAuth();

	const [countries, setCountries] = useState([]);

	const [trips, setTrips] = useState([]);

	const [open, setOpen] = useState(false);

	const [editOpen, setEditOpen] = useState(false);

	const [deleteOpen, setDeleteOpen] = useState(false);

	const [tripToEdit, setTripToEdit] = useState(null);

	const [tripToDelete, setTripToDelete] = useState(null);

	const [view, setView] = useState("table");

	const [snackbar, setSnackbar] = useState({
		open: false,
		message: "",
		type: "success",
	});

	const [form, setForm] = useState({
		country_code: "",
		start_date: "",
		end_date: "",
		notes: "",
	});

	const [dateRange, setDateRange] = useState([
		{
			startDate: new Date(),
			endDate: new Date(),
			key: "selection",
		},
	]);

	// Länder laden

	useEffect(() => {
		async function loadCountries() {
			try {
				const data = await getCountries();

				setCountries(data);
			} catch (error) {
				console.error("Country loading error:", error);
			}
		}

		loadCountries();
	}, []);

	// Reisen laden bei Profilwechsel

	useEffect(() => {
		if (!activeProfile) {
			setTrips([]);

			return;
		}

		loadTrips();
	}, [activeProfile]);

	async function loadTrips() {
		try {
			const data = await getTrips(activeProfile.id);

			setTrips(data);
		} catch (error) {
			console.error("Trip loading error:", error);
		}
	}

	function showMessage(message, type = "success") {
		setSnackbar({
			open: true,
			message,
			type,
		});
	}

	function handleCloseSnackbar() {
		setSnackbar({
			...snackbar,
			open: false,
		});
	}

	function handleChange(event) {
		setForm({
			...form,
			[event.target.name]: event.target.value,
		});
	}

	function handleDateChange(item) {
		const selection = item.selection;

		setDateRange([selection]);

		setForm((prev) => ({
			...prev,

			start_date: selection.startDate
				? format(selection.startDate, "yyyy-MM-dd")
				: "",

			end_date: selection.endDate
				? format(selection.endDate, "yyyy-MM-dd")
				: "",
		}));
	}

	function resetForm() {
		setForm({
			country_code: "",
			start_date: "",
			end_date: "",
			notes: "",
		});

		setDateRange([
			{
				startDate: new Date(),
				endDate: new Date(),
				key: "selection",
			},
		]);
	}

	async function saveTrip(close = true) {
		if (!activeProfile) return;

		try {
			await createTrip({
				user_id: user?.id,
				profile_id: activeProfile.id,

				...form,
			});

			await loadTrips();

			showMessage("Reise gespeichert");

			if (close) {
				setOpen(false);

				resetForm();
			}
		} catch (error) {
			console.error("Save error:", error);
		}
	}

	async function saveTripAndNew() {
		await saveTrip(false);

		resetForm();
	}

	function openEdit(trip) {
		setTripToEdit(trip);

		setForm({
			country_code: trip.country_code,

			start_date: trip.start_date,

			end_date: trip.end_date,

			notes: trip.notes || "",
		});

		setDateRange([
			{
				startDate: parseISO(trip.start_date),

				endDate: parseISO(trip.end_date),

				key: "selection",
			},
		]);

		setEditOpen(true);
	}

	async function saveEdit() {
		try {
			await updateTrip({
				id: tripToEdit.id,

				profile_id: activeProfile.id,

				...form,
			});

			await loadTrips();

			showMessage("Reise aktualisiert");

			setEditOpen(false);

			resetForm();
		} catch (error) {
			console.error("Update error:", error);
		}
	}

	function openDelete(id) {
		setTripToDelete(id);

		setDeleteOpen(true);
	}

	async function confirmDelete() {
		try {
			await deleteTrip(tripToDelete);

			await loadTrips();

			showMessage("Reise gelöscht");

			setDeleteOpen(false);
		} catch (error) {
			console.error("Delete error:", error);
		}
	}

	function getDuration(trip) {
		return (
			differenceInCalendarDays(
				parseISO(trip.end_date),

				parseISO(trip.start_date),
			) + 1
		);
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
				<Typography variant="h4">Meine Reisen ✈️</Typography>

				<Button
					variant="contained"
					startIcon={<AddIcon />}
					onClick={() => {
						resetForm();

						setOpen(true);
					}}
				>
					Neue Reise
				</Button>
			</Box>

			<Box
				sx={{
					mb: 3,
					display: "flex",
					justifyContent: "flex-end",
				}}
			>
				<ToggleButtonGroup
					value={view}
					exclusive
					onChange={(e, value) => {
						if (value) setView(value);
					}}
				>
					<ToggleButton value="table">
						<TableRowsIcon sx={{ mr: 1 }} />
						Tabelle
					</ToggleButton>

					<ToggleButton value="cards">
						<GridViewIcon sx={{ mr: 1 }} />
						Karten
					</ToggleButton>
				</ToggleButtonGroup>
			</Box>

			{view === "table" ? (
				<TripTable
					trips={trips}
					onEdit={openEdit}
					onDelete={openDelete}
					getDuration={getDuration}
				/>
			) : (
				<TripCards
					trips={trips}
					onEdit={openEdit}
					onDelete={openDelete}
					getDuration={getDuration}
				/>
			)}

			<Dialog
				open={open || editOpen}
				onClose={() => {
					setOpen(false);

					setEditOpen(false);

					resetForm();
				}}
				fullWidth
				maxWidth="md"
			>
				<DialogTitle>
					{editOpen ? "Reise bearbeiten" : "Neue Reise"}
				</DialogTitle>

				<DialogContent>
					<TextField
						select
						fullWidth
						margin="normal"
						label="Land"
						name="country_code"
						value={form.country_code}
						onChange={handleChange}
					>
						{countries.map((country) => (
							<MenuItem key={country.code} value={country.code}>
								{country.name_de}
							</MenuItem>
						))}
					</TextField>

					<Divider sx={{ my: 2 }} />

					<Typography sx={{ mb: 1 }}>Reisezeitraum</Typography>

					<DateRange
						locale={de}
						ranges={dateRange}
						onChange={handleDateChange}
						months={2}
						direction="horizontal"
					/>

					<TextField
						fullWidth
						margin="normal"
						label="Notizen"
						name="notes"
						value={form.notes}
						onChange={handleChange}
						multiline
						rows={3}
					/>
				</DialogContent>

				<DialogActions>
					<Button
						onClick={() => {
							setOpen(false);
							setEditOpen(false);
							resetForm();
						}}
					>
						Abbrechen
					</Button>

					{!editOpen && (
						<Button
							variant="outlined"
							startIcon={<PlaylistAddIcon />}
							onClick={saveTripAndNew}
						>
							Speichern + Neu
						</Button>
					)}

					<Button
						variant="contained"
						startIcon={<SaveIcon />}
						onClick={editOpen ? saveEdit : saveTrip}
					>
						{editOpen ? "Ändern" : "Speichern"}
					</Button>
				</DialogActions>
			</Dialog>

			<Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
				<DialogTitle>Reise löschen?</DialogTitle>

				<DialogContent>Möchtest du diese Reise wirklich löschen?</DialogContent>

				<DialogActions>
					<Button onClick={() => setDeleteOpen(false)}>Abbrechen</Button>

					<Button color="error" variant="contained" onClick={confirmDelete}>
						Löschen
					</Button>
				</DialogActions>
			</Dialog>

			<Snackbar
				open={snackbar.open}
				autoHideDuration={3000}
				onClose={handleCloseSnackbar}
			>
				<Alert severity={snackbar.type} variant="filled">
					{snackbar.message}
				</Alert>
			</Snackbar>
		</Container>
	);
}
