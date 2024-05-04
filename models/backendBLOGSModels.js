
            const mongoose = require('mongoose');
            const { Schema } = mongoose;
        
            const blogsSchema = new Schema({
                Title: { type: 'string', required: true, maxLength: 20 },
                Description: { type: 'string', required: true },
                image: { type: 'string', required: true },
                Sujet: { type: 'string' },  
            });
        
            const blogs = mongoose.model('blogs', blogsSchema);
        
            module.exports = blogs;
        