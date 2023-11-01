import { Injectable } from '@nestjs/common';
import { ProjGeometryConvertor, ProjSupportType } from '../convertor/proj-convertor';
import { ProjectGeometryParams } from './project-geometry.interface';
@Injectable()
export class ProjectGeometryService {
  constructor() {}
  project(params: ProjectGeometryParams): ProjSupportType[] {
    const { inSR, outSR, geometries } = params;
    const convertor = new ProjGeometryConvertor({ inSR, outSR });
    return geometries.map(convertor.convert);
  }
}
