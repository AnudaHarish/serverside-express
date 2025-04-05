const whiteList = ['http://www.google.com', 'http://localhost:3500', 'https://restcountries.com/'];
const corsOptions = {
    origin: (origin, callback) => {
        if(whiteList.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        }else{
            callback(new Error("Not allowed by cors"));
        }
    },
    optionsSuccessStatus: 200
}

module.exports = corsOptions;