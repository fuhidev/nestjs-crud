import { RequestMapping, RequestMethod } from '@nestjs/common';
import { PARAMTYPES_METADATA, PATH_METADATA, ROUTE_ARGS_METADATA } from '@nestjs/common/constants';
import { RouteParamtypes } from '@nestjs/common/enums/route-paramtypes.enum';
import {
  ACTION_NAME_METADATA,
  CRUD_OPTIONS_METADATA,
  CUSTOM_ROUTE_ARGS_METADATA,
  PARSED_CRUD_REQUEST_KEY,
} from '../../constants';
import { MergedCrudOptions } from '../../interfaces';
export class GISCrudRoutesFactory {
  private options: MergedCrudOptions;
  constructor(private target) {}
  create() {
    this.options = Reflect.getMetadata(CRUD_OPTIONS_METADATA, this.target);
    this.registerMethod();
    this.setRouteArgs();
    this.setRouteArgsTypes();
    this.setAction();
    this.setRoutePath();
  }

  private setRouteArgs() {
    let requestArg = {
      [`${PARSED_CRUD_REQUEST_KEY}${CUSTOM_ROUTE_ARGS_METADATA}:${0}`]: {
        index: 0,
        factory: (_, ctx) => {
          return (ctx.switchToHttp ? ctx.switchToHttp().getRequest() : ctx)[PARSED_CRUD_REQUEST_KEY];
        },
        data: undefined,
        pipes: [],
      },
    };

    ['getCountBase', 'getSumBase', 'getManyBasePost'].forEach((route) => {
      Reflect.defineMetadata(ROUTE_ARGS_METADATA, { ...requestArg }, this.target, route);
    });

    Reflect.defineMetadata(
      ROUTE_ARGS_METADATA,
      {
        ...requestArg,
        ...{
          [`${RouteParamtypes.RESPONSE}:${1}`]: {
            index: 1,
            data: undefined,
            pipes: [],
          },
          [`${RouteParamtypes.QUERY}:${2}`]: {
            index: 2,
            data: undefined,
            pipes: [],
          },
        },
      },
      this.target,
      'exportShpManyBase',
    );

    Reflect.defineMetadata(
      ROUTE_ARGS_METADATA,
      {
        [`${RouteParamtypes.BODY}:${0}`]: {
          index: 0,
          pipes: [],
          data: undefined,
        },
      },
      this.target,
      'executeSqlBase',
    );
  }

  private setRouteArgsTypes() {
    Reflect.defineMetadata(PARAMTYPES_METADATA, [Object], this.target.prototype, 'getManyBasePost');
  }

  private canCreateRoute(name: string) {
    if (name === 'getManyBasePost') name = 'getManyBase';
    const only = this.options.routes.only;
    const exclude = this.options.routes.exclude;

    if (Array.isArray(only) && only.length) {
      return only.some((route) => route === name);
    }

    if (Array.isArray(exclude) && exclude.length) {
      return !exclude.some((route) => route === name);
    }

    return true;
  }

  private setAction() {
    Reflect.defineMetadata(ACTION_NAME_METADATA, 'Read-All-Post', this.target.prototype.getManyBasePost);
  }

  private registerMethod() {
    this.target.prototype.getManyBasePost = function (req) {
      return this.service.getMany(req);
    };
  }

  private setRoutePath() {
    RequestMapping({ method: RequestMethod.POST, path: '/query' })(this.target.prototype, null, {
      value: this.target.prototype.getManyBasePost,
    });
    let getOneBasePath: string, getOneBaseOld;
    if (this.canCreateRoute('getOneBase')) {
      getOneBaseOld = this.target.prototype.getOneBase;

      if (this.target.prototype.getOneBase) {
        getOneBasePath = Reflect.getMetadata(PATH_METADATA, this.target.prototype.getOneBase);
        delete this.target.prototype.getOneBase;
      }
    }

    if (getOneBasePath) {
      this.target.prototype.getOneBase = getOneBaseOld;
      RequestMapping({ method: RequestMethod.GET, path: getOneBasePath })(this.target, null, {
        value: this.target.prototype.getOneBase,
      });
    }
  }
}
