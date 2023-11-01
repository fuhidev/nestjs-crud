import {
 BadRequestException,
 CallHandler,
 ExecutionContext,
 Injectable,
 NestInterceptor,
} from "@nestjs/common";
import {
 QueryFilter,
 RequestQueryException,
 SCondition,
 hasLength,
 isArrayFull,
 isFunction,
 isNil,
 isNumber,
} from "nest-crud-client";

import { PARSED_CRUD_REQUEST_KEY } from "../constants";
import { CrudActions } from "../enums";
import { CrudRequest, MergedCrudOptions } from "../interfaces";
import { RequestQueryParser } from "../request-parse/request-query.parse";
import { QueryFilterFunction } from "../types";
import { CrudBaseInterceptor } from "./crud-base.interceptor";

@Injectable()
export class CrudRequestInterceptor
 extends CrudBaseInterceptor
 implements NestInterceptor
{
 intercept(context: ExecutionContext, next: CallHandler) {
  const req = context.switchToHttp().getRequest();

  try {
   /* istanbul ignore else */
   if (!req[PARSED_CRUD_REQUEST_KEY]) {
    const { ctrlOptions, crudOptions, action } = this.getCrudInfo(context);
    const parser = RequestQueryParser.create();

    parser.parseQuery(req.query);

    if (!isNil(ctrlOptions)) {
     const search = this.getSearch(parser, crudOptions, action, req.params);
     parser.search = { $and: [...search] };
    } else {
     parser.search = { $and: this.getSearch(parser, crudOptions, action) };
    }

    req[PARSED_CRUD_REQUEST_KEY] = this.getCrudRequest(parser, crudOptions);
   }
   const value = req[PARSED_CRUD_REQUEST_KEY];
   if (value) {
    try {
     value.parsed.bbox = req.query.bbox ? JSON.parse(req.query.bbox) : null;
    } catch (error) {
     value.parsed.bbox = null;
    }
    value.parsed.outSR = isNumber(+req.query.outSR) ? +req.query.outSR : null;
    value.parsed.inSR = isNumber(+req.query.inSR) ? +req.query.inSR : null;
    value.parsed.filterGeo = req.body.filterGeo || null;
   }

   return next.handle();
  } catch (error) {
   /* istanbul ignore next */
   throw error instanceof RequestQueryException
    ? new BadRequestException(error.message)
    : error;
  }
 }

 getCrudRequest(
  parser: RequestQueryParser,
  crudOptions: Partial<MergedCrudOptions>
 ): CrudRequest {
  const parsed = parser.getParsed();
  const { query, routes, params } = crudOptions;

  return {
   parsed,
   options: {
    query,
    routes,
    params,
   },
  };
 }

 getSearch(
  parser: RequestQueryParser,
  crudOptions: Partial<MergedCrudOptions>,
  action: CrudActions,
  params?: any
 ): SCondition[] {
  // params condition
  const paramsSearch = this.getParamsSearch(parser, crudOptions, params);

  // if `CrudOptions.query.filter` is a function then return transformed query search conditions
  if (isFunction(crudOptions.query.filter)) {
   const filterCond =
    (crudOptions.query.filter as QueryFilterFunction)(
     parser.search,
     action === CrudActions.ReadAll
    ) || /* istanbul ignore next */ {};

   return [...paramsSearch, filterCond];
  }

  // if `CrudOptions.query.filter` is array or search condition type
  const optionsFilter = isArrayFull(crudOptions.query.filter)
   ? (crudOptions.query.filter as QueryFilter[]).map(
      parser.convertFilterToSearch
     )
   : [(crudOptions.query.filter as SCondition) || {}];

  let search: SCondition[] = [];

  if (parser.search) {
   search = [parser.search];
  } else if (hasLength(parser.filter) && hasLength(parser.or)) {
   search =
    parser.filter.length === 1 && parser.or.length === 1
     ? [
        {
         $or: [
          parser.convertFilterToSearch(parser.filter[0]),
          parser.convertFilterToSearch(parser.or[0]),
         ],
        },
       ]
     : [
        {
         $or: [
          { $and: parser.filter.map(parser.convertFilterToSearch) },
          { $and: parser.or.map(parser.convertFilterToSearch) },
         ],
        },
       ];
  } else if (hasLength(parser.filter)) {
   search = parser.filter.map(parser.convertFilterToSearch);
  } else {
   if (hasLength(parser.or)) {
    search =
     parser.or.length === 1
      ? [parser.convertFilterToSearch(parser.or[0])]
      : /* istanbul ignore next */ [
         {
          $or: parser.or.map(parser.convertFilterToSearch),
         },
        ];
   }
  }

  return [...paramsSearch, ...optionsFilter, ...search];
 }

 getParamsSearch(
  parser: RequestQueryParser,
  crudOptions: Partial<MergedCrudOptions>,
  params?: any
 ): SCondition[] {
  if (params) {
   parser.parseParams(params, crudOptions.params);

   return isArrayFull(parser.paramsFilter)
    ? parser.paramsFilter.map(parser.convertFilterToSearch)
    : [];
  }

  return [];
 }
}
