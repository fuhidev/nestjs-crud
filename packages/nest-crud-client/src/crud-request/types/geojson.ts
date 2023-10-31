export namespace GeoJSON {
  export type BBox = [number, number, number, number];
  export type Position = [number, number];
  export type GeoJsonTypes = GeometryObject['type'];
  export interface BaseGeometry {
    type: GeoJsonTypes;
    bbox?: BBox | undefined;
  }
  export type Geometry = GeometryObject | Feature;
  export type GeometryObject =
    | Feature
    | Point
    | MultiPoint
    | LineString
    | MultiLineString
    | Polygon
    | MultiPolygon
    | GeometryCollection;

  export interface Point extends BaseGeometry {
    type: 'Point';
    coordinates: Position;
  }
  export interface MultiPoint extends BaseGeometry {
    type: 'MultiPoint';
    coordinates: Position[];
  }

  export interface LineString extends BaseGeometry {
    type: 'LineString';
    coordinates: Position[];
  }

  export interface MultiLineString extends BaseGeometry {
    type: 'MultiLineString';
    coordinates: Position[][];
  }

  export interface Polygon extends BaseGeometry {
    type: 'Polygon';
    coordinates: Position[][];
  }

  export interface MultiPolygon extends BaseGeometry {
    type: 'MultiPolygon';
    coordinates: Position[][][];
  }

  export interface GeometryCollection extends BaseGeometry {
    type: 'GeometryCollection';
    geometries: GeometryObject[];
  }

  export type GeoJsonProperties = { [name: string]: any } | null;

  export interface Feature<G extends GeometryObject | null = GeometryObject, P = GeoJsonProperties>
    extends BaseGeometry {
    type: 'Feature';
    geometry: G;
    properties: P;
  }
}
