import { Module } from '@nestjs/common';
import { ProjectGeometryController } from './project-geometry.controller';
import { ProjectGeometryService } from './project-geometry.service';

@Module({
  controllers: [ProjectGeometryController],
  providers: [ProjectGeometryService],
  exports: [ProjectGeometryService],
})
export class ProjectGeometryModule {}
