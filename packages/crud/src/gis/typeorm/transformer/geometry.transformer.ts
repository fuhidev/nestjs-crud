import { GeoJSON } from "nest-crud-client";
import { ValueTransformer } from "typeorm";
import { geojsonToWkt, wktToGeoJson } from "../../convertor/wkt-convertor";

export const geometryTransformer: ValueTransformer = {
 from: (dbValue: string) => {
  if (dbValue) {
   const geometry = wktToGeoJson(dbValue);
   return geometry;
  }
  return null;
 },
 to: (shape: GeoJSON.Geometry) => shape && geojsonToWkt(shape),
};
