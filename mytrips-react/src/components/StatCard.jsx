import { Card, CardContent, Typography } from "@mui/material";

export default function StatCard({ icon, label, value, color = "primary" }) {
	return (
		<Card
			elevation={3}
			sx={{
				height: "100%",
				transition: "0.2s",
				cursor: "default",

				"&:hover": {
					transform: "translateY(-4px)",
					boxShadow: 6,
				},
			}}
		>
			<CardContent
				sx={{
					textAlign: "center",
				}}
			>
				{icon}

				<Typography
					color="text.secondary"
					sx={{
						mt: 1,
					}}
				>
					{label}
				</Typography>

				<Typography variant="h3" color={`${color}.main`} fontWeight="bold">
					{value}
				</Typography>
			</CardContent>
		</Card>
	);
}
