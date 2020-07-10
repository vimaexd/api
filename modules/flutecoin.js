const express = require("express")
const fetch = require("node-fetch")
const db = require("../db/db")
const config = require("../config/main.json")
const router = express.Router()

router.get('/amount', (req, res) => {
    if(!req.query.token) return res.send("No key provided!")
    if(!config.fluteCoinKeys.includes(req.query.token)) return res.send("Invalid key!")
    if(!req.query.discordID) return res.send("No discord ID supplied!")

    db.all(`SELECT * FROM flutecoin WHERE discordID=${req.query.discordID}`, [], (err, rows) => {
        if(err){
            throw err;
        }
        res.set('Access-Control-Allow-Origin', '*');
        res.send(rows)
    })
})

router.get('/register', (req, res) => {
    if(!req.query.token) return res.send("No key provided!")
    if(!config.fluteCoinKeys.includes(req.query.token)) return res.send("Invalid key!")
    if(!req.query.discordID) return res.send("No discord ID supplied!")

    db.all(`SELECT COUNT(1) AS isRegistered FROM flutecoin WHERE discordID=${req.query.discordID}`, [], (err, rows) => {
        if(err) throw err;
        let isRegistered = rows[0].isRegistered
        if(isRegistered === 0){
            let dbinsert = db.prepare('INSERT INTO flutecoin VALUES(?, ?)')
            dbinsert.run([req.query.discordID, "5"])
            console.log(`User registered in Flutecoin database.`)
            res.send("Registered")
        } else {
            res.send("User is already registered!")
        }
    })
})

router.get('/add', (req, res) => {
    // Auth
    if(!req.query.token) return res.send("No key provided!")
    if(!config.fluteCoinKeys.includes(req.query.token)) return res.send("Invalid key!")

    if(!req.query.fromName) return res.send("No fromName supplied!")
    if(!req.query.fromID) return res.send("No fromID supplied!")

    if(!req.query.toID) return res.send("No toID supplied!")
    if(!req.query.toadd) return res.send("Nothing to add!")
    if(!req.query.message) return res.send("No message supplied!")

    let transaction = db.prepare(`INSERT INTO flutecoin-transactions VALUES(?, ?, ?, ?, ?)`)
    let dbinsert = db.prepare(`UPDATE flutecoin SET amount = amount + ? WHERE discordID = ?`)
    dbinsert.run([req.query.toadd, req.query.discordID])
    transaction.run([req.query.fromName, req.query.fromID, req.query.toID, req.query.toadd, req.query.message])
    res.send("Added")
})

router.get('/totalusers', (req, res) => {
    if(!req.query.token) return res.send("No key provided!")
    if(!config.fluteCoinKeys.includes(req.query.token)) return res.send("Invalid key!")
    db.all(`SELECT COUNT(discordID) AS reg FROM flutecoin`, [], (err, rows) => {
        if(err) throw err;
        res.json(rows)
    })
})

module.exports = router;