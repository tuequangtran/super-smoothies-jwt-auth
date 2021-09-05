//the code in this project was left unrefactored for educational purposes

const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
	email    : {
		type      : String,
		required  : [ true, 'Please enter an email' ],
		unique    : true,
		lowercase : true,
		validate  : [ isEmail, 'Please enter valid email' ]
	},
	password : {
		type      : String,
		required  : [ true, 'Please enter a password' ],
		minlength : [ 6, 'Please enter at least 6 characters' ]
	}
});

//hash password before new user saved to db
userSchema.pre('save', async function(next) {
	const salt = await bcrypt.genSalt();
	//console.log('user about to be created', this);
	this.password = await bcrypt.hash(this.password, salt);
	//console.log('user about to be created', this);
	next();
});

//fire a function after new user saved
userSchema.post('save', function(userInfoObject, next) {
	console.log('new user created', userInfoObject);
	next();
});

//static method to login a user
userSchema.statics.login = async function(email, password) {
	const user = await this.findOne({ email: email });
	if (user) {
		const auth = await bcrypt.compare(password, user.password);
		if (auth) {
			return user;
		}
		throw Error('incorrect password');
	}
	throw Error('incorrect email');
};

const User = mongoose.model('User', userSchema);

module.exports = User;
