const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");

const app = express();
app.set('view engine', 'ejs');
app.use(express.static("public"));

app.get("/", function (req, res) {
    res.render("home");
});

app.listen(3000, function () {
    console.log("server started at port 3000")
});
