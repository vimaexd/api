import {Request, Response} from 'express';
import fs from 'fs';
import path from 'path';
import axios, {AxiosInstance} from 'axios';
import Log from '../utils/Log';

const l = new Log({prefix: 'EShop'});

/**
 * Class for getting Twitch channel info for the API
 */
export default class EShop {
    cacheFolder: string;
    cachePath: string;
    eshopData: any;

    /**
     * Initialize class variables
     */
    constructor() {
      this.eshopData = [{
        docs: []
      }];
      this.initialize();
    }

    /**
     * Initialize function to run other functions asyncronously
     */
    private async initialize() {
      this.cacheFolder = path.join(__dirname, '../../', 'cache', 'eshop');
      this.cachePath = path.join(this.cacheFolder, "data.json");
      fs.mkdirSync(this.cacheFolder, {recursive: true});

      if(!fs.existsSync(this.cachePath)){
        fs.writeFileSync(this.cachePath, this.eshopData, {encoding: "utf-8"})
      } else {
        this.eshopData = JSON.parse(fs.readFileSync(this.cachePath, {encoding: "utf-8"}));
      }
      
      this.updateGames();
      l.log("E-Shop started")
    }

    updateGames() {
      const url = 'http://search.nintendo-europe.com/en/select';
      const staticArgs = 'fq=type%3AGAME%20AND%20system_type%3Anintendoswitch*%20AND%20product_code_txt%3A*&q=*&sort=sorting_title%20asc&start=0&wt=json&'
      const rows = 10000
      
      const res = axios.get(
        url + "?" + staticArgs + `rows=${rows}`
      )
      .then(res => {
        this.eshopData = res.data.response
        fs.writeFileSync(this.cachePath, JSON.stringify(res.data.response), {encoding: "utf-8"})
        l.log(`E-Shop data updated! (${this.eshopData.docs.length} games)`)
      })
      .catch(err => {
        console.log(err)
        l.log("Error updating E-Shop data!")
      })
    }

    searchRoute(req: Request, res: Response) {
      if (this.eshopData.docs.length === 0) {
        return res.json({
          success: false,
          description: 'No EShop data serverside',
        });
      }

      if (!req.query.q) {
        return res.json({
          success: false,
          description: 'Invalid search query',
        });
      }

      const data = this.eshopData.docs
        .filter((item: any) => (
          item.title
          .toLowerCase()
          .includes((req.query.q as string).toLowerCase())
        ));
      return res.send(data)
    }

    allRoute(req: Request, res: Response) {
      if (this.eshopData.length === 0) {
        return res.json({
          success: false,
          description: 'No EShop data serverside',
        });
      }

      return res.json(this.eshopData.docs)
    }

    randomMusicRoute(req: Request, res: Response) {
      const musicPath = path.join(__dirname, "..", "..", "assets", "music", "eshop");
      const music = fs.readdirSync(musicPath)

      const track = music[Math.floor(Math.random() * music.length)];
      res.setHeader('Content-Type', 'audio/flac')
      res.sendFile(
        path.join(musicPath, track)
      )
    }
}
