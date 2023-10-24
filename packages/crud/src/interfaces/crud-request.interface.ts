import { ParsedRequestParams } from 'nest-crud-client';

import { CrudRequestOptions } from '../interfaces';

export interface CrudRequest {
  parsed: ParsedRequestParams;
  options: CrudRequestOptions;
}
