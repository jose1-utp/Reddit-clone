import dotenv from "dotenv";
dotenv.config();
import { connectDB } from "./utils/db.js";
import app from "./server.js";

const port = process.env.PORT || 5000;

await connectDB(process.env.MONGODB_URI);

app.listen(port, () => {});
