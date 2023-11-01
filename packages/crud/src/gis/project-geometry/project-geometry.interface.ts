import { ProjSupportType } from '../convertor/proj-convertor';

export class ProjectGeometryParams {
  inSR?: number;
  outSR?: number;
  geometries: ProjSupportType[];
}
