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
    res.set('Access-Control-Allow-Origin', '*');

    let discToken = req.get("X-DiscordToken")
    let body = req.body

    if(!discToken) return res.json({status: 500})
    if(!body) return res.send("No body!")

    let disres = await fetch("https://discordapp.com/api/users/@me", {
        method: 'get',
        headers: {
            authorization: `Bearer ${discToken}`
        }
    })
    let userInfo = await disres.json()
    if(userInfo.code < 0 ) return res.json({status: 403})

    console.log("Writing new project...")
    console.log("Body: " + JSON.stringify(req.body))
    db.serialize(() => {
        // Query for Admin Permissions
        db.all(`SELECT * FROM users WHERE discordID=${userInfo.id}`, [], (err, rows) => {
            if(err){
                throw err;
            }
        
            if(rows === []) return res.send("User not registered in database!")
            if(rows[0].administrator !== 1) return res.json({status: 403})
        })
        console.log("Got userinfo from db")
    })
    db.serialize(() => {
        let dbinsert = db.prepare('INSERT INTO projects VALUES(?, ?, ?, ?)')
        console.log("Ready to insert")
        db.serialize(() => {
            dbinsert.run([body.name, body.description, body.link, body.image])
            console.log("Inserted")
        })
    })
    res.json({status: 200})
})

router.post('/deleteProject', async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');

    let discToken = req.get("X-DiscordToken")
    let body = req.body

    if(!discToken) return res.json({status: 500})
    if(!body) return res.send("No body!")

    let disres = await fetch("https://discordapp.com/api/users/@me", {
        method: 'get',
        headers: {
            authorization: `Bearer ${discToken}`
        }
    })
    let userInfo = await disres.json()
    if(userInfo.code < 0 ) return res.json({status: 403})
    
    console.log("Deleting project..")
    console.log("Body: " + JSON.stringify(req.body))
    db.serialize(() => {
        // Query for Admin Permissions
        db.all(`SELECT * FROM users WHERE discordID=${userInfo.id}`, [], (err, rows) => {
            if(err){
                throw err;
            }
        
            if(rows === []) return res.send("User not registered in database!")
            if(rows[0].administrator !== 1) return res.json({status: 403})
        })
        console.log("Got userinfo from db")
    })
    db.serialize(() => {
        db.all(`DELETE FROM projects WHERE name="${body.projectname}"`, [], (err) => {
            if(err) throw err;
        })
        db.all(`DELETE FROM projects WHERE name IS NULL`, [], (err) => {
            if(err) throw err;
        })
        console.log("Deleted.")
    })
    res.json({status: 200})
})

router.get('/profile', async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    let discToken = req.get("X-DiscordToken")

    if(!discToken) return res.send("Invalid Token!")

    let disres = await fetch("https://discordapp.com/api/users/@me", {
        method: 'get',
        headers: {
            authorization: `Bearer ${discToken}`
        }
    })
    let userInfo = await disres.json()
    if(userInfo.code < 0 ) return res.json({status: 403})
    
    // Query for Admin Permissions
    db.all(`SELECT * FROM users WHERE discordID=${userInfo.id}`, [], (err, rows) => {
        if(err){
            throw err;
        }
        
        if(rows === []) return res.send("User not registered in database!")
        res.send(rows)
    })
    

})

module.exports = router;