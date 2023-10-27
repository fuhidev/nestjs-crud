import { hasValue, isArrayFull, isNil, isObject, isString, isUndefined } from '../util';

import { CreateQueryParams, DELIMSTR_CHAR, DELIM_CHAR, ParamNamesMap, RequestQueryBuilderOptions } from './interfaces';
import {
  validateCondition,
  validateFields,
  validateJoin,
  validateNumeric,
  validateSort,
} from './request-query.validator';
import {
  Envelope,
  QueryFields,
  QueryFilter,
  QueryFilterGeo,
  QueryJoin,
  QueryJoins,
  QuerySort,
  SCondition,
  SpatialReference,
} from './types';

// tslint:disable:variable-name ban-types
export class RequestQueryBuilder<T = any> {
  constructor() {
    this.setParamNames();
  }

  private static _options: RequestQueryBuilderOptions = {
    paramNamesMap: {
      fields: ['fields', 'select'],
      search: 's',
      filter: 'filter',
      or: 'or',
      join: 'join',
      sort: 'sort',
      limit: ['limit', 'per_page'],
      offset: 'offset',
      page: 'page',
      cache: 'cache',
    },
  };
  private paramNames: {
    [key in keyof ParamNamesMap]: string;
  } = {};
  public queryObject: { [key: string]: any } = {};
  public filterGeo!: QueryFilterGeo;
  private _fields!: QueryFields<T>;
  public get fields() {
    return this._fields;
  }

  static setOptions(options: RequestQueryBuilderOptions) {
    RequestQueryBuilder._options = {
      ...RequestQueryBuilder._options,
      ...options,
      paramNamesMap: {
        ...RequestQueryBuilder._options.paramNamesMap,
        ...(options.paramNamesMap ? options.paramNamesMap : {}),
      },
    };
  }

  static getOptions(): RequestQueryBuilderOptions {
    return RequestQueryBuilder._options;
  }

  static create<T = any>(params?: CreateQueryParams<T>): RequestQueryBuilder<T> {
    const qb = new RequestQueryBuilder<T>();
    //@ts-ignore
    return isObject(params) ? qb.createFromParams(params) : qb;
  }

  get options(): RequestQueryBuilderOptions {
    return RequestQueryBuilder._options;
  }

  setParamNames() {
    //@ts-ignore
    Object.keys(RequestQueryBuilder._options.paramNamesMap).forEach((key) => {
      //@ts-ignore
      const name = RequestQueryBuilder._options.paramNamesMap[key];
      //@ts-ignore
      this.paramNames[key] = isString(name) ? (name as string) : (name[0] as string);
    });
  }

  query(): string {
    //@ts-ignore
    if (this.queryObject[this.paramNames.search]) {
      //@ts-ignore
      this.queryObject[this.paramNames.filter] = undefined;
      //@ts-ignore
      this.queryObject[this.paramNames.or] = undefined;
    }
    if (!this.queryObject.fields || this.queryObject.fields?.length === 0) {
      throw new Error('required fields');
    }
    let queryString = '';
    for (const key in this.queryObject) {
      if (this.queryObject.hasOwnProperty(key)) {
        if (queryString !== '') {
          queryString += '&';
        }
        if (isArrayFull(this.queryObject[key])) {
          queryString += (this.queryObject[key] as string[]).map((val) => `${key}=${val}`).join('&');
        } else queryString += `${key}=${this.queryObject[key]}`;
      }
    }
    return queryString;
  }

  select(fields: QueryFields<T>): this {
    if (isArrayFull(fields)) {
      validateFields(fields);
      this._fields = fields;
      //@ts-ignore
      this.queryObject[this.paramNames.fields] = fields.join(DELIMSTR_CHAR);
    }
    return this;
  }

  search(s: SCondition) {
    if (!isNil(s) && isObject(s)) {
      //@ts-ignore
      this.queryObject[this.paramNames.search] = JSON.stringify(s);
    }
    return this;
  }

  setFilter(f: QueryFilter | Array<QueryFilter>): this {
    this.setCondition(f, 'filter');
    return this;
  }

  setOr(f: QueryFilter | Array<QueryFilter>): this {
    this.setCondition(f, 'or');
    return this;
  }

  setJoin(j: QueryJoin | QueryJoins): this {
    if (!isNil(j)) {
      //@ts-ignore
      const param = this.checkQueryObjectParam('join', []);
      const joins: string[] = [];
      if (Array.isArray(j)) {
        (j as QueryJoins).forEach((o) => joins.push(...this.addJoin(o)));
      } else {
        joins.push(...this.addJoin(j));
      }
      this.queryObject[param] = [...this.queryObject[param], ...joins];
    }
    return this;
  }

  sortBy(s: QuerySort | Array<QuerySort>): this {
    if (!isNil(s)) {
      //@ts-ignore
      const param = this.checkQueryObjectParam('sort', []);
      this.queryObject[param] = [
        ...this.queryObject[param],
        ...(Array.isArray(s)
          ? (s as Array<QuerySort>).map((o) => this.addSortBy(o))
          : [this.addSortBy(s as QuerySort)]),
      ];
    }
    return this;
  }

  setLimit(n: number): this {
    this.setNumeric(n, 'limit');
    return this;
  }

  setOutSR(val: SpatialReference | number) {
    if (val) {
      this.queryObject['outSR'] = JSON.stringify(val);
    }
    return this;
  }
  setInSR(val: SpatialReference | number) {
    if (val) {
      this.queryObject['inSR'] = JSON.stringify(val);
    }
    return this;
  }

  setBBox(val: Envelope) {
    if (val) {
      this.queryObject['bbox'] = JSON.stringify(val);
    }
    return this;
  }

  setFilterGeo(val: QueryFilterGeo) {
    this.filterGeo = val;
    return this;
  }

  setFormatGeo(val: string) {
    if (val) {
      this.queryObject['fGeo'] = val;
    }
    return this;
  }

  setOffset(n: number): this {
    this.setNumeric(n, 'offset');
    return this;
  }

  setPage(n: number): this {
    this.setNumeric(n, 'page');
    return this;
  }

  resetCache(): this {
    this.setNumeric(0, 'cache');
    return this;
  }

  cond(filter: QueryFilter, cond: 'filter' | 'or' | 'search' = 'search'): string {
    validateCondition(filter, cond);
    const d = DELIM_CHAR;
    let value = '';
    let x = filter.value;
    if (hasValue(x)) {
      if (typeof x === 'number' || typeof x === 'boolean') {
        value = x.toString();
      } else if (typeof x === 'string') {
        if (x.startsWith('"') && x.endsWith('"')) value = x;
        else value = `"${x}"`;
      } else if (Array.isArray(x)) {
        value = x
          .map((item) =>
            typeof item === 'string' ? (item.startsWith('"') && item.endsWith('"') ? item : `"${item}"`) : item,
          )
          .join(',');
      }
    }
    const result = `${filter.field}${d}${filter.operator}${d}${value}`;
    return result;
  }

  private addJoin(join: QueryJoin, parentField?: string): string[] {
    const result: string[] = [];
    validateJoin(join);
    const d = DELIM_CHAR;
    const ds = DELIMSTR_CHAR;
    const rootField: string = parentField ? join.field + '.' + parentField : join.field + '';
    result.push(rootField + (isArrayFull(join.select) ? d + join.select!.join(ds) : ''));
    // if (join.children && join.children.length) {
    //  join.children.forEach((item) =>
    //   result.push(...this.addJoin(item, rootField))
    //  );
    // }
    return result;
  }

  private addSortBy(sort: QuerySort): string {
    validateSort(sort);
    const ds = DELIMSTR_CHAR;

    return sort.field + ds + sort.order;
  }

  private createFromParams(params: CreateQueryParams<T>): this {
    this.select(params.fields!);
    this.search(params.search!);
    this.setFilter(params.filter!);
    this.setOr(params.or!);
    this.setJoin(params.join!);
    this.setLimit(params.limit!);
    this.setOffset(params.offset!);
    this.setPage(params.page!);
    this.sortBy(params.sort!);
    this.setFormatGeo(params.fGeo!);
    this.setFilterGeo(params.filterGeo!);
    this.setBBox(params.bbox!);
    this.setOutSR(params.outSR!);
    this.setInSR(params.inSR!);
    if (params.resetCache) {
      this.resetCache();
    }
    return this;
  }

  private checkQueryObjectParam(cond: keyof RequestQueryBuilderOptions['paramNamesMap'], defaults: any): string {
    const param = this.paramNames[cond];
    if (isNil(this.queryObject[param]) && !isUndefined(defaults)) {
      this.queryObject[param] = defaults;
    }
    return param;
  }

  private setCondition(f: QueryFilter | Array<QueryFilter>, cond: 'filter' | 'or'): void {
    if (!isNil(f)) {
      //@ts-ignore
      const param = this.checkQueryObjectParam(cond, []);
      this.queryObject[param] = [
        ...this.queryObject[param],
        ...(Array.isArray(f)
          ? (f as Array<QueryFilter>).map((o) => this.cond(o, cond))
          : [this.cond(f as QueryFilter, cond)]),
      ];
    }
  }

  private setNumeric(n: number, cond: 'limit' | 'offset' | 'page' | 'cache'): void {
    if (!isNil(n)) {
      validateNumeric(n, cond);
      //@ts-ignore
      this.queryObject[this.paramNames[cond]] = n;
    }
  }
}
