import { FormControl, Select, MenuItem, Box } from "@mui/material";

import { useProfile } from "../context/ProfileContext";

export default function ProfileSelector() {
	const { profiles, activeProfile, selectProfile } = useProfile();

	function handleChange(event) {
		const profileId = Number(event.target.value);

		const profile = profiles.find((p) => p.id === profileId);

		if (profile) {
			selectProfile(profile);
		}
	}

	return (
		<FormControl
			size="small"
			sx={{
				minWidth: 180,
			}}
		>
			<Select
				value={activeProfile?.id || ""}
				onChange={handleChange}
				displayEmpty
			>
				{profiles.map((profile) => (
					<MenuItem key={profile.id} value={profile.id}>
						<Box
							sx={{
								width: 12,
								height: 12,
								borderRadius: "50%",
								backgroundColor: profile.color,
								display: "inline-block",
								mr: 1.5,
							}}
						/>

						{profile.name}
					</MenuItem>
				))}
			</Select>
		</FormControl>
	);
}
