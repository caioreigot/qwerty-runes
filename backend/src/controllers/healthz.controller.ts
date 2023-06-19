import { All, Controller, HttpCode } from '@nestjs/common';

@Controller()
export class HealthzController {
  @All('/healthz')
  @HttpCode(200)
  healthz() {
    return 'O servidor está funcionando corretamente.';
  }
}
