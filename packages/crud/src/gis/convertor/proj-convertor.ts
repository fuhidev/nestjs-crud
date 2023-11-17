import { GeoJSON } from "nest-crud-client";
import proj4Lib from "proj4";
import { gisModuleOption } from "../token";

// Định nghĩa chuỗi mã hóa cho WGS 1984 và VN2000
const wgs1984 = "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs";
export type ProjSupportType =
 | GeoJSON.Polygon
 | GeoJSON.Point
 | GeoJSON.LineString
 | GeoJSON.MultiPolygon
 | GeoJSON.MultiLineString;
export type SimpleCovertorParam = { longitude: number; latitude: number };
export type ProjConvertorFunc = (p: SimpleCovertorParam) => SimpleCovertorParam;
class ProjSimpleConvertor {
 static getProjection(centralMeridian?: number) {
  centralMeridian = centralMeridian ?? gisModuleOption.centralMeridian;
  if (centralMeridian === 4326) {
   return wgs1984;
  }
  const vn2000 = `+proj=tmerc +lat_0=0 +lon_0=${centralMeridian} +k=0.9999 +x_0=500000 +y_0=0 +ellps=WGS84 +towgs84=-191.90441429,-39.30318279,-111.45032835,0.00928836,-0.01975479,0.00427372,0.252906278 +units=m +no_defs`;
  return vn2000;
 }
 protected inSR?: number;
 protected outSR?: number;
 private _fromProjection: string;
 private get fromProjection() {
  if (!this._fromProjection) {
   this._fromProjection = ProjSimpleConvertor.getProjection(this.inSR);
  }
  return this._fromProjection;
 }
 private _toProjection: string;
 private get toProjection() {
  if (!this._toProjection)
   this._toProjection = ProjSimpleConvertor.getProjection(this.outSR);
  return this._toProjection;
 }

 protected _proj4: proj4.Converter;
 get convertor() {
  if (!this._proj4) {
   this._proj4 = proj4Lib(this.fromProjection, this.toProjection);
  }
  return this._proj4;
 }

 constructor(
  p: {
   inSR?: number;
   outSR?: number;
  } = {}
 ) {
  this.inSR = p.inSR;
  this.outSR = p.outSR;
 }
 /**
  * WGS84 to Vn2000
  * @param p
  * @returns
  */
 convert = (p: SimpleCovertorParam) => {
  if (this.inSR === this.outSR) return p;
  const resp = this.convertor.forward([p.longitude, p.latitude]);
  return {
   longitude: resp[0],
   latitude: resp[1],
  };
 };

 /**
  * Vn2000 to Wgs84
  * @param p
  * @returns
  */
 reverse = (p: SimpleCovertorParam) => {
  if (this.inSR === this.outSR) return p;
  const resp = this.convertor.inverse([p.longitude, p.latitude]);
  return {
   longitude: resp[0],
   latitude: resp[1],
  };
 };
}
export class ProjGeometryConvertor {
 protected convertor = new ProjSimpleConvertor();
 constructor(
  p: {
   inSR?: number;
   outSR?: number;
  } = {}
 ) {
  if (p.inSR || p.outSR)
   this.convertor = new ProjSimpleConvertor({ inSR: p.inSR, outSR: p.outSR });
 }
 protected _convert = <T extends ProjSupportType>(
  geom: T,
  opts: { convertor: ProjConvertorFunc }
 ): T => {
  const __convert = <T extends ProjSupportType>(geom: T) => {
   return this._convert(geom, opts);
  };
  // Chuyển đổi một điểm từ WGS 1984 sang VN2000
  if (geom.type === "Point") {
   const point = geom as GeoJSON.Point;
   const resp = opts.convertor({
    longitude: point.coordinates[0],
    latitude: point.coordinates[1],
   });
   return { type: "Point", coordinates: [resp.longitude, resp.latitude] } as T;
  } else if (geom.type === "LineString") {
   const polyline = geom as GeoJSON.LineString;
   const coordinates = polyline.coordinates.map((coord) => {
    const resp = opts.convertor({ longitude: coord[0], latitude: coord[1] });
    return [resp.longitude, resp.latitude];
   });
   return { coordinates, type: "LineString" } as T;
  } else if (geom.type === "Polygon") {
   const polygon = geom as GeoJSON.Polygon;
   const coordinates = polygon.coordinates.map((coord1) => {
    const resp = __convert({
     type: "LineString",
     coordinates: coord1,
    } as GeoJSON.LineString) as GeoJSON.LineString;
    return resp.coordinates;
   });
   return { type: "Polygon", coordinates } as T;
  } else if (geom.type === "MultiLineString") {
   const geometry = geom as GeoJSON.MultiLineString;
   const coordinates = geometry.coordinates.map((coord) => {
    const resp = __convert({ type: "LineString", coordinates: coord });
    return resp.coordinates;
   });
   return { type: "MultiLineString", coordinates } as T;
  } else if (geom.type === "MultiPolygon") {
   const geometry = geom as GeoJSON.MultiPolygon;
   const coordinates = geometry.coordinates.map((coord) => {
    const resp = __convert({ type: "Polygon", coordinates: coord });
    return resp.coordinates;
   });
   return { type: "MultiPolygon", coordinates } as T;
  } else {
   throw new Error("Không hỗ trợ");
  }
 };

 convert = <T extends ProjSupportType>(geom: T): T => {
  return this._convert(geom, { convertor: this.convertor.convert });
 };

 reverse = <T extends ProjSupportType>(geom: T): T => {
  return this._convert(geom, { convertor: this.convertor.reverse });
 };
}

export const vn2000ToWgs84Convertor = new ProjGeometryConvertor({
 outSR: 4326,
});
