const mongoose = require('mongoose');
const dataSchema = new mongoose.Schema({
    
    name:{ 
        require:true,
        type: String
    },
    username:{
        require:true,
        type: String
    }, 
    password:{
        required:true, 
        type: String
    }, 
    rule:[{
        required:false, 
        type: String
    }],
    comment:[{
        required:false,
        type: String
    }]
})

module.exports = mongoose.model('User', dataSchema)