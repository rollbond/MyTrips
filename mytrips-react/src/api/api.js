const API_URL = "https://yogi-tech.de/app.mytrips/api";

// ==========================
// COUNTRIES
// ==========================

export async function getCountries() {
	const response = await fetch(`${API_URL}/countries.php`);

	if (!response.ok) {
		throw new Error("Countries loading failed");
	}

	return await response.json();
}

// ==========================
// AUTH
// ==========================

export async function loginUser(email, password) {
	const response = await fetch(`${API_URL}/login.php`, {
		method: "POST",

		headers: {
			"Content-Type": "application/json",
		},

		body: JSON.stringify({
			email,
			password,
		}),
	});

	if (!response.ok) {
		throw new Error("Login failed");
	}

	return await response.json();
}

export async function registerUser(data) {
	const response = await fetch(`${API_URL}/register.php`, {
		method: "POST",

		headers: {
			"Content-Type": "application/json",
		},

		body: JSON.stringify(data),
	});

	if (!response.ok) {
		throw new Error("Registration failed");
	}

	return await response.json();
}

export async function forgotPasswordRequest(email) {
	const response = await fetch(`${API_URL}/forgot_password.php`, {
		method: "POST",

		headers: {
			"Content-Type": "application/json",
		},

		body: JSON.stringify({
			email,
		}),
	});

	if (!response.ok) {
		throw new Error("Forgot password failed");
	}

	return await response.json();
}

export async function resetPasswordRequest(token, password) {
	const response = await fetch(`${API_URL}/reset_password.php`, {
		method: "POST",

		headers: {
			"Content-Type": "application/json",
		},

		body: JSON.stringify({
			token,

			password,
		}),
	});

	if (!response.ok) {
		throw new Error("Reset password failed");
	}

	return await response.json();
}

// ==========================
// TRIPS
// ==========================

export async function getTrips(profileId) {
	const response = await fetch(`${API_URL}/trips.php?profile_id=${profileId}`);

	if (!response.ok) {
		throw new Error("Trips loading failed");
	}

	return await response.json();
}

export async function createTrip(trip) {
	const response = await fetch(`${API_URL}/trip_create.php`, {
		method: "POST",

		headers: {
			"Content-Type": "application/json",
		},

		body: JSON.stringify(trip),
	});

	if (!response.ok) {
		throw new Error("Trip creation failed");
	}

	return await response.json();
}

export async function updateTrip(trip) {
	const response = await fetch(`${API_URL}/trip_update.php`, {
		method: "POST",

		headers: {
			"Content-Type": "application/json",
		},

		body: JSON.stringify(trip),
	});

	if (!response.ok) {
		throw new Error("Trip update failed");
	}

	return await response.json();
}

export async function deleteTrip(id) {
	const response = await fetch(`${API_URL}/trip_delete.php`, {
		method: "POST",

		headers: {
			"Content-Type": "application/json",
		},

		body: JSON.stringify({
			id,
		}),
	});

	if (!response.ok) {
		throw new Error("Trip delete failed");
	}

	return await response.json();
}

// ==========================
// DASHBOARD / MAP
// ==========================

export async function getDashboard(profileId) {
	const response = await fetch(
		`${API_URL}/dashboard.php?profile_id=${profileId}`,
	);

	if (!response.ok) {
		throw new Error("Dashboard load failed");
	}

	return await response.json();
}

export async function getVisitedCountries(profileId) {
	const response = await fetch(
		`${API_URL}/visited_countries.php?profile_id=${profileId}`,
	);

	if (!response.ok) {
		throw new Error("Visited countries loading failed");
	}

	return await response.json();
}

export async function getVisitedCountriesByUser(userId) {
	const response = await fetch(
		`${API_URL}/visited_countries.php?user_id=${userId}`,
	);

	if (!response.ok) {
		throw new Error("Visited countries loading failed");
	}

	return await response.json();
}

// ==========================
// PROFILES
// ==========================

export async function getProfiles(userId) {
	const response = await fetch(`${API_URL}/profiles.php?user_id=${userId}`);

	if (!response.ok) {
		throw new Error("Profiles loading failed");
	}

	return await response.json();
}

export async function createProfile(profile) {
	const response = await fetch(`${API_URL}/profile_create.php`, {
		method: "POST",

		headers: {
			"Content-Type": "application/json",
		},

		body: JSON.stringify(profile),
	});

	return await response.json();
}

export async function updateProfile(profile) {
	const response = await fetch(`${API_URL}/profile_update.php`, {
		method: "POST",

		headers: {
			"Content-Type": "application/json",
		},

		body: JSON.stringify(profile),
	});

	return await response.json();
}

export async function deleteProfile(id) {
	const response = await fetch(`${API_URL}/profile_delete.php`, {
		method: "POST",

		headers: {
			"Content-Type": "application/json",
		},

		body: JSON.stringify({
			id,
		}),
	});

	return await response.json();
}
