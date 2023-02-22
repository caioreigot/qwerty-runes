import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller()
export class HealthzController {
  @Get('/healthz')
  healthz(@Res() response: Response) {
    console.log('JWT_SECRET:', process.env.JWT_SECRET);
    response.status(HttpStatus.OK).send('O servidor está funcionando corretamente.');
  }
}
