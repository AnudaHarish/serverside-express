const express = require("express");
const path = require("path");
const app = express();
const port = 3500;
const cors = require('cors')
const corsOptions = require("./config/corsConfig");
const {logger} = require("./middleware/customLogger");
const error = require("./middleware/cutomeErrorLog");
const db = require("./config/databaseConfig");

//get form data passing through http requests
//this is default middleware
app.use(express.urlencoded({ extended: false }));

//handle data if the type json
app.use(express.json());

//cross-origin resource sharing
app.use(cors(corsOptions));

//use custom logger
app.use(logger);

//routes
app.use("/signup", require("./routes/createUser"));
app.use("/login", require("./routes/userLogin"));

app.get("/", (req,res) => {
    res.send("default path");
});

app.use("/countries", require("./routes/countries"));

// app.all("*", (req,res) => {
//     res.status(404)
// });

app.use(error);

app.listen(port, () => {
    console.log("Listening on port " + port);
})