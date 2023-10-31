import { SpatialReference } from './type';
export namespace ArcGIS {
  export interface BaseGeometry {
    spatialReference: SpatialReference;
  }

  export interface Point extends BaseGeometry {
    x: number;
    y: number;
    z?: number;
    m?: number;
  }

  export interface Polyline extends BaseGeometry {
    paths: number[][];
  }

  export interface Polygon extends BaseGeometry {
    rings: number[][][];
  }

  export interface Multipoint extends BaseGeometry {
    points: number[][];
  }

  export type Geometry = Polyline | Polygon | Multipoint | Point;
}
