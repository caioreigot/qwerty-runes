import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { GameRoomsService } from './game-rooms.service';

@Module({
  providers: [GameGateway, GameRoomsService],
})
export class GatewaysModule {}
