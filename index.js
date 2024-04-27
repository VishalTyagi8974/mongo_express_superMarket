const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const Product = require("./models/product");
const methodOverride = require("method-override");
const app = express();

const catagories = Product.schema.obj.catagory.enum;

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/superMarket')
    .then(() => console.log("connected to DB"))
    .catch((e) => {
        console.log("couldn't get connected to DB");
        console.log(e);
    })


app.set("view engine", "ejs");

app.set("views", path.join(__dirname, "/views"));

app.listen(3000, () => {
    console.log("starts listening on port 3000");
})

app.get("/products", async (req, res) => {
    const { cat } = req.query;
    if (cat) {
        try {
            const products = await Product.find({ catagory: cat });
            res.render("products/index", { products, cat });

        } catch (e) {
            console.log(e)
            res.send("unable to Reach")
        }
    } else {
        try {
            const products = await Product.find({})
            res.render("products/index", { products, cat: "All" });
        } catch (e) {
            console.log(e);
            res.send("unable to Reach")
        }
    }

})

app.get("/products/new", (req, res) => {
    res.render("products/createNew")
})
app.get("/products/:id", async (req, res) => {
    const id = req.params.id
    try {
        const prod = await Product.findById(id)
        res.render("products/show", { prod, catagories })
    } catch (e) {
        console.log(e);
        res.send("unable to Reach")
    }
})

app.get("/products/:id/edit", async (req, res) => {
    const { id } = req.params;
    try {
        const prod = await Product.findById(id)
        res.render("products/edit", { prod, catagories });

    } catch (e) {
        console.log(e)
        res.send("unable to Reach")
    }
})


app.post("/products", async (req, res) => {
    const { name, pricePerKg, catagory } = req.body;
    const newProduct = new Product({ name: name, pricePerKg: pricePerKg, catagory: catagory })
    try {
        await newProduct.save()
        res.redirect("/products");
    } catch (e) {
        console.log(e);
        res.send("unable to Reach")
    }

})

app.put("/products/:id", async (req, res) => {
    const { id } = req.params
    const { name, price, catagory } = req.body;

    try {
        await Product.findByIdAndUpdate(id, { name: name, pricePerKg: price, catagory: catagory }, { new: true, runValidators: true });
        res.redirect("/products");

    }
    catch (e) {
        console.log(e)
        res.send("unable to Reach")
    }
})

app.delete("/products/:id", async (req, res) => {
    const id = req.params.id;
    try {
        await Product.findByIdAndDelete(id);
        res.redirect("/products");
    } catch (e) {
        console.log(e);
        res.send("unable to Reach")
    }

})
