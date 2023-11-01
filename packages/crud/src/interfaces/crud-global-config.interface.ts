import { ParamsOptions, RequestQueryBuilderOptions } from 'nest-crud-client';

import { RoutesOptions } from './routes-options.interface';

export interface CrudGlobalConfig {
  queryParser?: RequestQueryBuilderOptions;
  routes?: RoutesOptions;
  params?: ParamsOptions;
  query?: {
    limit?: number;
    maxLimit?: number;
    cache?: number | false;
    alwaysPaginate?: boolean;
    softDelete?: boolean;
  };
}
