if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}


const express = require('express');
const app = express();
const Path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const passport = require('passport');
const localstrategy = require('passport-local');
const expresserror = require('./utils/expresserrors');

const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet')
const User = require('./models/user');

const userroutes = require('./routes/users');
const campgroundsroutes = require('./routes/campground');
const reviewroutes = require('./routes/reviews');
const MongoStore = require('connect-mongo');
const dbUrl = process.env.DB_url || 'mongodb://localhost:27017/yelpcamp';

mongoose.connect(dbUrl);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => {
    console.log('Database connected');
});
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', Path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(Path.join(__dirname, 'public')));
app.use(mongoSanitize());

const secret = process.env.SECRET

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret
    }
})

const sessionconfig = {
    store,
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    }
}
app.use(session(sessionconfig));
app.use(flash());
// app.use(helmet())

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    // "https://api.tiles.mapbox.com/",
    // "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
    "https://cdn.maptiler.com/", // add this
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    // "https://api.mapbox.com/",
    // "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net",
    "https://cdn.maptiler.com/", // add this
];
const connectSrcUrls = [
    // "https://api.mapbox.com/",
    // "https://a.tiles.mapbox.com/",
    // "https://b.tiles.mapbox.com/",
    // "https://events.mapbox.com/",
    "https://api.maptiler.com/", // add this
];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dago3du9s/",
                "https://api.maptiler.com/",
                "https://rexclarkeadventures.com/wp-content/uploads/2024/10/1521559486434.jpg"

            ]
        }
    })
);


app.use(passport.initialize());
app.use(passport.session());
passport.use(new localstrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentuser = req.user
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
}
)

app.use('/', userroutes);
app.use('/campgrounds', campgroundsroutes);
app.use('/campgrounds/:id/reviews', reviewroutes);

app.get('/', (req, res) => {
    res.render('home');
});


app.all('*', (req, res, next) => {
    next(new expresserror('page not found!!', 404))
})

app.use((err, req, res, next) => {
    if (!err.message) err.message = 'something went wrong';
    if (!err.statusCode) err.statusCode = 500;
    const { message, statusCode } = err;
    res.status(statusCode).render('error', { err });
})

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});