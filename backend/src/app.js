import express from "express"
import cors from "cors";
import morgan from "morgan";
import errorHandler from "./middleware/errorHandler.js";
import authRouter from "./routes/auth.route.js";
import itemRouter from "./routes/item.route.js";
import cookieParser from "cookie-parser";





const app  = express();





/** application middleware */
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}))
app.use(cookieParser())
app.use(morgan("dev"));
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));




app.use("/api/auth", authRouter )
app.use("/api/items", itemRouter)




app.use(errorHandler)
export default app