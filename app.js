const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const fileupload = require("express-fileupload");
const cors = require("cors");

const errorHandler = require("./middleware/error");

dotenv.config({ path: "./config/.env" });

const app = express();
const PORT = process.env.PORT || 3000;

const connectDB = require("./config/db");

app.use(cors());

// Cookie parser
app.use(cookieParser());

// Body parser
app.use(bodyParser.json());

// File uploading
app.use(fileupload({ useTempFiles: true }));

// connect to DB
connectDB();

// Dev loggin middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.get("/", (req, res, next) => {
  res.json({ cart: req.cookies });
});

// Import router
const router = require("./routes");

// Error handlers
app.use(errorHandler);

router(app);

const server = app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`.yellow.bold);
});

// Handle unhandle promise rejection
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  server.close(() => process.exit(1));
});
