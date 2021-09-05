//the code in this project was left unrefactored for educational purposes

const User = require('../models/User.js');
const jwt = require('jsonwebtoken');

//handle errors
const handleErrors = (err) => {
	console.log(err.code, err.message);
	let errors = { email: '', password: '' };
	// incorrect email
	if (err.message === 'incorrect email') {
		errors.email = 'Email is not registered';
	}

	// incorrect password
	if (err.message === 'incorrect password') {
		errors.password = 'Password is incorrect';
	}

	//duplicate error code
	if (err.code === 11000) {
		errors.email = 'that email is already registered';
		return errors;
	}

	//validation errors
	if (err.message.includes('User validation failed')) {
		Object.values(err.errors).forEach(({ properties }) => {
			errors[properties.path] = properties.message;
		});
	}
	return errors;
};
//jwt tokens
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
	return jwt.sign({ id }, 'secret', {
		expiresIn : maxAge
	});
};

const signup_get = (req, res) => {
	res.render('signup');
};
const signup_post = async (req, res) => {
	const { email, password } = req.body;
	try {
		const user = await User.create({ email, password });
		const token = createToken(user._id);
		res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
		res.status(201).json({ user: user._id });
	} catch (err) {
		const errors = handleErrors(err);
		res.status(400).json({ errors });
	}
};
const login_get = (req, res) => {
	res.render('login');
};
const login_post = async (req, res) => {
	const { email, password } = req.body;
	try {
		const user = await User.login(email, password);
		const token = createToken(user._id);
		res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
		res.status(200).json({ user: user._id });
	} catch (err) {
		const errors = handleErrors(err);
		res.status(400).json({ errors });
	}
};

const logout_get = (req, res) => {
	res.cookie('jwt', '', { maxAge: 1 });
	res.redirect('/');
};

module.exports = {
	signup_get,
	signup_post,
	login_get,
	login_post,
	logout_get
};
