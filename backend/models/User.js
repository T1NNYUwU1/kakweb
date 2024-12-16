const mongoose  = require('mongoose');

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone_number: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    street_address: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true },
    state: {
        type: String,
        required: true
    },
    postal_code: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: "0"
    },
    donation_id: {
        type: Map,
        of: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Donation'
        },
        default: {}
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    resetPasswordOTP: {
        type: String,
        default: null
    },
    resetPasswordOTPExpires: {
        type: Date,
        default: null
    },
    verificationOTP: {
        type: String, 
        default: null 
    },
    verificationOTPExpires: {
        type: Date, 
        default: null 
    },
},{timestamps: true}
);

module.exports = mongoose.model('User', userSchema);