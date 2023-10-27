export interface ParamNamesMap {
 fields?: string | string[];
 search?: string | string[];
 filter?: string | string[];
 or?: string | string[];
 join?: string | string[];
 sort?: string | string[];
 limit?: string | string[];
 offset?: string | string[];
 page?: string | string[];
 cache?: string | string[];
}
export interface RequestQueryBuilderOptions {
 paramNamesMap?: ParamNamesMap;
}

export const DELIM_CHAR = "||";
export const DELIMSTR_CHAR = ",";
