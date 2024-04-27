const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    pricePerKg: {
        type: Number,
        required: true
    },
    catagory: {
        type: String,
        enum: ["dairy", "vegetable", "fruit"]
    }
})



const Product = mongoose.model("Product", productSchema);

module.exports = Product;





