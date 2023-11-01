import { HttpModule, Module } from '@nestjs/common';
import { PlacesService } from './places.service';
import { PlacesController } from './places.controller';

@Module({
  imports:[],
  providers: [PlacesService],
  controllers: [PlacesController]
})
export class PlacesModule {}
