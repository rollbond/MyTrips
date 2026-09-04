import { createTheme } from "@mui/material/styles";

const theme = createTheme({
	palette: {
		primary: {
			main: "#1976d2",
		},
		secondary: {
			main: "#4caf50",
		},
		background: {
			default: "#f5f7fa",
		},
	},
	typography: {
		fontFamily: "Roboto, Arial, sans-serif",
	},
});

export default theme;
