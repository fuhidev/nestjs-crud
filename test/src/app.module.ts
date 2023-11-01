import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppsModule } from './apps/apps.module';
import { defaultDataSource } from './typeorm/datasource/default.datasource';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...defaultDataSource,
    }),
    AppsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
