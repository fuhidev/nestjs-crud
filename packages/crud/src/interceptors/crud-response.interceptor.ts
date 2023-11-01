import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { ClassTransformOptions, classToPlain, classToPlainFromExist } from 'class-transformer';
import { isFalse, isFunction, isObject } from 'nest-crud-client';
import { Observable } from 'rxjs';
import { CrudActions } from '../enums';
import { SerializeOptions } from '../interfaces';
import { CrudBaseInterceptor } from './crud-base.interceptor';

const actionToDtoNameMap: {
  [key in CrudActions]: keyof SerializeOptions;
} = {
  [CrudActions.ReadAll]: 'getMany',
  [CrudActions.ReadOne]: 'get',
  [CrudActions.CreateMany]: 'createMany',
  [CrudActions.CreateOne]: 'create',
  [CrudActions.UpdateOne]: 'update',
  [CrudActions.ReplaceOne]: 'replace',
  [CrudActions.DeleteAll]: 'delete',
  [CrudActions.DeleteOne]: 'delete',
  [CrudActions.RecoverOne]: 'recover',
};

@Injectable()
export class CrudResponseInterceptor extends CrudBaseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle();
  }

  protected transform(dto: any, data: any, options: ClassTransformOptions) {
    if (!isObject(data) || isFalse(dto)) {
      return data;
    }

    if (!isFunction(dto)) {
      return data.constructor !== Object ? classToPlain(data, options) : data;
    }

    return data instanceof dto
      ? classToPlain(data, options)
      : classToPlain(classToPlainFromExist(data, new dto()), options);
  }
}
