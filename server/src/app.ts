import express from "express"
import cookieParser from "cookie-parser"
import bodyParser from "body-parser"
import { config } from "dotenv"
import path from "path"
import mongoose from "mongoose"
import { ParseToken } from "middleware/ParseToken"
import cors from "cors"
import routes from "./routes";

config({
  path: path.join(__dirname, "../.env"),
});

mongoose.connect(
  process.env.MONGODB_URI!,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => console.log("MongoDB connected")
);

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(ParseToken);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "..", "views"))

app.use(routes);

module.exports = app;
