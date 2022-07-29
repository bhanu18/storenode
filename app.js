const express = require('express')
const exphbs = require('express-handlebars')
const dotenv = require('dotenv')
const morgan = require('morgan')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const connectDB = require('./config/db')
const flash = require('connect-flash')
const methodOverride = require('method-override')
const path = require('path')
const { formatDate, getTotalPrice, getImage, select } = require('./helpers/helpers')

dotenv.config({ path: './config/config.env' })

// passport js
require('./config/passport')(passport)

// connect database
connectDB()

const app = express();


// body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Method override
app.use(
    methodOverride(function(req, res) {
        if (req.body && typeof req.body === 'object' && '_method' in req.body) {
            // look in urlencoded POST bodies and delete it
            let method = req.body._method
            delete req.body._method
            return method
        }
    })
)

// Express Session
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI })
}));

// flash
app.use(flash());

// handlebars
app.engine('.hbs', exphbs.engine({
    helpers: {
        formatDate,
        getTotalPrice,
        getImage,
        select
    },
    defaultLayout: 'main',
    extname: '.hbs'
}));

app.use(express.static(path.join(__dirname, 'public')))
app.set('view engine', '.hbs');

// passport
app.use(passport.initialize());
app.use(passport.session());

// global varieble 
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

// morgan
app.use(morgan('dev'));

// routes
app.use('/auth', require('./router/auth'));
app.use('/', require('./router/index'));
app.use('/user', require('./router/users'));
app.use('/products', require('./router/products'));
app.use('/sale', require('./router/sale'))

const port = process.env.PORT;

app.listen(port, () => {
    console.log(`Application is running on port ${port}`);
});