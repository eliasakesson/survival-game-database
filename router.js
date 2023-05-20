import express from "express";
import { GetUser, AddUser, Login } from "./database.js";
import { ValidEmail, ValidPassword, ValidUsername } from "./utils.js";

const router = express.Router();

router.get("/", (req, res) => {
	res.send("Hello World!");
});

router.get("/users/:email", async (req, res) => {
	const { email } = req.params;

	await GetUser(email)
		.then((user) => {
			res.send({ ...user, status: "success" });
		})
		.catch((err) => {
			res.status(400).send({ ...err, status: "error" });
		});
});

router.post("/users", async (req, res) => {
	const { username, email, password } = req.body;

	if (!ValidUsername(username)) {
		return res.status(400).send({
			message: "Username must be at least 3 characters",
			status: "error",
		});
	}

	if (!ValidEmail(email)) {
		return res.status(400).send({
			message: "Email must be valid",
			status: "error",
		});
	}

	if (
		await GetUser(email)
			.then((user) => {
				return true;
			})
			.catch(() => {
				return false;
			})
	) {
		return res
			.status(400)
			.send({ message: "Email already in use", status: "error" });
	}

	if (!ValidPassword(password)) {
		return res.status(400).send({
			message: "Password must be at least 8 characters",
			status: "error",
		});
	}

	return AddUser(username, email, password)
		.then((user) => {
			res.send({ ...user, status: "success" });
		})
		.catch((err) => {
			res.status(500).send({ ...err, status: "error" });
		});
});

router.post("/login", async (req, res) => {
	const { email, password } = req.body;

	if (!ValidEmail(email)) {
		return res.status(400).send({
			message: "Email must be valid",
			status: "error",
		});
	}

	if (!ValidPassword(password)) {
		return res.status(400).send({
			message: "Password must be at least 8 characters",
			status: "error",
		});
	}

	return Login(email, password)
		.then((user) => {
			res.send({ ...user, status: "success" });
		})
		.catch((err) => {
			res.status(400).send({ message: err, status: "error" });
		});
});

export default router;
