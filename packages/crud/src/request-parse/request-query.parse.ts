import {
  CondOperator,
  DELIMSTR_CHAR,
  DELIM_CHAR,
  Envelope,
  QueryFields,
  QueryFilter,
  QueryFilterGeo,
  QueryJoin,
  QuerySort,
  RequestQueryBuilder,
  RequestQueryBuilderOptions,
  RequestQueryException,
  SCondition,
  SConditionAND,
  SFields,
  hasLength,
  hasValue,
  isArrayFull,
  isDate,
  isDateString,
  isNil,
  isObject,
  isString,
  isStringFull,
  objKeys,
  validateCondition,
  validateJoin,
  validateNumeric,
  validateSort,
} from 'nest-crud-client';
import { CrudParamOption } from '../interfaces';
import { ParsedRequestParams } from './parsed-request.interface';

// tslint:disable:variable-name ban-types
export class RequestQueryParser implements ParsedRequestParams {
  public fields: QueryFields = [];

  public search: SCondition;

  public filter: QueryFilter[] = [];

  public or: QueryFilter[] = [];

  public join: QueryJoin[] = [];

  public sort: QuerySort[] = [];

  public limit: number;

  public offset: number;

  public page: number;

  public cache: number;

  private _params: any;

  private _query: any;

  private _paramNames: string[];
  public paramsFilter: QueryFilter[] = [];

  private _paramsOptions: CrudParamOption;

  public outSR?: number;
  public bbox?: Envelope;
  public filterGeo?: QueryFilterGeo;
  public inSR?: number;

  private get _options(): RequestQueryBuilderOptions {
    return RequestQueryBuilder.getOptions();
  }

  static create(): RequestQueryParser {
    return new RequestQueryParser();
  }

  getParsed(): ParsedRequestParams {
    return {
      fields: this.fields,
      search: this.search,
      paramsFilter: this.paramsFilter,
      filter: this.filter,
      or: this.or,
      join: this.join,
      sort: this.sort,
      limit: this.limit,
      offset: this.offset,
      page: this.page,
      outSR: this.outSR,
      bbox: this.bbox,
      filterGeo: this.filterGeo,
      inSR: this.inSR,
    };
  }

  parseQuery(query: any): this {
    if (isObject(query)) {
      const paramNames = objKeys(query);

      if (hasLength(paramNames)) {
        this._query = query;
        this._paramNames = paramNames;
        const searchData = this._query[this.getParamNames('search')[0]];
        this.search = this.parseSearchQueryParam(searchData) as any;
        if (isNil(this.search)) {
          this.filter = this.parseQueryParam('filter', this.conditionParser.bind(this, 'filter'));
          this.or = this.parseQueryParam('or', this.conditionParser.bind(this, 'or'));
        }
        this.fields = this.parseQueryParam('fields', this.fieldsParser.bind(this))[0] || [];
        this.join = this.parseQueryParam('join', this.joinParser.bind(this));
        this.sort = this.parseQueryParam('sort', this.sortParser.bind(this));
        this.limit = this.parseQueryParam('limit', this.numericParser.bind(this, 'limit'))[0];
        this.offset = this.parseQueryParam('offset', this.numericParser.bind(this, 'offset'))[0];
        this.page = this.parseQueryParam('page', this.numericParser.bind(this, 'page'))[0];
        this.cache = this.parseQueryParam('cache', this.numericParser.bind(this, 'cache'))[0];
      }
    }

    return this;
  }

  parseParams(params: any, options: CrudParamOption): this {
    if (isObject(params)) {
      const paramNames = objKeys(params);

      if (hasLength(paramNames)) {
        this._params = params;
        this._paramsOptions = options;
      }
    }

    return this;
  }

  convertFilterToSearch(filter: QueryFilter): SFields | SConditionAND {
    const isEmptyValue = {
      isnull: true,
      notnull: true,
    };

    return filter
      ? {
          [filter.field]: {
            [filter.operator]: isEmptyValue[filter.operator] ? isEmptyValue[filter.operator] : filter['value'],
          },
        }
      : /* istanbul ignore next */ {};
  }

  private getParamNames(type: keyof RequestQueryBuilderOptions['paramNamesMap']): string[] {
    return this._paramNames.filter((p) => {
      const name = this._options.paramNamesMap[type];
      return isString(name) ? name === p : (name as string[]).some((m) => m === p);
    });
  }

  private getParamValues(value: string | string[], parser: any): string[] {
    if (isStringFull(value)) {
      return [parser.call(this, value)];
    }

    if (isArrayFull(value)) {
      return (value as string[]).map((val) => parser(val));
    }

    return [];
  }

  private parseQueryParam(type: keyof RequestQueryBuilderOptions['paramNamesMap'], parser: any) {
    const param = this.getParamNames(type);

    if (isArrayFull(param)) {
      return param.reduce((a, name) => [...a, ...this.getParamValues(this._query[name], parser)], []);
    }

    return [];
  }

  private parseValue(val: any) {
    try {
      const parsed = JSON.parse(val);

      if (!isDate(parsed) && isObject(parsed)) {
        // throw new Error('Don\'t support object now');
        return val;
      } else if (typeof parsed === 'number' && parsed.toLocaleString('fullwide', { useGrouping: false }) !== val) {
        // JS cannot handle big numbers. Leave it as a string to prevent data loss
        return val;
      }

      return parsed;
    } catch (ignored) {
      if (isDateString(val)) {
        return new Date(val);
      }

      return val;
    }
  }

  private parseValues(vals: any) {
    if (isArrayFull(vals)) {
      return vals.map((v: any) => this.parseValue(v));
    } else {
      return this.parseValue(vals);
    }
  }

  private fieldsParser(data: string): QueryFields {
    return data.split(DELIMSTR_CHAR);
  }

  private parseSearchQueryParam(d: any): SCondition {
    try {
      if (isNil(d)) {
        return undefined;
      }

      const data = JSON.parse(d);

      if (!isObject(data)) {
        throw new Error();
      }

      return data;
    } catch (_) {
      throw new RequestQueryException('Invalid search param. JSON expected');
    }
  }

  private conditionParser(cond: 'filter' | 'or' | 'search', data: string): QueryFilter {
    const isArrayValue = ['in', 'notin', 'between', '$in', '$notin', '$between', '$inL', '$notinL'];
    const isEmptyValue = ['isnull', 'notnull', '$isnull', '$notnull'];
    const param = data.split(DELIM_CHAR);
    const field = param[0];
    const operator = param[1] as CondOperator;
    let value = param[2] || '';

    if (isArrayValue.some((name) => name === operator)) {
      value = value.split(DELIMSTR_CHAR) as any;
    }

    value = this.parseValues(value);

    if (!isEmptyValue.some((name) => name === operator) && !hasValue(value)) {
      throw new RequestQueryException(`Invalid ${cond} value`);
    }

    const condition: QueryFilter = { field, operator, value } as QueryFilter;
    validateCondition(condition, cond);

    return condition;
  }

  private joinParser(data: string): QueryJoin {
    const param = data.split(DELIM_CHAR);
    const join: QueryJoin = {
      field: param[0],
      select: isStringFull(param[1]) ? param[1].split(DELIMSTR_CHAR) : undefined,
    };
    validateJoin(join);

    return join;
  }

  private sortParser(data: string): QuerySort {
    const param = data.split(DELIMSTR_CHAR);
    const sort: QuerySort = {
      field: param[0],
      order: param[1] as any,
    };
    validateSort(sort);

    return sort;
  }

  private numericParser(num: 'limit' | 'offset' | 'page' | 'cache' | 'includeDeleted', data: string): number {
    const val = this.parseValue(data);
    validateNumeric(val, num);

    return val;
  }

  private paramParser(name: string): QueryFilter {
    return { field: option.field, operator: CondOperator.EQUALS, value };
  }
}
