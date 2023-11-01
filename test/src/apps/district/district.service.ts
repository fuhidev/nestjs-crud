import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CrudRequestOptions,
  ParsedRequestParams,
  TypeOrmCrudService,
} from 'nest-crud-server';
import { Repository } from 'typeorm';
import { DistrictEntity } from './district.entity';

@Injectable()
export class DistrictService extends TypeOrmCrudService<DistrictEntity> {
  constructor(
    @InjectRepository(DistrictEntity) repo: Repository<DistrictEntity>,
  ) {
    super(repo);
  }

  async createBuilder(
    parsed: ParsedRequestParams,
    options: CrudRequestOptions,
    many?: boolean,
    withDeleted?: boolean,
  ) {
    const builder = await super.createBuilder(
      parsed,
      options,
      many,
      withDeleted,
    );
    builder.orderBy(`${this.alias}.numbering`, 'ASC');
    return builder;
  }
}
