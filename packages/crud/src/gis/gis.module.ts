import { DynamicModule, Module } from '@nestjs/common';
import { PlacesModule } from './places/places.module';
import { ProjectGeometryModule } from './project-geometry/project-geometry.module';
import { GeometryModuleOptions, setOptions } from './token';

@Module({
  imports: [ProjectGeometryModule, PlacesModule],
  providers: [],
  exports: [],
  controllers: [],
})
export class GeometryModule {
  static forRoot(options: GeometryModuleOptions): DynamicModule {
    setOptions({
      ...options,
    } as GeometryModuleOptions);
    return {
      module: GeometryModule,
    };
  }
}
