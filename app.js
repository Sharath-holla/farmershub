const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const methodOverride = require('method-override');
const User = require('./models/user'); // Ensure this path points to your User model
const Warehouse = require('./models/warehouse'); // Ensure this path points to your Warehouse model

// Database Connection
mongoose.connect('mongodb://localhost:27017/practicehub')

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

// Setting up view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(session({
    secret: 'yourSecretKey', // Replace with a secure key in production
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// Passport Configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware to Set Current User
app.use((req, res, next) => {
    res.locals.currentUser = req.user; // Makes currentUser available in all templates
    next();
});

// Custom Middleware to Require Login for Specific Routes
const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl; // Save the intended URL
        return res.redirect('/login');
    }
    next();
};

// Routes
app.get('/', (req, res) => {
    res.render('home');
});

// Register Route
app.get('/register', (req, res) => {
    res.render('warehouses/register');
});

app.post('/register', async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            res.redirect('/warehouses');
        });
    } catch (e) {
        res.redirect('register');
    }
});

// Login Route
app.get('/login', (req, res) => {
    res.render('warehouses/login');
});

app.post('/login', passport.authenticate('local', { 
    failureRedirect: '/login'
}), (req, res) => {
    const redirectUrl = req.session.returnTo || '/warehouses'; // Check for return URL
    delete req.session.returnTo; // Clear return URL after redirecting
    res.redirect(redirectUrl);
});

// Logout Route
app.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        res.redirect('/');
    });
});

// Warehouse Routes
app.get('/warehouses', async (req, res) => {
    const warehouses = await Warehouse.find({});
    res.render('warehouses/index', { warehouses });
});

app.get('/warehouses/new', isLoggedIn, (req, res) => {
    res.render('warehouses/new');
});

app.post('/warehouses', isLoggedIn, async (req, res) => {
    const warehouse = new Warehouse(req.body.warehouse);
    await warehouse.save();
    res.redirect(`/warehouses/${warehouse._id}`);
});


app.get('/warehouses/:id', async (req, res) => {
    try {
        const warehouse = await Warehouse.findById(req.params.id).populate('author'); // Make sure to populate if needed
        res.render('warehouses/show', { warehouse, currentUser: req.user });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

app.get('/warehouses/:id/edit', isLoggedIn, async (req, res) => {
    const warehouse = await Warehouse.findById(req.params.id);
    res.render('warehouses/edit', { warehouse });
});

app.put('/warehouses/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const warehouse = await Warehouse.findByIdAndUpdate(id, req.body.warehouse, { new: true });
    res.redirect(`/warehouses/${warehouse._id}`);
});

app.delete('/warehouses/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    await Warehouse.findByIdAndDelete(id);
    res.redirect('/warehouses');
});
app.get('/products',(req,res) =>{
    res.render('warehouses/products')
})
app.get('/chathub',(req,res) =>{
    res.render('warehouses/chathub')
})
app.get('/digital',(req,res) =>{
    res.render('warehouses/digital')
})
app.get('/innovation',(req,res) =>{
    res.render('warehouses/innovation')
})

// Start Server
app.listen(3000, () => {
    console.log('Serving on port 3000');
});

