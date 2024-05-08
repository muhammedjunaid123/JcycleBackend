// cron.service.ts

import { Injectable } from '@nestjs/common';
import * as cron from 'node-cron';
import * as https from 'https';

@Injectable()
export class CronService {
  constructor() {
    // Schedule the cron job in the constructor
    this.schedulePing();
  }

  private schedulePing() {
    cron.schedule('*/1 * * * *', () => {
      this.pingServer();
    });
  }

  private pingServer() {
    console.log('Pinging server to keep it alive...');

    const options = {
      hostname: 'feeton.onrender.com',
      method: 'GET',
      timeout: 60000,
    };

    const req = https.request(options, (res) => {
      console.log(`Ping response: ${res.statusCode}`);
    });

    req.on('timeout', () => {
      req.destroy();
      console.error('Request timed out');
    });

    req.on('error', (err) => {
      console.error('Ping error:', err.message);
    });

    req.end();
  }
}
