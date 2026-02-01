import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from '../../../../../shared/guards/jwt-auth.guard';

@Controller('test')
export class TestController {
  @UseGuards(JwtAuthGuard)
  @Get('protected')
  getProtected(@Req() req: Request) {
    return {
      userId: req.user?.userId,
    };
  }
}
