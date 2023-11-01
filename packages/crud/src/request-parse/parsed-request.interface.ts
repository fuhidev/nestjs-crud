import { Envelope, QueryFields, QueryFilter, QueryFilterGeo, QueryJoin, QuerySort, SCondition } from 'nest-crud-client';

export interface ParsedRequestParams {
  fields: QueryFields;
  paramsFilter: QueryFilter[];
  search: SCondition;
  filter: QueryFilter[];
  or: QueryFilter[];
  join: QueryJoin[];
  sort: QuerySort[];
  limit: number;
  offset: number;
  page: number;
  outSR?: number;
  bbox?: Envelope;
  filterGeo?: QueryFilterGeo;
  inSR?: number;
}
