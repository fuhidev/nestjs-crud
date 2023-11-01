import { CrudRoutesFactory } from '../crud';
import { CrudOptions } from '../interfaces';

export const Crud =
  (options: CrudOptions) =>
  (target: unknown): void => {
    const factoryMethod = CrudRoutesFactory;
    const factory = new factoryMethod(target, options);
  };
