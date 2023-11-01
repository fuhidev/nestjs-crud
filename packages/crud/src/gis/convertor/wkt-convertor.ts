import { GeoJSON } from 'nest-crud-client';
import * as wkx from 'wkx';
export const wktToGeoJson = (wkt: string) => {
  return wkx.Geometry.parse(wkt);
};

export const geojsonToWkt = (geojson: GeoJSON.Geometry) => {
  return wkx.Geometry.parseGeoJSON(geojson).toWkt();
};

export const wktConvertor = {
  /**
   * geojson to wkt
   */
  parse: geojsonToWkt,
  /**
   *  wkt to geojson
   */
  convert: wktToGeoJson,
};
