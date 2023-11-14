import { GeoJSON } from "nest-crud-client";
import { Geometry as wkxGeometry } from "wkx";
export const wktToGeoJson = (wkt: string) => {
 return wkxGeometry.parse(wkt).toGeoJSON();
};

export const geojsonToWkt = (geojson: GeoJSON.Geometry) => {
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
