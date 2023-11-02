import { CrudRequestOptions } from "../interfaces";
import { ParsedRequestParams } from "../request-parse/parsed-request.interface";

export interface CrudRequest {
 req: any;
 parsed: ParsedRequestParams;
 options: CrudRequestOptions;
}
