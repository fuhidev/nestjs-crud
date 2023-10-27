import axios, { AxiosRequestConfig, GenericAbortSignal } from "axios";
import {
  CreateQueryParams,
  QueryFilterGeo,
  RequestQueryBuilder,
} from "../crud-request";

export interface CrudBaseOptions {
 entity: string;
 apiUrl: string;
 primaryKey?: string;
}

export interface ResponsePagination<T = any> {
 data: Array<T>;
 count: number;
 total: number;
 page: number;
 pageCount: number;
}

export type BuilderParams<T> = RequestQueryBuilder<T> | CreateQueryParams<T>;

export abstract class CrudBaseService<T = any> {
 entity: string;
 apiUrl: string;
 primaryKey?: string;
 constructor(options: CrudBaseOptions) {
  this.entity = options.entity;
  this.apiUrl = options.apiUrl;
  this.primaryKey = options.primaryKey;
 }

 request<T>(config: AxiosRequestConfig): Promise<T> {
  return axios.request(config).then((t) => t.data);
 }

 //  static createByUrl(url: string) {
 //   const lastIdx = url.lastIndexOf("/");
 //   const apiUrl = url.substring(0, lastIdx);
 //   const entity = url.substr(lastIdx + 1);
 //   //@ts-ignore
 //   return new (class extends CrudBaseService {})({ apiUrl, entity });
 //  }

 getPagination(
  limit: number,
  page: number,
  opts: {
   builder?: BuilderParams<T>;
   signal?: GenericAbortSignal;
  }
 ): Promise<ResponsePagination<T>> {
  opts = opts || {};
  let { builder, signal } = opts;
  if (!builder) {
   builder = RequestQueryBuilder.create();
  } else if (!(builder instanceof RequestQueryBuilder)) {
   builder = RequestQueryBuilder.create(builder);
  }
  builder.setLimit(limit);
  builder.setPage(page);

  const filterGeo = this.getBodyFilterGeo(builder);
  if (filterGeo) {
   return this.request<ResponsePagination<T>>({
    signal,
    url: this.getBaseUrl() + "/query",
    method: "POST",
    data: JSON.stringify(filterGeo),
    params: this.getParamsFromQuery(builder),
    headers: {
     "Content-Type": "application/json",
    },
   });
  }

  return this.request<ResponsePagination<T>>({
   url: this.getBaseUrl(),
   method: "GET",
   params: this.getParamsFromQuery(builder),
  });
 }

 getMany(opts?: {
  builder?: BuilderParams<T>;
  signal?: GenericAbortSignal;
 }): Promise<T[]> {
  opts = opts || {};
  let { builder, signal } = opts;
  const filterGeo = this.getBodyFilterGeo(builder);
  if (filterGeo) {
   return this.request<T[]>({
    url: this.getBaseUrl() + "/query",
    data: JSON.stringify(filterGeo),
    method: "POST",
    signal,
    params: this.getParamsFromQuery(builder),
    headers: {
     "Content-Type": "application/json",
    },
   });
  }
  return this.request<T[]>({
   url: this.getBaseUrl(),
   method: "GET",
   params: this.getParamsFromQuery(builder),
  });
 }
 getCount(builder?: BuilderParams<T>) {
  return this.request<{ count: number }>({
   url: this.getBaseUrl() + "/count",
   params: this.getParamsFromQuery(builder),
  });
 }

 getOne(
  value: number | string | boolean,
  opts?: {
   builder?: BuilderParams<T>;
   signal?: GenericAbortSignal;
  }
 ): Promise<T> {
  opts = opts || {};
  let { builder, signal } = opts;
  const url = this.getOneUrl(value);
  const filterGeo = this.getBodyFilterGeo(builder);
  if (filterGeo) {
   return this.request<T>({
    url: this.getBaseUrl() + `/query/${value}`,
    data: JSON.stringify(filterGeo),
    method: "POST",
    signal,
    params: this.getParamsFromQuery(builder),
    headers: {
     "Content-Type": "application/json",
    },
   });
  }
  return this.request<T>({
   url,
   params: this.getParamsFromQuery(builder),
  });
 }

 private getBodyFilterGeo(
  builder?: BuilderParams<T>
 ): null | { filterGeo: QueryFilterGeo } {
  let filterGeo: QueryFilterGeo | undefined;
  if (typeof builder === "object") {
   if ((builder as CreateQueryParams<T>).filterGeo) {
    filterGeo = (builder as CreateQueryParams<T>).filterGeo;
   } else {
    filterGeo = (builder as RequestQueryBuilder<T>).filterGeo;
   }
  }
  return filterGeo ? { filterGeo } : null;
 }

 create(
  body: T,
  opts?: { builder?: BuilderParams<T>; signal?: GenericAbortSignal }
 ): Promise<T> {
  opts = opts || {};
  let { builder, signal } = opts;
  this.getBodyFilterGeo(builder);

  return this.request<T>({
   url: this.getBaseUrl(),
   data: JSON.stringify({ ...body, ...this.getBodyFilterGeo(builder) }),
   method: "POST",
   signal,
   params: this.getParamsFromQuery(builder),
   headers: {
    "Content-Type": "application/json",
   },
  });
 }

 createMany(
  body: T[],
  opts?: { builder?: BuilderParams<T>; signal?: GenericAbortSignal }
 ): Promise<T[]> {
  opts = opts || {};
  let { builder, signal } = opts;
  return this.request<T[]>({
   url: this.getBaseUrl() + "/bulk",
   data: JSON.stringify({ bulk: body, ...this.getBodyFilterGeo(builder) }),
   params: this.getParamsFromQuery(builder),
   method: "POST",
   signal,
   headers: {
    "Content-Type": "application/json",
   },
  });
 }

 put(
  value: number | string | boolean,
  body: T,
  opts?: { builder?: BuilderParams<T>; signal?: GenericAbortSignal }
 ): Promise<T> {
  opts = opts || {};
  let { builder, signal } = opts;
  const url = this.getOneUrl(value);
  return axios
   .put<T>(
    url,
    JSON.stringify({ ...body, ...this.getBodyFilterGeo(builder) }),
    {
     params: this.getParamsFromQuery(builder),
     signal,
     method: "PUT",
     headers: {
      "Content-Type": "application/json",
     },
    }
   )
   .then((t) => t.data);
 }

 patch(
  value: number | string | boolean,
  body: T,
  opts?: { builder?: BuilderParams<T>; signal?: GenericAbortSignal }
 ): Promise<T> {
  opts = opts || {};
  let { builder, signal } = opts;
  const url = this.getOneUrl(value);
  return this.request<T>({
   url,
   data: JSON.stringify({ ...body, ...this.getBodyFilterGeo(builder) }),
   method: "PATCH",
   params: this.getParamsFromQuery(builder),
   signal,
   headers: {
    "Content-Type": "application/json",
   },
  });
 }
 executeSql(params: { query: string }): Promise<any> {
  return axios.post<any>(
   this.getBaseUrl() + "/execute",
   JSON.stringify(params),
   {
    headers: {
     "Content-Type": "application/json",
    },
   }
  );
 }

 delete(value: number | string | boolean) {
  return this.request({
   method: "DELETE",
   url: this.getBaseUrl() + "/" + value,
  });
 }

 getParamsFromQuery(builder?: BuilderParams<T>) {
  if (!(builder instanceof RequestQueryBuilder)) {
   builder = RequestQueryBuilder.create(builder);
  }
  return this.getQuery(builder);
 }

 /**
  * Get request link
  */
 public getBaseUrl(): string {
  return `${this.apiUrl}/${this.entity}`;
 }

 public getOneUrl(value: number | string | boolean) {
  return `${this.getBaseUrl()}/${value}`;
 }

 getQuery(builder?: RequestQueryBuilder<T>) {
  if (builder) {
   return builder.queryObject;
  }
  return {};
 }
}
