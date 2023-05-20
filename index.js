import express from "express";
import cors from "cors";
import router from "./router.js";

const app = express();
const port = 8080;

app.use(express.json());
app.use(cors());
app.use("/v1", router);

app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
