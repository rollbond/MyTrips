import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function MainLayout() {
	return (
		<Box
			sx={{
				minHeight: "100vh",
				display: "flex",
				flexDirection: "column",
			}}
		>
			<Navbar />

			<Box sx={{ flexGrow: 1 }}>
				<Outlet />
			</Box>

			<Footer />
		</Box>
	);
}
