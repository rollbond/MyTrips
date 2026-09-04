import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ProfileProvider } from "./context/ProfileContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<AuthProvider>
			<ProfileProvider>
				<ThemeProvider theme={theme}>
					<CssBaseline />
					<LocalizationProvider dateAdapter={AdapterDayjs}>
						<App />
					</LocalizationProvider>
				</ThemeProvider>
			</ProfileProvider>
		</AuthProvider>
	</React.StrictMode>,
);
