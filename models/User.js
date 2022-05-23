const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: String,
    password_hash: String,
    salt: String,
    role: String
});

const User = mongoose.model("user", userSchema);

module.exports = User;