export interface SpatialReference {
  wkid?: number;
  wkt?: string;
}

export interface Envelope {
  xmin: number;
  xmax: number;
  ymin: number;
  ymax: number;
}
