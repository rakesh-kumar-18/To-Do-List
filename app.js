const express = require("express");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");
require("dotenv").config();

const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const userName = process.env.USER_NAME;
const password = process.env.PASSWORD;

const uri = "mongodb+srv://" + userName + ":" + password + "@cluster0.3q1zzrf.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const itemsSchema = mongoose.Schema({
    name: String
});

const Item = mongoose.model("Item", itemsSchema);

app.get("/", function (req, res) {

    const day = date.getDate();

    Item.find({}).then(function (foundItems) {
        res.render("list", { listTitle: day, newListItems: foundItems });
    }).catch(function (error) {
        console.log(error);
    });

});

app.post("/", function (req, res) {
    let itemName = req.body.newItem;

    function titleCase(itemName) {
        itemName = itemName.toLowerCase().split(' ');
        for (var i = 0; i < itemName.length; i++) {
            itemName[i] = itemName[i].charAt(0).toUpperCase() + itemName[i].slice(1);
        }
        return itemName.join(' ');
    }
    itemName = titleCase(itemName);

    const item = new Item({
        name: itemName
    });

    item.save().then(function () {
        res.redirect("/");
    });
});

app.post("/delete", function (req, res) {
    const checkedItemId = req.body.checkbox;
    Item.findByIdAndRemove(checkedItemId).then(function () {
        console.log("Successfully deleted.");
        res.redirect("/");
    });
});


app.listen(process.env.PORT || 3000, function () {
    console.log("Server is running on port 3000");
});