// cron.service.ts

import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class CronService {
  @Cron(CronExpression.EVERY_10_MINUTES)
  handleCron() {
    console.log('This will be executed every minute');
  }
}
