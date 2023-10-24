import { QueryFilter, SCondition } from 'nest-crud-client';

export type QueryFilterFunction = (search?: SCondition, getMany?: boolean) => SCondition | void;
export type QueryFilterOption = QueryFilter[] | SCondition | QueryFilterFunction;
