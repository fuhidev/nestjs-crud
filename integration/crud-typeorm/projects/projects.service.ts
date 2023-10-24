import { TypeOrmCrudService } from '@fuhidev/crud-typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Project } from './project.entity';

@Injectable()
export class ProjectsService extends TypeOrmCrudService<Project> {
  constructor(@InjectRepository(Project) repo) {
    super(repo);
  }
}
