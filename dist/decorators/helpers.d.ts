import { RequestMethod, ParseIntPipe, ValidationPipe } from '@nestjs/common';
import { RouteParamtypes } from '@nestjs/common/enums/route-paramtypes.enum';
import { CrudActions, CrudValidate } from '../enums';
import { CrudOptions } from '../interfaces';
import { BaseRouteName } from '../types';
export declare function setRoute(path: string, method: RequestMethod, func: Function): void;
export declare function setParamTypes(args: any[], prototype: any, name: string): void;
export declare function setParams(metadata: any, target: object, name: string): void;
export declare function setInterceptors(interceptors: any[], func: Function): void;
export declare function setAction(action: CrudActions, func: Function): void;
export declare function setSwaggerOkResponseMeta(meta: any, func: Function): void;
export declare function setSwaggerOperationMeta(meta: any, func: Function): void;
export declare function setSwaggerParamsMeta(meta: any, func: Function): void;
export declare function setSwaggerOkResponse(func: Function, dto: any, isArray?: boolean): void;
export declare function setSwaggerOperation(func: Function, summary?: string): void;
export declare function setSwaggerParams(func: Function, crudOptions: CrudOptions): void;
export declare function setSwaggerQueryGetOne(func: Function): void;
export declare function setSwaggerQueryGetMany(func: Function, name: string): void;
export declare function createParamMetadata(paramtype: RouteParamtypes, index: number, pipes?: any[], data?: any): any;
export declare function createCustomRequestParamMetadata(paramtype: string, index: number, pipes?: any[], data?: any): any;
export declare function getOverrideMetadata(func: Function): string;
export declare function getInterceptors(func: Function): any[];
export declare function getAction(func: Function): CrudActions;
export declare function getControllerPath(target: any): string;
export declare function getSwaggerParams(func: Function): any[];
export declare function getSwaggeOkResponse(func: Function): any;
export declare function getSwaggerOperation(func: Function): any;
export declare function setValidationPipe(crudOptions: CrudOptions, group: CrudValidate): ValidationPipe;
export declare function setParseIntPipe(): ParseIntPipe;
export declare function enableRoute(name: BaseRouteName, crudOptions: CrudOptions): boolean;
export declare function paramsOptionsInit(crudOptions: CrudOptions): void;
export declare function getRoutesSlugName(crudOptions: CrudOptions, path: string): string;
export declare function getRouteInterceptors(routeOptions: any): any[];
export declare function cleanRoutesOptionsInterceptors(crudOptions: CrudOptions): void;
