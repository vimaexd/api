import { Request, Response } from "express";
import axios from "axios";

class Twitch {
    private access_token: string;

    constructor(){
        this.access_token = "";

        this.initialize()
    }

    private async initialize(){
        await this.getOAuth()
    }

    private async getOAuth() {
        let _token: string = "";

        try {
            const res = await axios({
                method: "POST",
                baseURL: "https://id.twitch.tv",
                url: "/oauth2/token",
                params: {
                    "client_id": process.env.TWITCH_CLIENTID,
                    "client_secret": process.env.TWITCH_CLIENTSECRET,
                    "grant_type": "client_credentials"
                }
            })
    
            if(!res.data.access_token) return;
            _token = res.data.access_token   
        } catch(err) {
            console.log("[Twitch] Error getting creds - " + err.response.data)
        }

        this.access_token = _token;
    }

    getChannel(req: Request, res: Response){
        if(this.access_token === "") return res.json({success: false, description: "Twitch authentication failed server-side"})
        axios({
            baseURL: "https://api.twitch.tv/helix",
            url: "/search/channels",
            headers: {
                "Authorization": `Bearer ${this.access_token}`,
                "Client-Id": process.env.TWITCH_CLIENTID
            },
            params: {
                "query": "etstringy",
                "first": "1"
            }
        })
        .then(tw_res => {
            return res.send(tw_res.data.data[0])
        })
    }
}

export default Twitch;