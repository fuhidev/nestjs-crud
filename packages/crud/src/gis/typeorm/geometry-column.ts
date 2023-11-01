import { Column, ColumnOptions } from "typeorm";
import { geometryTransformer } from "./transformer";

export type GeometryColumnOptions = Omit<ColumnOptions, "transformer">;

export function GeometryColumn(
 options?: GeometryColumnOptions
): PropertyDecorator {
 return Column({
  ...options,
  type: "geometry",
  transformer: geometryTransformer,
 });
}
