import { AxiosRequestConfig } from 'axios';
import { GenericAbortSignal } from 'axios';

export declare interface BaseGeometry {
    spatialReference: SpatialReference;
}

declare type BBox = [number, number, number, number] | [number, number, number, number, number, number];

export declare type BuilderParams<T> = RequestQueryBuilder<T> | CreateQueryParams<T>;

export declare interface Column {
    name: string;
    alias: string;
    type: string;
    isNullable: boolean;
    isPrimary: boolean;
    isCreateDate: boolean;
    isGenerated: boolean;
    readonly: boolean;
    relation?: Relation;
    isDisplayColumn: boolean;
}

export declare type ComparisonOperator = keyof SFieldOperator;

export declare const comparisonOperatorsList: string[] & any[];

export declare enum CondOperator {
    EQUALS = "$eq",
    NOT_EQUALS = "$ne",
    GREATER_THAN = "$gt",
    LOWER_THAN = "$lt",
    GREATER_THAN_EQUALS = "$gte",
    LOWER_THAN_EQUALS = "$lte",
    STARTS = "$starts",
    ENDS = "$ends",
    CONTAINS = "$cont",
    EXCLUDES = "$excl",
    IN = "$in",
    NOT_IN = "$notin",
    IS_NULL = "$isnull",
    NOT_NULL = "$notnull",
    BETWEEN = "$between",
    EQUALS_LOW = "$eqL",
    NOT_EQUALS_LOW = "$neL",
    STARTS_LOW = "$startsL",
    ENDS_LOW = "$endsL",
    CONTAINS_LOW = "$contL",
    EXCLUDES_LOW = "$exclL",
    IN_LOW = "$inL",
    NOT_IN_LOW = "$notinL"
}

export declare interface CreateQueryParams<T = any> {
    fields: QueryFields<T>;
    search?: SCondition;
    filter?: QueryFilter | Array<QueryFilter>;
    or?: QueryFilter | Array<QueryFilter>;
    join?: QueryJoin | Array<QueryJoin>;
    sort?: QuerySort | Array<QuerySort>;
    limit?: number;
    offset?: number;
    page?: number;
    resetCache?: boolean;
    filterGeo?: QueryFilterGeo;
    outSR?: SpatialReference | number;
    inSR?: SpatialReference | number;
    fGeo?: "geojson" | "esri";
    bbox?: Envelope;
}

export declare interface CrudBaseOptions {
    entity: string;
    apiUrl: string;
    primaryKey?: string;
}

export declare abstract class CrudBaseService<T = any> {
    entity: string;
    apiUrl: string;
    primaryKey?: string;
    constructor(options: CrudBaseOptions);
    request<T>(config: AxiosRequestConfig): Promise<T>;
    getPagination(limit: number, page: number, opts: {
        builder?: BuilderParams<T>;
        signal?: GenericAbortSignal;
    }): Promise<ResponsePagination<T>>;
    getMany(opts?: {
        builder?: BuilderParams<T>;
        signal?: GenericAbortSignal;
    }): Promise<T[]>;
    getCount(builder?: BuilderParams<T>): Promise<{
        count: number;
    }>;
    getOne(value: number | string | boolean, opts?: {
        builder?: BuilderParams<T>;
        signal?: GenericAbortSignal;
    }): Promise<T>;
    private getBodyFilterGeo;
    create(body: T, opts?: {
        builder?: BuilderParams<T>;
        signal?: GenericAbortSignal;
    }): Promise<T>;
    createMany(body: T[], opts?: {
        builder?: BuilderParams<T>;
        signal?: GenericAbortSignal;
    }): Promise<T[]>;
    put(value: number | string | boolean, body: T, opts?: {
        builder?: BuilderParams<T>;
        signal?: GenericAbortSignal;
    }): Promise<T>;
    patch(value: number | string | boolean, body: T, opts?: {
        builder?: BuilderParams<T>;
        signal?: GenericAbortSignal;
    }): Promise<T>;
    executeSql(params: {
        query: string;
    }): Promise<any>;
    delete(value: number | string | boolean): Promise<unknown>;
    getParamsFromQuery(builder?: BuilderParams<T>): {
        [key: string]: any;
    };
    getBaseUrl(): string;
    getOneUrl(value: number | string | boolean): string;
    getQuery(builder?: RequestQueryBuilder<T>): {
        [key: string]: any;
    };
}

export declare const DELIM_CHAR = "||";

export declare const DELIMSTR_CHAR = ",";

export declare const deprecatedComparisonOperatorsList: string[];

export declare interface Envelope extends BaseGeometry {
    xmin: number;
    xmax: number;
    ymin: number;
    ymax: number;
    zmin?: number;
    zmax?: number;
    mmin?: number;
    mmax?: number;
}

declare interface Feature<G extends GeometryObject | null = GeometryObject, P = GeoJsonProperties> extends GeoJsonObject {
    type: "Feature";
    geometry: G;
    id?: string | number | undefined;
    properties: P;
}

declare interface FeatureCollection<G extends GeometryObject | null = GeometryObject, P = GeoJsonProperties> extends GeoJsonObject {
    type: "FeatureCollection";
    features: Array<Feature<G, P>>;
}

declare type GeoJSON_2 = GeometryObject | Feature | FeatureCollection;

declare interface GeoJsonObject {
    type: GeoJsonTypes;
    bbox?: BBox | undefined;
}

declare type GeoJsonProperties = {
    [name: string]: any;
} | null;

declare type GeoJsonTypes = GeoJSON_2['type'];

export declare type Geometry = Polyline | Polygon | Multipoint | Point | Envelope;

declare interface GeometryCollection extends GeoJsonObject {
    type: "GeometryCollection";
    geometries: GeometryObject[];
}

declare type GeometryObject = Point_2 | MultiPoint | LineString | MultiLineString | Polygon_2 | MultiPolygon | GeometryCollection;

export declare enum GeometryType {
    Polygon = "Polygon",
    Polyline = "Polyline",
    Point = "Point"
}

export declare const getOwnPropNames: (val: any) => string[];

export declare const hasLength: (val: any) => boolean;

export declare const hasValue: (val: any) => boolean;

export declare const isArrayFull: (val: any) => boolean;

export declare const isArrayStrings: (val: any) => boolean;

export declare const isBoolean: (val: any) => boolean;

export declare const isDate: (val: any) => val is Date;

export declare const isDateString: (val: any) => boolean;

export declare const isEqual: (val: any, eq: any) => boolean;

export declare const isFalse: (val: any) => boolean;

export declare const isFunction: (val: any) => boolean;

export declare const isIn: (val: any, arr?: any[]) => boolean;

export declare const isNil: (val: any) => boolean;

export declare const isNull: (val: any) => boolean;

export declare const isNumber: (val: any) => boolean;

export declare const isNumeric: (val: any) => boolean;

export declare const isObject: (val: any) => boolean;

export declare const isObjectFull: (val: any) => boolean;

export declare const isString: (val: any) => boolean;

export declare const isStringFull: (val: any) => boolean;

export declare const isTrue: (val: any) => boolean;

export declare const isUndefined: (val: any) => boolean;

export declare const isValue: (val: any) => boolean;

export declare type KeyOfs<T> = Array<keyof T>;

declare interface LineString extends GeoJsonObject {
    type: "LineString";
    coordinates: Position[];
}

export declare interface Metadata {
    displayColumn: string;
    primaryColumn: string;
    columns: Column[];
    tableType: string;
    geometryType: GeometryType;
    renderer: Renderer;
    [key: string]: any;
    srs?: SpatialReference | number;
}

declare interface MultiLineString extends GeoJsonObject {
    type: "MultiLineString";
    coordinates: Position[][];
}

declare interface MultiPoint extends GeoJsonObject {
    type: "MultiPoint";
    coordinates: Position[];
}

export declare interface Multipoint extends BaseGeometry {
    points: number[][];
}

declare interface MultiPolygon extends GeoJsonObject {
    type: "MultiPolygon";
    coordinates: Position[][][];
}

export declare type ObjectLiteral = {
    [key: string]: any;
};

export declare const objKeys: (val: any) => string[];

export declare interface ParamNamesMap {
    fields?: string | string[];
    search?: string | string[];
    filter?: string | string[];
    or?: string | string[];
    join?: string | string[];
    sort?: string | string[];
    limit?: string | string[];
    offset?: string | string[];
    page?: string | string[];
    cache?: string | string[];
}

export declare interface ParamOption {
    field?: string;
    type?: ParamOptionType;
    primary?: boolean;
    disabled?: boolean;
}

export declare type ParamOptionType = 'number' | 'string' | 'uuid';

export declare interface ParamsOptions {
    [key: string]: ParamOption;
}

export declare interface Point extends BaseGeometry {
    x: number;
    y: number;
    z?: number;
    m?: number;
}

declare interface Point_2 extends GeoJsonObject {
    type: "Point";
    coordinates: Position;
}

export declare interface Polygon extends BaseGeometry {
    rings: number[][][];
}

declare interface Polygon_2 extends GeoJsonObject {
    type: "Polygon";
    coordinates: Position[][];
}

export declare interface Polyline extends BaseGeometry {
    paths: number[][];
}

declare type Position = number[];

export declare type QueryFields<T = any> = Array<keyof T>;

export declare interface QueryFilter {
    field: string;
    operator: ComparisonOperator;
    value?: any;
}

export declare interface QueryFilterGeo {
    geometry: Geometry | GeoJsonObject;
    fGeo?: "geojson" | "esri";
    method?: SpatialMethodEnum;
}

export declare interface QueryJoin {
    field: string;
    select: QueryFields;
}

export declare type QueryJoins = QueryJoin[];

export declare interface QuerySort {
    field: string;
    order: QuerySortOperator;
}

export declare type QuerySortOperator = "ASC" | "DESC";

export declare interface Relation {
    displayColumn: string;
    primaryColumn: string;
    type: "one-to-one" | "many-to-one" | "one-to-many";
    name: string;
    url: string;
}

export declare interface Renderer {
    type: string;
    [key: string]: any;
}

export declare class RequestQueryBuilder<T = any> {
    constructor();
    private static _options;
    private paramNames;
    queryObject: {
        [key: string]: any;
    };
    filterGeo: QueryFilterGeo;
    private _fields;
    get fields(): QueryFields<T>;
    static setOptions(options: RequestQueryBuilderOptions): void;
    static getOptions(): RequestQueryBuilderOptions;
    static create<T = any>(params?: CreateQueryParams<T>): RequestQueryBuilder<T>;
    get options(): RequestQueryBuilderOptions;
    setParamNames(): void;
    query(): string;
    select(fields: QueryFields<T>): this;
    search(s: SCondition): this;
    setFilter(f: QueryFilter | Array<QueryFilter>): this;
    setOr(f: QueryFilter | Array<QueryFilter>): this;
    setJoin(j: QueryJoin | QueryJoins): this;
    sortBy(s: QuerySort | Array<QuerySort>): this;
    setLimit(n: number): this;
    setOutSR(val: SpatialReference | number): this;
    setInSR(val: SpatialReference | number): this;
    setBBox(val: Envelope): this;
    setFilterGeo(val: QueryFilterGeo): this;
    setFormatGeo(val: string): this;
    setOffset(n: number): this;
    setPage(n: number): this;
    resetCache(): this;
    cond(filter: QueryFilter, cond?: "filter" | "or" | "search"): string;
    private addJoin;
    private addSortBy;
    private createFromParams;
    private checkQueryObjectParam;
    private setCondition;
    private setNumeric;
}

export declare interface RequestQueryBuilderOptions {
    paramNamesMap?: ParamNamesMap;
}

export declare class RequestQueryException extends Error {
    constructor(msg: string);
}

export declare interface ResponsePagination<T = any> {
    data: Array<T>;
    count: number;
    total: number;
    page: number;
    pageCount: number;
}

export declare type SCondition = SFields | SConditionAND;

export declare interface SConditionAND {
    $and?: Array<SFields | SConditionAND>;
    $or?: never;
}

export declare type SConditionKey = "$and" | "$or";

export declare type SField = SPrimitivesVal | SFieldOperator;

export declare interface SFieldOperator {
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

export declare interface SFields {
    [key: string]: SField | Array<SFields | SConditionAND> | undefined;
    $or?: Array<SFields | SConditionAND>;
    $and?: never;
}

export declare type SFiledValues = SPrimitivesVal | Array<SPrimitivesVal>;

export declare const sortOrdersList: string[];

export declare enum SpatialMethodEnum {
    Intersects = "intersects",
    Within = "within",
    Touches = "touches"
}

export declare interface SpatialReference {
    wkid?: number;
    wkt?: string;
}

export declare type SPrimitivesVal = string | number | boolean;

export declare function validateComparisonOperator(operator: ComparisonOperator): void;

export declare function validateCondition<T>(val: QueryFilter, cond: "filter" | "or" | "search"): void;

export declare function validateFields<T>(fields: QueryFields<T>): void;

export declare function validateJoin<T>(join: QueryJoin): void;

export declare function validateNumeric(val: number, num: "limit" | "offset" | "page" | "cache" | string): void;

export declare function validateParamOption(options: ParamsOptions, name: string): void;

export declare function validateSort<T>(sort: QuerySort): void;

export declare function validateUUID(str: string, name: string): void;

export { }
