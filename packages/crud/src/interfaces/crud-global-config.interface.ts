import { ParamsOptions, RequestQueryBuilderOptions } from 'nest-crud-client';

import { AuthGlobalOptions } from './auth-options.interface';
import { RoutesOptions } from './routes-options.interface';

export interface CrudGlobalConfig {
  queryParser?: RequestQueryBuilderOptions;
  auth?: AuthGlobalOptions;
  routes?: RoutesOptions;
  params?: ParamsOptions;
  query?: {
    limit?: number;
    maxLimit?: number;
    cache?: number | false;
    alwaysPaginate?: boolean;
    softDelete?: boolean;
  };
  serialize?: {
    getMany?: false;
    get?: false;
    create?: false;
    createMany?: false;
    update?: false;
    replace?: false;
    delete?: false;
    recover?: false;
  };
}
