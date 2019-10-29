const express = require("express")
const pack = require("./package.json")

const app = express()
const port = 8071

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
    let style = {
        "yellow":"\x1b[33m",
        "green":"\x1b[32m",
        "bright":"\x1b[1m",
        "reset":"\x1b[0m",
        "blue":"\x1b[34m"
    }
    console.log(style.yellow + style.bright + "Stringy Software API")
    console.log(style.green + `v${pack.version}`)
    console.log(style.blue + "by etStringy | :ufo:")
    console.log(`Listening on port ${port}` + style.reset)
})