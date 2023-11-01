import { Module } from '@nestjs/common';
import { GeometryModule } from '../../../packages/crud/dist';
import { AgencyModule } from './agency/agency.module';
import { DistrictModule } from './district/district.module';
import { LegalModule } from './legal/legal.module';
import { PostModule } from './post/post.module';
import { ProductModule } from './product/product.module';

@Module({
  imports: [
    ProductModule,
    AgencyModule,
    LegalModule,
    PostModule,
    DistrictModule,
    GeometryModule.forRoot({ centralMeridian: 107.75 }),
  ],
})
export class AppsModule {}
