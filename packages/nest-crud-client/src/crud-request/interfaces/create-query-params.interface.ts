import {
 Envelope,
 QueryFields,
 QueryFilter,
 QueryFilterGeo,
 QueryJoin,
 QuerySort,
 SCondition,
 SpatialReference,
} from "../types";

export interface CreateQueryParams<T = any> {
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
