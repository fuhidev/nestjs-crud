import { BadRequestException } from "@nestjs/common";
import { Envelope, QueryFilterGeo, SpatialMethodEnum } from "nest-crud-client";
import {
 DeepPartial,
 ObjectLiteral,
 Repository,
 SelectQueryBuilder,
} from "typeorm";
import { ColumnMetadata } from "typeorm/metadata/ColumnMetadata";
import {
 CreateManyDto,
 CrudRequest,
 CrudRequestOptions,
 GetManyDefaultResponse,
} from "../interfaces";
import { ParsedRequestParams } from "../request-parse";
import { TypeOrmCrudService } from "../typeorm/typeorm-crud.service";
import {
 ProjGeometryConvertor,
 ProjSupportType,
 proj4Convertor,
} from "./convertor/proj-convertor";
import { geojsonToWkt } from "./convertor/wkt-convertor";
import { ProjectGeometryService } from "./project-geometry";
import { gisModuleOption } from "./token";

export class GISTypeOrmCrudService<T> extends TypeOrmCrudService<T> {
 protected geometryService = new ProjectGeometryService();
 constructor(repo: Repository<T>) {
  super(repo);
 }
 public async createBuilder(
  parsed: ParsedRequestParams,
  options: CrudRequestOptions,
  opts?: { many: boolean; withDeleted: boolean } & ObjectLiteral
 ): Promise<SelectQueryBuilder<T>> {
  const builder = await super.createBuilder(parsed, options, opts);
  if (parsed.filterGeo && parsed.filterGeo.geometry) {
   await this.setAndWhereFilterGeo(builder, parsed.filterGeo);
  }
  if (parsed.bbox) {
   await this.setAndWhereBBox(builder, parsed.bbox);
  }

  return builder;
 }

 protected async setAndWhereFilterGeo(
  builder: SelectQueryBuilder<T>,
  filterGeo: QueryFilterGeo,
  pAlias = this.alias
 ) {
  const geoColumn = this.getGeometryColumn();
  let geoFilter = proj4Convertor.convert(filterGeo.geometry as ProjSupportType);
  let wktGeo = geojsonToWkt(geoFilter);
  if (wktGeo) {
   const stMethod =
    filterGeo.method === SpatialMethodEnum.Within
     ? "STWithin"
     : filterGeo.method === SpatialMethodEnum.Touches
     ? "STTouches"
     : "STIntersects";
   const alias = pAlias ? pAlias + "." : "";
   const where = `${alias}${geoColumn.propertyName}.${stMethod}('${wktGeo}') = 1`;
   if (builder.getSql().search("WHERE") === -1) builder.where(where);
   else builder.andWhere(where);
  }
  return builder;
 }

 protected async setAndWhereBBox(
  builder: SelectQueryBuilder<T>,
  bbox: Envelope,
  pAlias = this.alias
 ) {
  const geoColumn = this.getGeometryColumn();

  const pGeo = proj4Convertor.convert({
   type: "Polygon",
   coordinates: [
    [
     [bbox.xmin, bbox.ymax],
     [bbox.xmax, bbox.ymax],
     [bbox.xmax, bbox.ymin],
     [bbox.xmin, bbox.ymin],
     [bbox.xmin, bbox.ymax],
    ],
   ],
  });
  let wktGeo = geojsonToWkt(pGeo);
  if (wktGeo) {
   const alias = pAlias ? pAlias + "." : "";
   const where = `${alias}${geoColumn.propertyName}.STIntersects('${wktGeo}') = 1`;
   if (builder.getSql().search("WHERE") === -1) builder.where(where);
   else builder.andWhere(where);
  }
  return builder;
 }

 /**
  * depends on paging call `SelectQueryBuilder#getMany` or `SelectQueryBuilder#getManyAndCount`
  * helpful for overriding `TypeOrmCrudService#getMany`
  * @see getMany
  * @see SelectQueryBuilder#getMany
  * @see SelectQueryBuilder#getManyAndCount
  * @param builder
  * @param query
  * @param options
  */
 protected async doGetMany(
  builder: SelectQueryBuilder<T>,
  query: ParsedRequestParams,
  options: CrudRequestOptions
 ): Promise<GetManyDefaultResponse<T> | T[]> {
  const isPagi = this.decidePagination(query, options);
  const result = await super.doGetMany(builder, query, options);
  let data: T[] = [];
  if (isPagi) {
   data = (result as any).data;
  } else {
   data = result as T[];
  }
  // nếu dữ liệu có trường kiểu geometry
  if (
   query.fields.length === 0 ||
   query.fields.indexOf(this.getGeometryColumn().propertyName) > -1
  )
   this.convertVn2000ToOutSR(data, query.outSR);
  return result;
 }

 private convertSpatial(
  data: DeepPartial<T>[] | DeepPartial<T>,
  opts: { inSR?: number; outSR: number } | { inSR: number; outSR?: number }
 ) {
  const geoColumn = this.getGeometryColumn();

  if (geoColumn && !this.equalSrs(opts.inSR ?? opts.outSR)) {
   const convertor = new ProjGeometryConvertor({
    inSR: opts.inSR,
    outSR: opts.outSR,
   });
   if (Array.isArray(data))
    data.forEach((d, idx) => {
     const geo = d[geoColumn.propertyName];
     if (geo !== null && geo !== undefined) {
      data[idx][geoColumn.propertyName] = convertor.convert(geo);
     }
    });
   else {
    const geo = data[geoColumn.propertyName];
    if (geo !== null && geo !== undefined) {
     data[geoColumn.propertyName] = convertor.convert(geo);
    }
   }
  }
 }
 private convertInSRToVn2000(
  data: DeepPartial<T>[] | DeepPartial<T>,
  inSR: number
 ) {
  return this.convertSpatial(data, { inSR });
 }
 private convertVn2000ToOutSR(data: T[] | T, outSR: number) {
  return this.convertSpatial(data, { outSR });
 }

 async getOne(crud: CrudRequest) {
  const result = await super.getOne(crud);
  if (
   crud.parsed.fields.length === 0 ||
   crud.parsed.fields.indexOf(this.getGeometryColumn().propertyName) > -1
  )
   this.convertVn2000ToOutSR([result], crud.parsed.outSR);

  return result;
 }

 async createOne(req: CrudRequest, dto: DeepPartial<T>) {
  this.convertInSRToVn2000(dto, req.parsed.inSR);

  let entity = this.prepareEntityBeforeSave(dto, req.parsed);
  if (!entity) {
   this.throwBadRequestException(`Empty data. Nothing to save.`);
  }
  {
   if (this.repo.metadata.primaryColumns.length === 0) {
    this.throwBadRequestException("Lớp không có khóa chính");
   }
   if (this.repo.metadata.primaryColumns.length > 1) {
    this.throwBadRequestException(
     "Chưa hỗ trợ lớp có nhiều hơn một khóa chính"
    );
   }
   const primaryCol = await this.getPrimaryCol();
   if (this.isEsriClass(primaryCol)) {
    const objectId = await this.generateEsriObjectId();
    dto[primaryCol.propertyName] = objectId;
   } else {
    // trường hợp fix objectId không phải là khóa chính (có một thuộc tính khác làm khóa chính ảo)
    for (const column of this.repo.metadata.columns) {
     if (column.propertyName !== primaryCol.propertyName) {
      if (this.isEsriClass(column)) {
       try {
        dto[column.propertyName] = await this.generateEsriObjectId();
       } catch (error) {}
       break;
      }
     }
    }
   }
  }
  const primaryField = this.primaryColumn;
  const primaryKeyVal = dto[primaryField] as string | number;
  if (primaryKeyVal !== undefined) {
   entity = await this.repo.findOne({ [primaryField]: primaryKeyVal });
   if (entity) {
    throw new BadRequestException("Đã tồn tại khóa chính");
   }
  }

  const result = await super.createOne(req, dto);
  this.convertVn2000ToOutSR(result, req.parsed.outSR);
  return result;
 }
 private isEsriClass(primaryCol: ColumnMetadata) {
  return primaryCol.databaseName === "OBJECTID" && !primaryCol.isGenerated;
 }

 private async generateEsriObjectId() {
  try {
   const result: Array<{ objectId: number }> = await this.repo.query(`
      DECLARE @owner varchar(10)
      SET @owner = (
      select TOP 1 owner  from SDE_table_registry str where table_name ='${this.repo.metadata.tableName}'
      )

      declare @rowid int
      EXEC next_rowid @owner, '${this.repo.metadata.tableName}' ,@rowid output
      select objectId = @rowid`);
   if (result.length) {
    const objectId = result[0].objectId;
    //@ts-ignore
    return objectId;
   }
  } catch (error) {
   throw new BadRequestException("Không lấy được objectId từ dữ liệu GIS");
  }
 }
 private async getPrimaryCol() {
  const primaryCol = this.repo.metadata.primaryColumns[0];

  // nếu objectId không tự tạo giá trị có nghĩa objectId được tạo từ Arcmap
  // vì vậy phải sử dụng procedure của arcmap trong sql để lấy objectId
  let isGenerated = false;
  try {
   const response = await this.repo.manager
    .createQueryBuilder()
    .from("INFORMATION_SCHEMA.COLUMNS", "i")
    .select(
     `COLUMNPROPERTY(object_id(TABLE_SCHEMA+'.'+TABLE_NAME), COLUMN_NAME, 'IsIdentity')`,
     "value"
    )
    .where("i.TABLE_NAME = :tableName and i.COLUMN_NAME = :columnName", {
     tableName: this.repo.metadata.tableName,
     columnName: primaryCol.databaseName,
    })
    .getRawOne();
   isGenerated = response.value;
   if (isGenerated) {
    primaryCol.isGenerated = true;
    primaryCol.generationStrategy = "increment";
   }
  } catch (error) {
   throw new BadRequestException(
    "Không xác định được IDENTITY của PRIMARY KEY"
   );
  }
  return primaryCol;
 }

 async createMany(req: CrudRequest, dto: CreateManyDto<DeepPartial<T>>) {
  /* istanbul ignore if */
  if (typeof dto !== "object" || !Array.isArray(dto.bulk)) {
   this.throwBadRequestException(`Empty data. Nothing to save.`);
  }

  const bulk = dto.bulk
   .map((one) => this.prepareEntityBeforeSave(one, req.parsed))
   .filter((d) => d !== undefined) as DeepPartial<T>[];

  /* istanbul ignore if */
  if (!bulk.length) {
   this.throwBadRequestException(`Empty data. Nothing to save.`);
  }

  this.convertInSRToVn2000(bulk, req.parsed.inSR);
  const primaryCol = await this.getPrimaryCol();
  if (this.isEsriClass(primaryCol)) {
   const promises = [];
   bulk.forEach((d: any) => {
    const promise = this.generateEsriObjectId().then(
     (objectId) => (d[primaryCol.propertyName] = objectId)
    );
    promises.push(promise);
   });
   await Promise.all(promises);
  }

  const result = await super.createMany(req, { bulk });

  this.convertVn2000ToOutSR(result, req.parsed.outSR);
  return result;
 }

 async updateOne(req: CrudRequest, dto: DeepPartial<T>) {
  this.convertInSRToVn2000(dto, req.parsed.inSR);
  const result = await super.updateOne(req, dto);
  this.convertVn2000ToOutSR(result, req.parsed.outSR);
  return result;
 }

 getGeometryColumn(): ColumnMetadata {
  return this.repo.metadata.columns.find(
   (column) =>
    this.repo.metadata.connection.driver.spatialTypes.indexOf(column.type) !==
    -1
  );
 }

 equalSrs(srs1?: number, srs2: number = gisModuleOption.centralMeridian) {
  return srs1 == srs2;
 }
}
