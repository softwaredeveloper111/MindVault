import express from "express"
import cors from "cors";
import morgan from "morgan";





const app  = express();





/** application middleware */
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}))
app.use(morgan("dev"));
app.use(express.json())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));







export default app