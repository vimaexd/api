const express = require("express")
const fetch = require("node-fetch")
const btoa = require('btoa');
const db = require("../db/db")
const config = require("../config/main.json")
const router = express.Router()

router.all('/', (req, res) => {
    res.send("Stringy Software Authorisation Servers ")
})

router.all('/login', (req, res) => {
    let redirect = encodeURIComponent(req.protocol + '://' + req.get('host') + "/auth/callback");
    res.redirect(`https://discordapp.com/oauth2/authorize?client_id=${config.discordKeys.clientID}&response_type=code&redirect_uri=${redirect}&scope=connections%20identify`)
})

router.all('/callback', async (req, res) => {
    let code = req.query.code
    let creds = btoa(`${config.discordKeys.clientID}:${config.discordKeys.clientSecret}`);
    let redirect = encodeURIComponent(req.protocol + '://' + req.get('host') + "/auth/callback");

    // check if a code was provided
    let url;
    if(process.env.NODE_ENV === "production"){
        url = config.urls.prod
    } else if(process.env.NODE_ENV === "development"){
        url = config.urls.dev
    }
    if(!code) return res.redirect(`${url}?denied=1`);

    // fetch for a token
    const response = await fetch(`https://discordapp.com/api/oauth2/token?grant_type=authorization_code&code=${code}&redirect_uri=${redirect}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Basic ${creds}`,
      },
    });
    const json = await response.json();
    
    res.cookie('access_token', json.access_token, {domain: url, maxAge: 1209600000});
    res.cookie('token_type', json.token_type, {domain: url, maxAge: 1209600000});

    // // Get basic info
    fetch("https://discordapp.com/api/users/@me", {
        method: 'get',
        headers: {
            authorization: `${json.token_type} ${json.access_token}`
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

    res.redirect(url)
})

module.exports = router;