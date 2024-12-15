require("dotenv").config();
var createError = require("http-errors");
var express = require("express");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const connectDb = require("./config/database");
const noteRoutes = require("./routes/noteRoutes");
const userRoutes = require("./routes/userRoutes");
const swaggerUi = require("swagger-ui-express");
const bodyParser = require("body-parser");
const envUtil = require("./util/envUtil");

var app = express();

app.use(bodyParser.json());
app.use(logger("dev"));
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

connectDb();

app.use(
  "/swagger-ui",
  swaggerUi.serve,
  swaggerUi.setup(require("../swagger-output.json"))
);

app.get("/", (req, res) => res.send("Express on Vercel"));
app.use("/api/notes", noteRoutes);
app.use("/api/auth", userRoutes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.json({ error: err });
  //res.render("error");
});

// Start the server
const PORT = envUtil.getPort();
const server = app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

module.exports = { app, server };
