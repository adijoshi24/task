const mongoose = require('mongoose');
let userSchema = mongoose.Schema({
    inputName:  String,
    ddlDoctor: String,
    inputDOB: String,
    inputPhone: String,
    InputEmail: {
        type: String,    
        unique: 'Two users cannot share the same username',
    }
});

// let's create two conflicting documents
let User = mongoose.model('Model', userSchema);
module.exports = User;