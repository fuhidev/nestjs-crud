import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreateBuilderParam,
  TypeOrmCrudService
} from 'nest-crud-server';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { DistrictEntity } from './district.entity';

@Injectable()
export class DistrictService extends TypeOrmCrudService<DistrictEntity> {
  constructor(
    @InjectRepository(DistrictEntity) repo: Repository<DistrictEntity>,
  ) {
    super(repo);
  }


 async  createBuilder(params: CreateBuilderParam): Promise<SelectQueryBuilder<DistrictEntity>> {
       const builder = await super.createBuilder(
     params
    );
    builder.orderBy(`${this.alias}.numbering`, 'ASC');
    return builder;
  }

}
