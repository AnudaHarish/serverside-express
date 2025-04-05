const express = require("express");
const path = require("path");
const app = express();
const port = 3500;


app.get("/", (req,res) => {
    res.send("default path");
});

app.listen(port, () => {
    console.log("Listening on port " + port);
})