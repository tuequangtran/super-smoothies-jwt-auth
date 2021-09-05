//the code in this project was left unrefactored for educational purposes

const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes.js');
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./middleware/authMiddleware.js');

dotenv.config();
const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

// view engine
app.set('view engine', 'ejs');

// database connection
const dbURI = process.env.MONGODB_URI;
mongoose
	.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
	.then((result) =>
		app.listen(process.env.PORT || 3000, () => {
			console.log('port 3000 running');
		})
	)
	.catch((err) => console.log(err));

// routes
app.get('*', checkUser); //apply check user middleware to every single get request and shows user in the header
app.use(authRoutes);
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', requireAuth, (req, res) => res.render('smoothies'));

// //parsing cookies
// app.get('/set-cookies', (req, res) => {
// 	//res.setHeader('Set-Cookie', 'newUser=true'); //set cookie using express
// 	res.cookie('newUser', false);
// 	res.cookie('isEmployee', true, { maxAge: 1000 * 60 * 60 * 24, httpOnly: true });
// 	res.send('you got cookies');
// });

// app.get('/read-cookies', (req, res) => {
// 	const cookies = req.cookies;
// 	console.log(cookies);
// 	res.json(cookies);
// });
