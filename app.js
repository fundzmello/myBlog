var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require ('mongoose');
const hbs = require('hbs');
const moment = require('moment');



const {mongoURI, globalVariable} = require('./config/defaultConfig')
const passport = require('passport');
require("./config/passport")(passport);


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
let authenticationRouter = require('./routes/authentication/index');
let adminRouter = require('./routes/admin/index');
let categoryRouter = require('./routes/admin/category');
let postRouter = require('./routes/admin/post');
let emailRouter = require('./routes/admin/email');
let singleRouter = require('./routes/single');
let singleCatRouter = require('./routes/singleCat');

var flash = require('connect-flash');
var session = require('express-session')
const Mongostore = require('connect-mongo')(session);




var app = express();

//db connection
mongoose.connect(mongoURI, {useNewUrlParser: true, useUnifiedTopology: true,  useCreateIndex: true})
.then(() => console.log('connection was successful'))
.catch(err => console.log(err))



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
    cookie: {maxAge: 600000},
    store: new Mongostore ({mongooseConnection: mongoose.connection})
  },)
)



//use connect flash hand
app.use(flash());

//passport middle ware
app.use(passport.initialize());
app.use(passport.session());

//globalvariables
app.use(globalVariable)

//registering partials
hbs.registerPartials(__dirname + '/views/partials')
hbs.registerPartials(__dirname + '/views/partials/admin')
hbs.registerPartials(__dirname + '/views/partials/user')


hbs.registerHelper({
  eq: (v1, v2) => v1 === v2,
  ne: (v1, v2) => v1 !== v2,
  lt: (v1, v2) => v1 < v2,
  gt: (v1, v2) => v1 > v2,
  lte: (v1, v2) => v1 <= v2,
  gte: (v1, v2) => v1 >= v2,
  and() {
      return Array.prototype.every.call(arguments, Boolean);
  },
  or() {
      return Array.prototype.slice.call(arguments, 0, -1).some(Boolean);
  }
});

hbs.registerHelper({
  formatDate: function (date, format) {
    return moment(date).utc().format(format)
  },
  truncate: function (str, len) {
    if (str.length > len && str.length > 0) {
      let new_str = str + ' '
      new_str = str.substr(0, len)
      new_str = str.substr(0, new_str.lastIndexOf(' '))
      new_str = new_str.length > 0 ? new_str : str.substr(0, len)
      return new_str + '...'
    }
    return str
  },
});



app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/account', authenticationRouter)
app.use('/admin', adminRouter)
app.use('/category', categoryRouter)
app.use('/post', postRouter)
app.use('/post', singleRouter)
app.use('/', emailRouter)
app.use('/category', singleCatRouter);








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
