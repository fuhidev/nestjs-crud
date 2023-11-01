export interface GeometryModuleOptions {
  centralMeridian: number;
}

export let gisModuleOption: GeometryModuleOptions;

export function setOptions(options: GeometryModuleOptions) {
  gisModuleOption = options;
}
