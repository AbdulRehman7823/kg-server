var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose  = require('mongoose');
var dotenv = require('dotenv');
var cors = require('cors');


//<00000000000000000000000---- Routers 00000000000000000000000>
var indexRouter = require('./routes/index');
var AuthRouter = require('./routes/api/auth')
var PasswordReset = require('./routes/api/PasswordReset')
var StripeRouter = require("./routes/api/Stripe");
var TemplateRouter = require("./routes/api/site");

var app = express();
app.use(cors({ origin: true, credentials: true }));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

dotenv.config();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/api/auth", AuthRouter);
app.use("/api/password-reset", PasswordReset);
app.use("/api/Stripe", StripeRouter);
app.use("/api/site",TemplateRouter);

mongoose.set("strictQuery", false);
mongoose.connect(process.env.DB_Connect, () => {
  console.log("Connected");
  console.log(process.env.STRIPE_SECRET_KEY);
});















// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
