import { Box, Container, Typography } from "@mui/material";

export default function Footer() {
	return (
		<Box
			component="footer"
			sx={{
				mt: 6,
				py: 3,
				borderTop: "1px solid",
				borderColor: "divider",
				backgroundColor: "#fafafa",
			}}
		>
			<Container maxWidth="lg">
				<Typography align="center" variant="body2" color="text.secondary">
					MyTrips by YOGITECH — Deine persönliche Reisechronik
				</Typography>
			</Container>
		</Box>
	);
}
