import {Request, Response} from 'express';
import axios, {AxiosInstance} from 'axios';
import Log from '../utils/Log';

const l = new Log({prefix: 'Discord'});

/**
 * Class for getting Twitch channel info for the API
 */
export default class Discord {
    private validToken: boolean;
    private api: AxiosInstance;

    /**
     * Initialize class variables
     */
    constructor() {
      this.validToken = false;
      this.api = axios.create({
        baseURL: 'https://discord.com/api/v9',
        headers: {'Authorization': `Bot ${process.env.DISCORD_TOKEN}`},
      });

      this.initialize();
    }

    /**
     * Initialize function to run other functions asyncronously
     */
    private async initialize() {
      await this.checkToken();
    }

    /**
     * Get Twitch OAuth Token and set to class variable
     * @return {void};
     */
    private async checkToken() {
      const token: string = process.env.DISCORD_TOKEN;
      if (!token || token === undefined) return l.log(`Invalid Token`);

      try {
        const res = await this.api.get('/users/@me');
        l.log(`Connected to Discord API as ${res.data.username}#${res.data.discriminator} ${res.data.bot && '(Bot)'}!`);
        this.validToken = true;
      } catch (err) {
        l.log(`Auth error! - ${err}`);
      }
    }

    /**
     * Get Twitch Channel API Route
     * @param {Request} req Express Request
     * @param {Response} res Express Response
     * @return {Response} Express Response
     */
    getUserById(req: Request, res: Response) {
      if (!this.validToken) {
        return res.json({
          success: false,
          description: 'Discord authentication failed server-side',
        });
      }

      this.api({
        url: '/users/' + req.params.id,
      })
          .then((discord) => {
            return res.json({success: true, user: discord.data});
          })
          .catch((err) => {
            return res.json({
              success: false,
              description: (err.response) ? err.response.data.message : 'An unknown error has occured',
            });
          });
    }
}
