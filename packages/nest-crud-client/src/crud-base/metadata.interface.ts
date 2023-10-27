import { SpatialReference } from "../crud-request";

export interface Relation {
 displayColumn: string;
 primaryColumn: string;
 type: "one-to-one" | "many-to-one" | "one-to-many";
 name: string;
 url: string;
}

export interface Renderer {
 type: string;
 [key: string]: any;
}

export interface Column {
 name: string;
 alias: string;
 type: string;
 isNullable: boolean;
 isPrimary: boolean;
 isCreateDate: boolean;
 isGenerated: boolean;
 readonly: boolean;
 relation?: Relation;
 isDisplayColumn: boolean;
}
export interface Metadata {
 displayColumn: string;
 primaryColumn: string;
 columns: Column[];
 tableType: string;
 geometryType: GeometryType;
 renderer: Renderer;
 [key: string]: any;
 srs?: SpatialReference | number;
}

export enum GeometryType {
 Polygon = "Polygon",
 Polyline = "Polyline",
 Point = "Point",
}
