import {Request, Response} from 'express';
import axios from 'axios';
import Log from '../utils/Log';

const l = new Log({prefix: 'Twitch'});

/**
 * Class for getting Twitch channel info for the API
 */
class Twitch {
    private accessToken: string;
    private loggingPrefix: string;

    /**
     * Initialize class variables
     */
    constructor() {
      this.accessToken = '';

      this.initialize();
    }

    /**
     * Initialize function to run other functions asyncronously
     */
    private async initialize() {
      await this.getOAuth();
      l.log('Connected to Twitch API!');
    }

    /**
     * Get Twitch OAuth Token and set to class variable
     * @return {void};
     */
    private async getOAuth() {
      let token: string = '';

      try {
        const res = await axios({
          method: 'POST',
          baseURL: 'https://id.twitch.tv',
          url: '/oauth2/token',
          params: {
            client_id: process.env.TWITCH_CLIENTID,
            client_secret: process.env.TWITCH_CLIENTSECRET,
            grant_type: 'client_credentials',
          },
        });

        if (!res.data.access_token) return;
        token = res.data.access_token;
        setTimeout(this.getOAuth, res.data.expires_in);
        l.log(`Twitch API token renewed!`);
      } catch (err) {
        l.log(`Auth error! - ${err}`);
      }

      this.accessToken = token;
    }

    /**
     * Get Twitch Channel API Route
     * @param {Request} req Express Request
     * @param {Response} res Express Response
     * @return {Response} Express Response
     */
    getChannel(req: Request, res: Response) {
      if (this.accessToken === '') {
        return res.json({
          success: false,
          description: 'Twitch authentication failed server-side',
        });
      }

      axios({
        baseURL: 'https://api.twitch.tv/helix',
        url: '/search/channels',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Client-Id': process.env.TWITCH_CLIENTID,
        },
        params: {
          query: req.params.channel || 'etstringy',
          first: '1',
        },
      })
          .then((twitchRes) => {
            return res.json({success: true, ...twitchRes.data.data[0]});
          })
          .catch((err) => {
            return res.json({success: false});
          });
    }
}

export default Twitch;
