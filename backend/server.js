const express = require("express");
const path = require("path");
const app = express();
const port = 3500;
const cors = require('cors')
const corsOptions = require("./config/corsConfig");
const {logger} = require("./middleware/customLogger");
const error = require("./middleware/cutomeErrorLog");
const cookieParser = require("cookie-parser");
const db = require("./config/databaseConfig");
const verifyJwt = require("./middleware/verifyJwt");
const {getAllCountries} = require("./service/fetchCountries");
//get form data passing through http requests
//this is default middleware
app.use(express.urlencoded({ extended: false }));

//handle data if the type json
app.use(express.json());
app.use(cookieParser());
//cross-origin resource sharing
app.use(cors(corsOptions));

//use custom logger
app.use(logger);

//Initialize cache on start
async function initializedCache() {
    try{
        await getAllCountries();
        console.log("Country cache initialized");
    }catch (err){
        console.error("Cache initialized failed",err.message);
    }
}

initializedCache();

//routes
app.use("/api/signup", require("./routes/createUser"));
app.use("/api/login", require("./routes/userLogin"));

app.use("/api/refresh", require("./routes/refreshToken"));
app.use("/api/logout", require("./routes/logout"));

app.use(verifyJwt);
app.get("/api", (req,res) => {
    res.status(200).json({"message":"default path"});
});

app.use("/api/countries", require("./routes/countries"));

// app.all("*", (req,res) => {
//     res.status(404)
// });

app.use(error);

app.listen(port, () => {
    console.log("Listening on port " + port);
})