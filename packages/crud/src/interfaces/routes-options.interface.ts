import { BaseRouteName, BaseRouteRef } from "../types";
export type SelectRoute = Exclude<BaseRouteName, BaseRouteRef>;
export interface RoutesOptions {
 exclude?: SelectRoute[];
 only?: SelectRoute[];
 getManyBase?: GetManyRouteOptions;
 getOneBase?: GetOneRouteOptions;
 createOneBase?: CreateOneRouteOptions;
 createManyBase?: CreateManyRouteOptions;
 updateOneBase?: UpdateOneRouteOptions;
 replaceOneBase?: ReplaceOneRouteOptions;
 deleteOneBase?: DeleteOneRouteOptions;
 recoverOneBase?: RecoverOneRouteOptions;
 getSumBase?: BaseRouteOptions;
 getCountBase?: BaseRouteOptions;
}

export interface BaseRouteOptions {
 interceptors?: any[];
 decorators?: (PropertyDecorator | MethodDecorator)[];
}

export type GetManyRouteOptions = BaseRouteOptions;

export type GetOneRouteOptions = BaseRouteOptions;

export interface CreateOneRouteOptions extends BaseRouteOptions {
 returnShallow?: boolean;
}

export type CreateManyRouteOptions = BaseRouteOptions;

export interface ReplaceOneRouteOptions extends BaseRouteOptions {
 returnShallow?: boolean;
}

export interface UpdateOneRouteOptions extends BaseRouteOptions {
 returnShallow?: boolean;
}

export interface DeleteOneRouteOptions extends BaseRouteOptions {
 returnDeleted?: boolean;
}

export interface RecoverOneRouteOptions extends BaseRouteOptions {
 returnRecovered?: boolean;
}
