import { RequestMethod } from "@nestjs/common";
import { RouteParamtypes } from "@nestjs/common/enums/route-paramtypes.enum";

import {
 getOwnPropNames,
 isArrayFull,
 isEqual,
 isIn,
 isNil,
 isObjectFull,
} from "nest-crud-client";
import { CrudActions } from "../enums";
import {
 CrudRequestInterceptor,
 CrudResponseInterceptor,
} from "../interceptors";
import {
 BaseRoute,
 CrudOptions,
 CrudRequest,
 MergedCrudOptions,
} from "../interfaces";
import { CrudConfigService } from "../module";
import { TypeOrmCrudService } from "../typeorm";
import { BaseRouteName } from "../types";
import deepmerge from "../util/deepmerge";
import { R } from "./reflection.helper";

export class CrudRoutesFactory {
 protected options: MergedCrudOptions;

 constructor(
  protected target: any,
  options: CrudOptions
 ) {
  this.options = options;
  this.create();
 }

 /* istanbul ignore next */
 static create(target: any, options: CrudOptions): CrudRoutesFactory {
  return new CrudRoutesFactory(target, options);
 }

 protected get targetProto(): any {
  return this.target.prototype;
 }

 protected get actionsMap(): { [key in BaseRouteName]: CrudActions } {
  return {
   getManyBase: CrudActions.ReadAll,
   getManyPostBase: CrudActions.ReadAll,
   getOneBase: CrudActions.ReadOne,
   createManyBase: CrudActions.CreateMany,
   createOneBase: CrudActions.CreateOne,
   updateOneBase: CrudActions.UpdateOne,
   deleteOneBase: CrudActions.DeleteOne,
   replaceOneBase: CrudActions.ReplaceOne,
   recoverOneBase: CrudActions.RecoverOne,
   getCountBase: CrudActions.ReadCount,
   getSumBase: CrudActions.ReadSum,
  };
 }

 protected create() {
  const routesSchema = this.getRoutesSchema();
  this.mergeOptions();
  this.createRoutes(routesSchema);
  this.overrideRoutes(routesSchema);
  this.enableRoutes(routesSchema);
 }

 protected mergeOptions() {
  // merge query config
  const query = isObjectFull(this.options.query) ? this.options.query : {};
  this.options.query = { ...CrudConfigService.config.query, ...query };

  // merge routes config
  const routes = isObjectFull(this.options.routes) ? this.options.routes : {};
  this.options.routes = deepmerge(CrudConfigService.config.routes, routes, {
   arrayMerge: (a, b, c) => b,
  });

  R.setCrudOptions(this.options, this.target);
 }

 protected getRoutesSchema(): BaseRoute[] {
  return [
   {
    name: "getCountBase",
    path: "/count",
    method: RequestMethod.GET,
    enable: false,
    override: false,
    withParams: false,
   },
   {
    name: "getSumBase",
    path: "/sum",
    method: RequestMethod.GET,
    enable: false,
    override: false,
    withParams: false,
   },
   {
    name: "getOneBase",
    path: "/",
    method: RequestMethod.GET,
    enable: false,
    override: false,
    withParams: true,
   },
   {
    name: "getManyBase",
    path: "/",
    method: RequestMethod.GET,
    enable: false,
    override: false,
    withParams: false,
   },
   {
    relation: "getManyBase",
    name: "getManyPostBase",
    path: "/query",
    method: RequestMethod.POST,
    enable: false,
    override: false,
    withParams: false,
   },
   {
    name: "createOneBase",
    path: "/",
    method: RequestMethod.POST,
    enable: false,
    override: false,
    withParams: false,
   },
   {
    name: "createManyBase",
    path: "/bulk",
    method: RequestMethod.POST,
    enable: false,
    override: false,
    withParams: false,
   },
   {
    name: "updateOneBase",
    path: "/",
    method: RequestMethod.PATCH,
    enable: false,
    override: false,
    withParams: true,
   },
   {
    name: "replaceOneBase",
    path: "/",
    method: RequestMethod.PUT,
    enable: false,
    override: false,
    withParams: true,
   },
   {
    name: "deleteOneBase",
    path: "/",
    method: RequestMethod.DELETE,
    enable: false,
    override: false,
    withParams: true,
   },
   {
    name: "recoverOneBase",
    path: "/recover",
    method: RequestMethod.PATCH,
    enable: false,
    override: false,
    withParams: true,
   },
  ];
 }

 protected getManyBase(name: BaseRouteName) {
  this.targetProto[name] = function (req: CrudRequest) {
   return this.service.getMany(req);
  };
 }
 protected getManyPostBase(name: BaseRouteName) {
  this.targetProto[name] = function (req: CrudRequest) {
   return this.service.getMany(req);
  };
 }
 protected getOneBase(name: BaseRouteName) {
  this.targetProto[name] = function (req: CrudRequest) {
   return this.service.getOne(req);
  };
 }

 protected createOneBase(name: BaseRouteName) {
  this.targetProto[name] = function (req: CrudRequest, dto: any) {
   return this.service.createOne(req, dto);
  };
 }

 protected createManyBase(name: BaseRouteName) {
  this.targetProto[name] = function (req: CrudRequest, dto: any) {
   return this.service.createMany(req, dto);
  };
 }

 protected updateOneBase(name: BaseRouteName) {
  this.targetProto[name] = function (req: CrudRequest, dto: any) {
   return this.service.updateOne(req, dto);
  };
 }

 protected replaceOneBase(name: BaseRouteName) {
  this.targetProto[name] = function (req: CrudRequest, dto: any) {
   return this.service.replaceOne(req, dto);
  };
 }

 protected deleteOneBase(name: BaseRouteName) {
  this.targetProto[name] = function (req: CrudRequest) {
   return this.service.deleteOne(req);
  };
 }
 protected getCountBase(name: BaseRouteName) {
  this.targetProto[name] = function (req: CrudRequest) {
   return (this.service as TypeOrmCrudService).getCount(req);
  };
 }
 protected getSumBase(name: BaseRouteName) {
  this.targetProto[name] = function (req: CrudRequest) {
   return (this.service as TypeOrmCrudService).getSum(req);
  };
 }
 protected recoverOneBase(name: BaseRouteName) {
  this.targetProto[name] = function (req: CrudRequest) {
   return this.service.recoverOne(req);
  };
 }

 protected canCreateRoute(name: BaseRouteName) {
  const only = this.options.routes.only;
  const exclude = this.options.routes.exclude;

  // include recover route only for models with soft delete option
  if (name === "recoverOneBase" && this.options.query.softDelete !== true) {
   return false;
  }

  if (isArrayFull(only)) {
   return only.some((route) => route === name);
  }

  if (isArrayFull(exclude)) {
   return !exclude.some((route) => route === name);
  }

  return true;
 }

 protected createRoutes(routesSchema: BaseRoute[]) {
  routesSchema.forEach((route) => {
   if (this.canCreateRoute(route.relation ?? route.name)) {
    // create base method
    this[route.name](route.name);
    route.enable = true;
    // set metadata
    this.setBaseRouteMeta(route);
   }

   if (route.withParams) {
    route.path = `/:${this.options.params.primaryKey}${
     route.path !== "/" ? route.path : ""
    }`;
   }
  });
 }

 protected overrideRoutes(routesSchema: BaseRoute[]) {
  getOwnPropNames(this.targetProto).forEach((name) => {
   const override = R.getOverrideRoute(this.targetProto[name]);
   const route = routesSchema.find((r) => isEqual(r.name, override));

   if (override && route && route.enable) {
    // get metadata
    const interceptors = R.getInterceptors(this.targetProto[name]);
    const baseInterceptors = R.getInterceptors(this.targetProto[override]);
    const baseAction = R.getAction(this.targetProto[override]);
    // set metadata
    R.setInterceptors(
     [...baseInterceptors, ...interceptors],
     this.targetProto[name]
    );
    R.setAction(baseAction, this.targetProto[name]);
    this.overrideParsedBodyDecorator(override, name);
    // enable route
    R.setRoute(route, this.targetProto[name]);
    route.override = true;
   }
  });
 }

 protected enableRoutes(routesSchema: BaseRoute[]) {
  routesSchema.forEach((route) => {
   if (!route.override && route.enable) {
    R.setRoute(route, this.targetProto[route.name]);
   }
  });
 }

 protected overrideParsedBodyDecorator(override: BaseRouteName, name: string) {
  const allowed = [
   "createManyBase",
   "createOneBase",
   "updateOneBase",
   "replaceOneBase",
  ] as BaseRouteName[];
  const withBody = isIn(override, allowed);
  const parsedBody = R.getParsedBody(this.targetProto[name]);

  if (withBody && parsedBody) {
   const baseKey = `${RouteParamtypes.BODY}:1`;
   const key = `${RouteParamtypes.BODY}:${parsedBody.index}`;
   const baseRouteArgs = R.getRouteArgs(this.target, override);
   const routeArgs = R.getRouteArgs(this.target, name);
   const baseBodyArg = baseRouteArgs[baseKey];
   R.setRouteArgs(
    {
     ...routeArgs,
     [key]: {
      ...baseBodyArg,
      index: parsedBody.index,
     },
    },
    this.target,
    name
   );

   /* istanbul ignore else */
   if (isEqual(override, "createManyBase")) {
    const paramTypes = R.getRouteArgsTypes(this.targetProto, name);
    const metatype = paramTypes[parsedBody.index];
    const types = [String, Boolean, Number, Array, Object];
    const toCopy =
     isIn(metatype, types) || /* istanbul ignore next */ isNil(metatype);

    /* istanbul ignore else */
    if (toCopy) {
     const baseParamTypes = R.getRouteArgsTypes(this.targetProto, override);
     const baseMetatype = baseParamTypes[1];
     paramTypes.splice(parsedBody.index, 1, baseMetatype);
     R.setRouteArgsTypes(paramTypes, this.targetProto, name);
    }
   }
  }
 }

 protected setBaseRouteMeta(route: BaseRoute) {
  this.setRouteArgs(route);
  this.setRouteArgsTypes(route);
  this.setInterceptors(route);
  this.setAction(route);
  // set decorators after Swagger so metadata can be overwritten
  this.setDecorators(route);
 }

 protected setRouteArgs(route: BaseRoute) {
  let rest = {};
  const routes: BaseRouteName[] = [
   "createManyBase",
   "createOneBase",
   "updateOneBase",
   "replaceOneBase",
  ];

  if (isIn(route.name, routes)) {
   rest = R.setBodyArg(1);
  }

  R.setRouteArgs(
   { ...R.setParsedRequestArg(0), ...rest },
   this.target,
   route.name
  );
 }

 protected setRouteArgsTypes(route: BaseRoute) {
  if (isEqual(route.name, "createManyBase")) {
   R.setRouteArgsTypes([Object, Object], this.targetProto, route.name);
  } else if (
   isIn(route.name, ["createOneBase", "updateOneBase", "replaceOneBase"])
  ) {
   R.setRouteArgsTypes([Object, Object], this.targetProto, route.name);
  } else {
   R.setRouteArgsTypes([Object], this.targetProto, route.name);
  }
 }

 protected setInterceptors(route: BaseRoute) {
  const interceptors =
   this.options.routes[route.relation ?? route.name].interceptors;
  R.setInterceptors(
   [
    CrudRequestInterceptor,
    CrudResponseInterceptor,
    ...(isArrayFull(interceptors)
     ? /* istanbul ignore next */ interceptors
     : []),
   ],
   this.targetProto[route.name]
  );
 }

 protected setDecorators(route: BaseRoute) {
  const decorators =
   this.options.routes[route.relation ?? route.name].decorators;
  R.setDecorators(
   isArrayFull(decorators) ? /* istanbul ignore next */ decorators : [],
   this.targetProto,
   route.name
  );
 }

 protected setAction(route: BaseRoute) {
  R.setAction(this.actionsMap[route.name], this.targetProto[route.name]);
 }

 protected routeNameAction(name: BaseRouteName): string {
  return (
   name.split("OneBase")[0] ||
   /* istanbul ignore next */ name.split("ManyBase")[0]
  );
 }
}
