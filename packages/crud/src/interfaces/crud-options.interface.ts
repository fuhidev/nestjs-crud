import { QueryOptions } from "./query-options.interface";
import { RoutesOptions } from "./routes-options.interface";
export interface CrudParamOption {
 primaryKey: string;
}

export interface CrudRequestOptions {
 query: QueryOptions;
 routes: RoutesOptions;
 params: CrudParamOption;
}

export interface CrudOptions {
 query?: QueryOptions;
 routes?: RoutesOptions;
 params: CrudParamOption;
}

export interface MergedCrudOptions extends CrudOptions {}
