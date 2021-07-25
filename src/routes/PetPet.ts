import {Request, Response} from 'express';
import fs from 'fs';
import path from 'path';
import petpet from 'pet-pet-gif';

import {discord} from '../index';
import Log from '../utils/Log';

const l = new Log({prefix: 'PetPet'});

/**
 * Class for petting users on Discord
 */
export default class PetPet {
  cacheFolder: string;

  /**
     * Initialize class variables
     */
  constructor() {
    this.initialize();
  }

  /**
     * Initialize function to run other functions asyncronously
     */
  private async initialize() {
    this.cacheFolder = path.join(__dirname, '../../', 'cache', 'petpet');
    fs.mkdirSync(this.cacheFolder, {recursive: true});
    l.log('PetPet started');
  }

  /**
     * Generate a pet pet gif
     * @param {Request} req Express Request
     * @param {Response} res Express Response
     * @return {Response} Express Response
     */
  async generateGif(req: Request, res: Response) {
    if (!req.params.id) return res.json({success: false, description: 'No user ID supplied!'});

    // get user information
    const _info = await discord.getUserById(req.params.id);
    const info = _info.data;
    const cacheFilename = `${info.id}-${info.avatar}.png`;
    const cachePath = path.join(this.cacheFolder, cacheFilename);

    if (fs.existsSync(cacheFilename)) return res.sendFile(cachePath);
    const uwu = await petpet(`https://cdn.discordapp.com/avatars/${info.id}/${info.avatar}.png?size=1024`);
    fs.writeFileSync(cachePath, uwu);
    res.sendFile(cachePath);
  }
}
