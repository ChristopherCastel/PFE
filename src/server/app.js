// imports
const express = require("express");
const path = require("path");
const fs = require("fs");
const createError = require("http-errors");
const cookieParser = require("cookie-parser");
const sassMiddleware = require("node-sass-middleware");
const logger = require("morgan");
const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");
// application.js mapping
const assetPath = require("./asset_path.js");
//winston logger setup
require("./modules/logger.js");
// routeurs
const authRouter = require("./routes/auth");
const indexRouter = require("./routes/index");
const playlistsRouter = require("./routes/playlists");
const reactionsRouter = require("./routes/reactions");
const suggestionsRouter = require("./routes/suggestions");
const tagsRouter = require("./routes/tags");
const usersRouter = require("./routes/users");
const videosRouter = require("./routes/videos");
// static files
const serverRoot = path.join(__dirname, ".");
// express
const app = express();

const checkJwt = jwt({
  // Dynamically provide a signing key
  // based on the kid in the header and
  // the signing keys provided by the JWKS endpoint.
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://web3.eu.auth0.com/.well-known/jwks.json`
  }),
  // Validate the audience and the issuer.
  audience: "http://localhost:3030",
  issuer: `https://web3.eu.auth0.com/`,
  algorithms: ["RS256"]
});

app.locals.assetPath = assetPath;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// logs status >= 400 on stderr
app.use(
  logger("dev", {
    skip: function(req, res) {
      return res.statusCode < 400;
    },
    stream: process.stderr
  })
);

// logs status < 400 on stdout
app.use(
  logger("dev", {
    skip: function(req, res) {
      return res.statusCode >= 400;
    },
    stream: process.stdout
  })
);

// logs all access
app.use(
  logger("common", {
    stream: fs.createWriteStream(path.join(__dirname, "logs/access.log"), {
      flags: "a"
    })
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  sassMiddleware({
    src: path.join(serverRoot, "public"),
    dest: path.join(serverRoot, "public"),
    indentedSyntax: true, // true = .sass and false = .scss
    sourceMap: true
  })
);
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "../../dist")));

app.use("/", indexRouter);
app.use("/authCallback", authRouter);
app.use(checkJwt);
app.use((req, res, next) => {
  req.id_user = req.user.sub.split("|")[1];
  next();
});

// API
app.use("/playlists", playlistsRouter);
app.use("/reactions", reactionsRouter);
app.use("/suggestions", suggestionsRouter);
app.use("/tags", tagsRouter);
app.use("/users", usersRouter);
app.use("/videos", videosRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
