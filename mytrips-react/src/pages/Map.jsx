import { useEffect, useMemo, useState } from "react";
import { Box } from "@mui/material";
import WorldMap from "react-svg-worldmap";
import { getVisitedCountriesByUser } from "../api/api";
import { useProfile } from "../context/ProfileContext";
import { useAuth } from "../context/AuthContext";

const GENERIC_COLOR = "#ff0000";
const EMPTY_COLOR = "#eceff1";

export default function Map() {
	const { user } = useAuth();
	const { profiles } = useProfile();
	const [countries, setCountries] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const countryColorMap = useMemo(
		() =>
			Object.fromEntries(
				countries.map((country) => [
					country.country.toUpperCase(),
					country.color,
				]),
			),
		[countries],
	);

	useEffect(() => {
		if (!user?.id) {
			setCountries([]);
			setLoading(false);
			return;
		}

		async function loadCountries() {
			try {
				setLoading(true);
				setError(null);

				const data = await getVisitedCountriesByUser(user.id);

				const countryProfiles = new globalThis.Map();

				for (const item of data) {
					const country = item.country_code.toLowerCase();
					const profileId = Number(item.profile_id);

					if (!countryProfiles.has(country)) {
						countryProfiles.set(country, new Set([profileId]));
					} else {
						countryProfiles.get(country).add(profileId);
					}
				}

				const profileColorById = new globalThis.Map(
					profiles.map((profile) => [profile.id, profile.color]),
				);

				const mapData = Array.from(countryProfiles.entries()).map(
					([country, profileIds]) => {
						const color =
							profileIds.size === 1
								? profileColorById.get(Array.from(profileIds)[0]) ||
									GENERIC_COLOR
								: GENERIC_COLOR;

						return {
							country,
							value: 1,
							color,
						};
					},
				);

				setCountries(mapData);
			} catch (err) {
				console.error("Map loading error:", err);

				setError("Weltkarte konnte nicht geladen werden.");
			} finally {
				setLoading(false);
			}
		}

		loadCountries();
	}, [user?.id, profiles]);

	return (
		<>
			{!loading && !error && (
				<Box
					sx={{
						display: "flex",
						justifyContent: "center",
						width: "100%",
					}}
				>
					<Box
						sx={{
							width: {
								xs: "100%",
								md: "90%",
								lg: "1000px",
							},
						}}
					>
						<WorldMap
							color={GENERIC_COLOR}
							data={countries}
							size="responsive"
							styleFunction={({ countryCode }) => ({
								fill: countryColorMap[countryCode] ?? EMPTY_COLOR,
								stroke: "#ffffff",
								strokeWidth: 0.5,
								outline: "none",
							})}
						/>
					</Box>
				</Box>
			)}
		</>
	);
}
