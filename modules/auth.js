const express = require("express")
const fetch = require("node-fetch")
const btoa = require('btoa');
const db = require("../db/db")
const config = require("../config/main.json")
const router = express.Router()

router.all('/addusertodb', async (req, res) => {
    if(!req.query.accesstoken) return res.json({success: false, message: "No access token supplied"})
    if(!req.query.tokentype) return res.json({success: false, message: "No token type supplied"})
    if(req.query.strsftauth != config.strsftauth) return res.json({success: false, message: "Not authorized."})

    // Get basic info
    fetch("https://discordapp.com/api/users/@me", {
        method: 'get',
        headers: {
            Authorization: `${req.query.tokentype} ${req.query.accesstoken}`
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
    .catch((err) => {
        return res.json({success: false, message: "Internal error - DiscordAcctGet returned an error", error: err})
    })

    res.json({success: true})
})

module.exports = router;