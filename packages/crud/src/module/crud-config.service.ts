import { RequestQueryBuilder, isObjectFull } from 'nest-crud-client';

import { CrudGlobalConfig } from '../interfaces';
import deepmerge from '../util/deepmerge';

export class CrudConfigService {
  static config: CrudGlobalConfig = {
    query: {
      alwaysPaginate: false,
    },
    routes: {
      getManyBase: { interceptors: [], decorators: [] },
      getOneBase: { interceptors: [], decorators: [] },
      createOneBase: { interceptors: [], decorators: [], returnShallow: false },
      createManyBase: { interceptors: [], decorators: [] },
      updateOneBase: {
        interceptors: [],
        decorators: [],
        allowParamsOverride: false,
        returnShallow: false,
      },
      replaceOneBase: {
        interceptors: [],
        decorators: [],
        allowParamsOverride: false,
        returnShallow: false,
      },
      deleteOneBase: { interceptors: [], decorators: [], returnDeleted: false },
      recoverOneBase: { interceptors: [], decorators: [], returnRecovered: false },
    },
    params: {},
  };

  static load(config: CrudGlobalConfig = {}) {
    if (isObjectFull(config.queryParser)) {
      RequestQueryBuilder.setOptions(config.queryParser);
    }

    const query = isObjectFull(config.query) ? config.query : {};
    const routes = isObjectFull(config.routes) ? config.routes : {};
    const params = isObjectFull(config.params) ? config.params : {};

    CrudConfigService.config = deepmerge(
      CrudConfigService.config,
      { query, routes, params },
      { arrayMerge: (a, b, c) => b },
    );
  }
}
