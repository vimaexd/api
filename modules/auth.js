const express = require("express")
const fetch = require("node-fetch")
const btoa = require('btoa');
const db = require("../db/db")
const config = require("../config/main.json")
const router = express.Router()
let redirect;
if(process.env.NODE_ENV === "production"){
    redirect = encodeURIComponent("https://api.stringy.software/auth/callback")
} else if(process.env.NODE_ENV === "development"){
    redirect = encodeURIComponent("http://localhost:8071/auth/callback");
}
router.all('/', (req, res) => {
    res.send("Stringy Software Authorisation Servers ")
})

router.all('/login', (req, res) => {
    res.redirect(`https://discordapp.com/oauth2/authorize?client_id=${config.discordKeys.clientID}&response_type=code&redirect_uri=${redirect}&scope=identify`)
})

router.all('/callback', async (req, res) => {
    let url;
    if(process.env.NODE_ENV === "production"){
        url = config.urls.prod
    } else if(process.env.NODE_ENV === "development"){
        url = config.urls.dev
    }

    // res.cookie('loggedin', 'true', {domain: "http://localhost:8080"})
    // res.cookie('access_token', json.access_token, {domain: url, maxAge: 1209600000, httpOnly: false});
    // res.cookie('token_type', json.token_type, {domain: url, maxAge: 1209600000, httpOnly: false});
    
    console.log(`${JSON.stringify(req.query)}`)
    // // Get basic info
    fetch("https://discordapp.com/api/users/@me", {
        method: 'get',
        headers: {
            Authorization: `${req.query.token_type} ${req.query.access_token}`
        }
    })
    .then(res => res.json())
    .then(userInfo => {
        db.all(`SELECT COUNT(1) AS isRegistered FROM users WHERE discordID=${userInfo.id}`, [], (err, rows) => {
            if(err) throw err;
            let isRegistered = rows[0].isRegistered
            if(isRegistered === 0){
                let dbinsert = db.prepare('INSERT INTO users VALUES(?, ?, false, false)')
                dbinsert.run([`${userInfo.username}#${userInfo.discriminator}`, userInfo.id])
                console.log(`User ${userInfo.username}#${userInfo.discriminator} registered in database.`)
            }
            console.log(`User ${userInfo.username}#${userInfo.discriminator} Logged in`)
        })
    })

    res.redirect(url + `/setCookie?access_token=${req.query.access_token}&token_type=${req.query.token_type}`)
})

module.exports = router;