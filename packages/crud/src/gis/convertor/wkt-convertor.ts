import { GeoJSON } from "nest-crud-client";
import { Geometry as wkxGeometry } from "wkx";
export const wktToGeoJson = (wkt: string): GeoJSON.Geometry => {
 return wkxGeometry.parse(wkt).toGeoJSON() as GeoJSON.Geometry;
};

export const geojsonToWkt = (geojson: GeoJSON.Geometry): string => {
 return wkxGeometry.parseGeoJSON(geojson).toWkt();
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
