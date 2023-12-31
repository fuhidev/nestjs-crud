export const objKeys = (val: any): string[] => Object.keys(val);
export const getOwnPropNames = (val: any): string[] =>
 Object.getOwnPropertyNames(val);

export type KeyOfs<T> = Array<keyof T>;
