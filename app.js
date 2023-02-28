const express = require("express");
const date = require(__dirname + "/date.js");

const app = express();
const items = [];

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {

    const day = date.getDate();

    res.render("list", {
        listTitle: day,
        newListItems: items
    });

});

app.post("/", function (req, res) {
    let item = req.body.newItem;
    if (item === "delete") {
        items.pop();
        res.redirect("/");
    } else {
        function titleCase(item) {
            item = item.toLowerCase().split(' ');
            for (var i = 0; i < item.length; i++) {
                item[i] = item[i].charAt(0).toUpperCase() + item[i].slice(1);
            }
            return item.join(' ');
        }
        item = titleCase(item);
        items.push(item);
        res.redirect("/");
    }
});


app.listen(process.env.PORT || 3000, function () {
    console.log("Server is running on port 3000");
});