import sqlite3 from "sqlite3";
import { open } from "sqlite";

(async () => {
	await CreateUsersTable();
	await CreateWorldsTable();
})();

function GetDB() {
	return new Promise(async (res, rej) => {
		try {
			const db = await open({
				filename: "database.db",
				driver: sqlite3.Database,
			});
			res(db);
		} catch (err) {
			rej("Error opening database");
		}
	});
}

async function CreateUsersTable() {
	const db = await GetDB();

	const SQL =
		"CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, email TEXT, password TEXT)";
	await db.run(SQL, [], (err) => {
		if (err) {
			return console.error(err.message);
		}
	});

	return true;
}

async function CreateWorldsTable() {
	const db = await GetDB();

	const SQL =
		"CREATE TABLE IF NOT EXISTS worlds (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, owner TEXT, data TEXT)";
	await db.run(SQL, [], (err) => {
		if (err) {
			return console.error(err.message);
		}
	});

	return true;
}

export async function Login(email, password) {
	return new Promise(async (res, rej) => {
		try {
			const db = await GetDB();

			const SQL = "SELECT * FROM users WHERE email = ? AND password = ?";
			const user = await db.get(SQL, [email, password], (err) => {
				if (err) {
					rej("Error logging in");
				}
			});

			if (user) {
				delete user.password;
				return res(user);
			}

			return rej("No user found with those credentials");
		} catch (err) {
			rej("Error logging in");
		}
	});
}

export function AddUser(username, email, password) {
	return new Promise(async (res, rej) => {
		try {
			const db = await GetDB();

			const SQL =
				"INSERT OR REPLACE INTO users (username, email, password) VALUES (?, ?, ?)";
			await db.run(SQL, [username, email, password], (err) => {
				if (err) {
					rej("Error adding user");
				}
			});

			return GetUser(email)
				.then((user) => {
					res(user);
				})
				.catch(() => {
					rej("Error adding user");
				});
		} catch (err) {
			rej("Error adding user");
		}
	});
}

export async function GetUser(email) {
	return new Promise(async (res, rej) => {
		try {
			const db = await GetDB();

			const SQL = "SELECT * FROM users WHERE email = ?";
			const user = await db.get(SQL, [email], (err) => {
				if (err) {
					rej("Error getting user");
				}
			});

			if (user) {
				delete user.password;
				return res(user);
			}

			return rej("No user found with that email");
		} catch (err) {
			rej("Error getting user");
		}
	});
}

async function RemoveUser(email) {
	const db = await GetDB();

	const SQL = "DELETE FROM users WHERE email = ?";
	await db.run(SQL, [email], (err) => {
		if (err) {
			return console.error(err.message);
		}
	});

	return true;
}
