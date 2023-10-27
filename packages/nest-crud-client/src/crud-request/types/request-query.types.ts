import { GeoJsonObject } from './geojson';

export type QueryFields<T = any> = Array<keyof T>;

export interface SpatialReference {
  wkid?: number;
  wkt?: string;
}

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

export interface Envelope extends BaseGeometry {
  xmin: number;
  xmax: number;
  ymin: number;
  ymax: number;

  zmin?: number;
  zmax?: number;

  mmin?: number;
  mmax?: number;
}

export type Geometry = Polyline | Polygon | Multipoint | Point | Envelope;

export enum SpatialMethodEnum {
  Intersects = 'intersects',
  Within = 'within',
  Touches = 'touches',
}

export interface QueryFilterGeo {
  geometry: Geometry | GeoJsonObject;
  fGeo?: 'geojson' | 'esri';
  method?: SpatialMethodEnum;
}

export type QueryFilter =
  | {
      field: string;
      operator: CondOperator.IS_NULL | CondOperator.NOT_NULL;
    }
  | {
      field: string;
      operator: CondOperator.BETWEEN;
      value: [SPrimitivesVal, SPrimitivesVal];
    }
  | {
      field: string;
      operator: CondOperator.IN | CondOperator.NOT_IN | CondOperator.IN_LOW | CondOperator.NOT_IN_LOW;
      value: Array<SPrimitivesVal>;
    }
  | {
      field: string;
      operator:
        | CondOperator.EQUALS
        | CondOperator.NOT_EQUALS
        | CondOperator.GREATER_THAN
        | CondOperator.LOWER_THAN
        | CondOperator.GREATER_THAN_EQUALS
        | CondOperator.LOWER_THAN_EQUALS
        | CondOperator.STARTS
        | CondOperator.ENDS
        | CondOperator.CONTAINS
        | CondOperator.EXCLUDES
        | CondOperator.IS_NULL
        | CondOperator.NOT_NULL
        | CondOperator.EQUALS_LOW
        | CondOperator.NOT_EQUALS_LOW
        | CondOperator.STARTS_LOW
        | CondOperator.ENDS_LOW
        | CondOperator.CONTAINS_LOW
        | CondOperator.EXCLUDES_LOW;
      value: SPrimitivesVal;
    };
export type QueryJoins = QueryJoin[];

export interface QueryJoin {
  field: string;
  select: QueryFields;
}

export interface QuerySort {
  field: string;
  order: QuerySortOperator;
}

export type QuerySortOperator = 'ASC' | 'DESC';

export enum CondOperator {
  EQUALS = '$eq',
  NOT_EQUALS = '$ne',
  GREATER_THAN = '$gt',
  LOWER_THAN = '$lt',
  GREATER_THAN_EQUALS = '$gte',
  LOWER_THAN_EQUALS = '$lte',
  STARTS = '$starts',
  ENDS = '$ends',
  CONTAINS = '$cont',
  EXCLUDES = '$excl',
  IN = '$in',
  NOT_IN = '$notin',
  IS_NULL = '$isnull',
  NOT_NULL = '$notnull',
  BETWEEN = '$between',
  EQUALS_LOW = '$eqL',
  NOT_EQUALS_LOW = '$neL',
  STARTS_LOW = '$startsL',
  ENDS_LOW = '$endsL',
  CONTAINS_LOW = '$contL',
  EXCLUDES_LOW = '$exclL',
  IN_LOW = '$inL',
  NOT_IN_LOW = '$notinL',
}

export type ComparisonOperator = CondOperator | keyof SFieldOperator;

// new search
export type SPrimitivesVal = string | number | boolean;

export type SFiledValues = SPrimitivesVal | Array<SPrimitivesVal>;

export interface SFieldOperator {
  $eq?: SFiledValues;
  $ne?: SFiledValues;
  $gt?: SFiledValues;
  $lt?: SFiledValues;
  $gte?: SFiledValues;
  $lte?: SFiledValues;
  $starts?: SFiledValues;
  $ends?: SFiledValues;
  $cont?: SFiledValues;
  $excl?: SFiledValues;
  $in?: SFiledValues;
  $notin?: SFiledValues;
  $between?: SFiledValues;
  $isnull?: SFiledValues;
  $notnull?: SFiledValues;
  $eqL?: SFiledValues;
  $neL?: SFiledValues;
  $startsL?: SFiledValues;
  $endsL?: SFiledValues;
  $contL?: SFiledValues;
  $exclL?: SFiledValues;
  $inL?: SFiledValues;
  $notinL?: SFiledValues;
  $or?: SFieldOperator;
  $and?: never;
}

export type SField = SPrimitivesVal | SFieldOperator;

export interface SFields {
  [key: string]: SField | Array<SFields | SConditionAND> | undefined;
  $or?: Array<SFields | SConditionAND>;
  $and?: never;
}

export interface SConditionAND {
  $and?: Array<SFields | SConditionAND>;
  $or?: never;
}

export type SConditionKey = '$and' | '$or';

export type SCondition = SFields | SConditionAND;
