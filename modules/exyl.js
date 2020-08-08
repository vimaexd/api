const express = require("express")
const fetch = require("node-fetch")
const config = require("../config/main.json")
const exyl = express.Router()

exyl.get('/', (req, res) => {
    res.send("nice logo")
})

exyl.get('/videos', (req, res) => {
    fetch(`https://www.googleapis.com/youtube/v3/search?key=${config.gapikey}&channelId=UCNgchdiFrWvmjXKOKX5Vfsg&part=snippet`)  
        .then(res => res.json())
        .then(json => {
            res.send(json.items)
        })
})

module.exports = exyl;