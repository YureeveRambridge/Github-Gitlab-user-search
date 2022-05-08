var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const helmet = require("helmet");
var apiCallsRouter = require("./routes/apiCalls");
var getRequestRouter = require("./routes/getRequest");

var app = express();

// Setup of the jade engine view pages
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//Helmet is set
app.use(helmet());

// Request to get api data
app.use("/", apiCallsRouter);
app.use("/users", getRequestRouter);

// CORS is set 
app.use((req, res, next) => {
  res.header({ "Access-Control-Allow-Origin": "*" });
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

//Error Handling

// Error Handler to catch 404 errors from the APIs
app.use(function (req, res, next) {
  next(createError(404));
});

//Handles local errors
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // Renders the error page
  res.status(err.status || 500);
  res.render("Error");
});

// Have Node send the files for our built React app
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/build")));
  
  // All  GET requests that are not handled will return the frontend app
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

//The app is exported
module.exports = app;
