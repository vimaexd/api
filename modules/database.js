const express = require("express")
const fetch = require("node-fetch")
const db = require("../db/db")
const router = express.Router()

router.all('/', (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.send("Hey! What are you doing in here? Get out.")
})

router.get('/projects', (req, res) => {
    db.all("SELECT * FROM projects", [], (err, rows) => {
        if(err){
            throw err;
        }
        res.set('Access-Control-Allow-Origin', '*');
        res.send(rows)
    })
})

router.post('/projects', async (req, res) => {
    let discToken = req.get("X-DiscordToken")
    let body = req.body

    if(!discToken) return res.send("Invalid Token!")
    if(!body) return res.send("No body!")

    let disres = await fetch("https://discordapp.com/api/users/@me", {
        method: 'get',
        headers: {
            authorization: `Bearer ${discToken}`
        }
    })
    let userInfo = await disres.json()

    // Query for Admin Permissions
    db.all(`SELECT * FROM users WHERE discordID=${userInfo.id}`, [], (err, rows) => {
        if(err){
            throw err;
        }
        
        if(rows === []) return res.send("User not registered in database!")
        if(rows[0].administrator !== 1) return res.status(403)
    })

    let dbinsert = db.prepare('INSERT INTO projects VALUES(?, ?, ?)')

    dbinsert.run([body.name, body.description, body.link])
    res.set('Access-Control-Allow-Origin', '*');
    res.status(200)
})

module.exports = router;