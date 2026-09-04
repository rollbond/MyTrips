import { createContext, useContext, useEffect, useState } from "react";

import { getProfiles } from "../api/api";
import { useAuth } from "./AuthContext";

const ProfileContext = createContext(null);

export function ProfileProvider({ children }) {
	const { user } = useAuth();

	const [profiles, setProfiles] = useState([]);

	const [activeProfile, setActiveProfile] = useState(null);

	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!user) {
			setProfiles([]);

			setActiveProfile(null);

			localStorage.removeItem("activeProfileId");

			setLoading(false);

			return;
		}

		reloadProfiles();
	}, [user]);

	async function reloadProfiles() {
		if (!user) return;

		try {
			setLoading(true);

			const data = await getProfiles(user.id);

			const normalizedProfiles = data.map((profile) => ({
				...profile,
				id: Number(profile.id),
			}));

			setProfiles(normalizedProfiles);

			if (normalizedProfiles.length === 0) {
				setActiveProfile(null);

				localStorage.removeItem("activeProfileId");

				return;
			}

			const currentId = activeProfile?.id;

			const savedId = Number(localStorage.getItem("activeProfileId"));

			let profile =
				normalizedProfiles.find((p) => p.id === currentId) ||
				normalizedProfiles.find((p) => p.id === savedId);

			if (!profile) {
				profile = normalizedProfiles[0];
			}

			setActiveProfile(profile);

			localStorage.setItem("activeProfileId", String(profile.id));
		} catch (error) {
			console.error("Failed loading profiles:", error);
		} finally {
			setLoading(false);
		}
	}

	function selectProfile(profile) {
		if (!profile) {
			setActiveProfile(null);

			localStorage.removeItem("activeProfileId");

			return;
		}

		setActiveProfile(profile);

		localStorage.setItem("activeProfileId", String(profile.id));
	}

	return (
		<ProfileContext.Provider
			value={{
				profiles,
				activeProfile,
				loading,
				selectProfile,
				reloadProfiles,
			}}
		>
			{children}
		</ProfileContext.Provider>
	);
}

export function useProfile() {
	const context = useContext(ProfileContext);

	if (!context) {
		throw new Error("useProfile must be used inside ProfileProvider");
	}

	return context;
}
