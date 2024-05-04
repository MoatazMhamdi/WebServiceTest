
        const mongoose = require('mongoose');
        const { Schema } = mongoose;
    
        const usersSchema = new Schema({
            username: { type: 'string', required: true, maxLength: 20 },
            email: { type: 'string', required: true },
            numTel: { type: 'string', required: true },
            password: { type: 'string', required: true },  
        });
    
        const users = mongoose.model('users', usersSchema);
    
        module.exports = users;
        