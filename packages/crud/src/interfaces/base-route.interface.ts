import { RequestMethod } from "@nestjs/common";

import { BaseRouteName } from "../types";

export interface BaseRoute {
 relation?: BaseRouteName;
 name: BaseRouteName;
 path: string;
 method: RequestMethod;
 enable: boolean;
 override: boolean;
 withParams: boolean;
}
