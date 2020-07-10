require("dotenv").config()
const express = require("express")
const bodyParser   = require('body-parser');
const pack = require("./package.json")
const db = require("./db/db.js")
const colors = require("colors")
const config = require("./config/main.json")
const path = require("path")

const app = express()
const port = 8071


// Squaky Clean!
app.use(require('sanitize').middleware);

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'X-DiscordToken, Content-Type');
    next();
});
app.use(express.json());
app.use("/auth", require("./modules/auth"));
app.use("/database", require("./modules/database"));
app.use("/flutecoin", require("./modules/flutecoin"));
app.use("/podcast", express.static(path.join(__dirname, 'podcast')));

app.get('/', (req, res) => {
    res.json({
        "code": 200,
        "version": pack.version,
        "somethingamazing": "👽"
    })
})

app.get('/randomquote', (req, res) => {
    let tagarray = require("./config/randomTagline")
    let tagrandom = Math.floor(Math.random()*tagarray.length);
    res.set('Access-Control-Allow-Origin', '*');
    res.send(tagarray[tagrandom])
})

app.listen(port, () => {
    console.log("Stringy Software API".yellow.bold)
    console.log(`v${pack.version} | Running in ${process.env.NODE_ENV} mode`.green)
    console.log("by etStringy | :ufo:".blue)
    console.log(`Listening on port ${port}`.reset)
})