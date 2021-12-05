import {Request, Response} from 'express';
import fs from 'fs';
import path from 'path';
import ffmpeg from 'ffmpeg';
import multer from 'multer';

import Log from '../utils/Log';

const l = new Log({prefix: 'Glue'});
const storage = multer.memoryStorage();
const stickerUpload = multer({
  storage: storage,
  limits: {
    fileSize: 5e+7,
  },
});

/**
 * Class for Processing Stickers
 */
export default class Glue {
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
    this.cacheFolder = path.join(__dirname, '../../', 'cache', 'stickers');
    fs.mkdirSync(this.cacheFolder, {recursive: true});
    l.log('StickerEncoder started');
  }

  /**
     * Process an mp4 into an apng
     * @param {Request} req Express Request
     * @param {Response} res Express Response
     * @return {Response} Express Response
     */
  async processSticker(req: Request, res: Response) {
  }
}
