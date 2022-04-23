const mongoose = require('mongoose')

const PostcardSchema = new mongoose.Schema({
    city: {
        type: String, required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    },
    firstName: {
        type: String, required: true
    },
    createAt: {
        type: Date, default: Date.now()
    },
    giorno:{
        type: String, required: true
    },
    foto:{
        type: String
    }

})

module.exports = mongoose.model('Postcard', PostcardSchema)

