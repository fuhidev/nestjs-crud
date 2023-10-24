interface Options {
  clone?: boolean;
  isMergeableObject?: (value: any) => boolean;
  arrayMerge?: (target: any[], source: any[], options: Options) => any[];
  customMerge?: (key: string) => ((target: any, source: any, options: Options) => any) | undefined;
}

function emptyTarget(val: any): any {
  return Array.isArray(val) ? [] : {};
}

function cloneUnlessOtherwiseSpecified(value: any, options: Options): any {
  return options.clone !== false && options.isMergeableObject(value)
    ? deepmerge(emptyTarget(value), value, options)
    : value;
}

function defaultArrayMerge(target: any[], source: any[], options: Options): any[] {
  return target.concat(source).map((element) => {
    return cloneUnlessOtherwiseSpecified(element, options);
  });
}

function getMergeFunction(key: string, options: Options): (target: any, source: any, options: Options) => any {
  if (!options.customMerge) {
    return deepmerge;
  }
  const customMerge = options.customMerge(key);
  return typeof customMerge === 'function' ? customMerge : deepmerge;
}

function getEnumerableOwnPropertySymbols(target: object): symbol[] {
  return Object.getOwnPropertySymbols
    ? Object.getOwnPropertySymbols(target).filter((symbol) => {
        return target.propertyIsEnumerable(symbol);
      })
    : [];
}

function getKeys(target: object): string[] {
  return Object.keys(target).concat(getEnumerableOwnPropertySymbols(target).map((symbol) => symbol.toString()));
}

function mergeObject(target: object, source: object, options: Options): object {
  const destination: Record<string, any> = {};
  if (options.isMergeableObject(target)) {
    getKeys(target).forEach((key) => {
      destination[key] = cloneUnlessOtherwiseSpecified(target[key], options);
    });
  }
  getKeys(source).forEach((key) => {
    if (!options.isMergeableObject(source[key]) || !target[key]) {
      destination[key] = cloneUnlessOtherwiseSpecified(source[key], options);
    } else {
      destination[key] = getMergeFunction(key, options)(target[key], source[key], options);
    }
  });
  return destination;
}

function deepmerge(target: any, source: any, options: Options): any {
  options = options || {};
  options.arrayMerge = options.arrayMerge || defaultArrayMerge;
  options.isMergeableObject = options.isMergeableObject || ((value: any) => isObject(value));

  const sourceIsArray = Array.isArray(source);
  const targetIsArray = Array.isArray(target);
  const sourceAndTargetTypesMatch = sourceIsArray === targetIsArray;

  if (!sourceAndTargetTypesMatch) {
    return cloneUnlessOtherwiseSpecified(source, options);
  } else if (sourceIsArray) {
    return options.arrayMerge(target, source, options);
  } else {
    return mergeObject(target, source, options);
  }
}

deepmerge.all = function deepmergeAll(array: any[], options: Options): any {
  if (!Array.isArray(array)) {
    throw new Error('first argument should be an array');
  }

  return array.reduce((prev, next) => {
    return deepmerge(prev, next, options);
  }, {});
};

function isObject(value: any): boolean {
  return value !== null && typeof value === 'object';
}

export default deepmerge;
