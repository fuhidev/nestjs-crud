import { QueryFilter, QueryJoin } from "nest-crud-client";
import { DeepPartial, Repository, SelectQueryBuilder } from "typeorm";
import {
 CreateManyDto,
 CrudRequest,
 JoinOption,
 QueryOptions,
} from "../interfaces";

export type TypeormDefaultParam = CrudRequest;
export type CreateManyParam<T> = TypeormDefaultParam & {
 dto: CreateManyDto<DeepPartial<T>>;
};
export type DoGetManyParam<T> = TypeormDefaultParam & {
 builder: SelectQueryBuilder<T>;
};

export type CreateBuilderParam = {
 many?: boolean;
 withDeleted?: boolean;
} & TypeormDefaultParam;

export type GetOneOrFailParam = TypeormDefaultParam & {
 shallow?: boolean;
 withDeleted?: boolean;
};

export type PrepareEntityBeforeSaveParam<T> = TypeormDefaultParam & {
 dto: DeepPartial<T>;
};

export type GetAllowedColumnsParam = {
 columns: string[];
 options: QueryOptions;
};

export type GetRelationMetadataParam = { field: string; options: JoinOption };

export type SetJoinParam<T> = {
 cond: QueryJoin;
 joinOptions: JoinOption;
 builder: SelectQueryBuilder<T>;
};

export type SetAndWhereParam<T> = {
 cond: QueryFilter;
 i: any;
 builder: SelectQueryBuilder<T>;
};

export type CreateOneParam<T> = TypeormDefaultParam & { dto: DeepPartial<T> };
export type RecoverOneParam = TypeormDefaultParam;
export type DeleteOneParam = TypeormDefaultParam;

export type TypeOrmCrudConstructor<T = any> = CrudRequest & {
 repo: Repository<T>;
};

export interface IAllowedRelation {
 alias?: string;
 nested: boolean;
 name: string;
 path: string;
 columns: string[];
 primaryColumns: string[];
 allowedColumns: string[];
}
