import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ProjectGeometryParams } from './project-geometry.interface';
import { ProjectGeometryService } from './project-geometry.service';

@Controller('services/project')
export class ProjectGeometryController {
  constructor(private readonly service: ProjectGeometryService) {}

  @Post()
  @HttpCode(200)
  project(@Body() body: ProjectGeometryParams) {
    return this.service.project(body);
  }
}
