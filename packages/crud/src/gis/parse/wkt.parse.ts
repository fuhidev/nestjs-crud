import { Terraformer, Primitive } from "terraformer";

interface PointArray {
  data: Point[];
  type: string;
  addPoint(point: Point): PointArray;
  toJSON(): Point[];
}

interface Ring {
  data: PointArray;
  type: string;
  toJSON(): number[];
}

interface RingList {
  data: Ring[];
  type: string;
  addRing(ring: Ring): RingList;
  toJSON(): number[][];
}

interface PolygonList {
  data: Polygon[];
  type: string;
  addPolygon(polygon: Polygon): PolygonList;
  toJSON(): number[][][];
}

interface WKT {
  parser: any;
  Parser: any;
  parse(element: any): Primitive;
  convert(primitive: Primitive): string;
}

(function (root: any, factory: any) {

  // Node.
  if(typeof module === 'object' && typeof module.exports === 'object') {
    exports = module.exports = factory(require("terraformer"));
  } else if(typeof navigator === "object") {
    // Browser Global.
    if (!root.Terraformer){
      throw new Error("Terraformer.WKT requires the core Terraformer library. http://github.com/esri/terraformer")
    }
    root.Terraformer.WKT = factory(root.Terraformer);
  }

}(this, function(Terraformer: any): WKT {
  var exports: WKT = { };

  "SOURCE";

  function PointArray (point: Point): PointArray {
    this.data = [ point ];
    this.type = 'PointArray';
  }

  PointArray.prototype.addPoint = function (point: Point): PointArray {
    if (point.type === 'PointArray') {
      this.data = this.data.concat(point.data);
    } else {
      this.data.push(point);
    }

    return this;
  };

  PointArray.prototype.toJSON = function (): Point[] {
    return this.data;
  };

  function Ring (point: Point): Ring {
    this.data = point;
    this.type = 'Ring';
  }

  Ring.prototype.toJSON = function (): number[] {
    var data = [ ];

    for (var i = 0; i < this.data.data.length; i++) {
      data.push(this.data.data[i]);
    }

    return data;
  };

  function RingList (ring: Ring): RingList {
    this.data = [ ring ];
    this.type = 'RingList';
  }

  RingList.prototype.addRing = function (ring: Ring): RingList {
    this.data.push(ring);

    return this;
  };

  RingList.prototype.toJSON = function (): number[][] {
    var data = [ ];

    for (var i = 0; i < this.data.length; i++) {
      data.push(this.data[i].toJSON());
    }

    if (data.length === 1) {
      return data;
    } else {
      return data;
    }
  };

  function PolygonList (polygon: Polygon): PolygonList {
    this.data = [ polygon ];
    this.type = 'PolygonList';
  }

  PolygonList.prototype.addPolygon = function (polygon: Polygon): PolygonList {
    this.data.push(polygon);

    return this;
  };

  PolygonList.prototype.toJSON = function (): number[][][] {
    var data = [ ];

    for (var i = 0; i < this.data.length; i++) {
      data = data.concat( [ this.data[i].toJSON() ] );
    }

    return data;
  };

  function _parse (): Primitive {
    return parser.parse.apply(parser, arguments);
  }

  function parse (element: any): Primitive {
    var res: Primitive, primitive: any;

    try {
      res = parser.parse(element);
    } catch (err) {
      throw Error("Unable to parse: " + err);
    }

    return Terraformer.Primitive(res);
  }

  function arrayToRing (arr: number[][]): string {
    var parts = [ ], ret = '';

    for (var i = 0; i < arr.length; i++) {
      parts.push(arr[i].join(' '));
    }

    ret += '(' + parts.join(', ') + ')';

    return ret;

  }

  function pointToWKTPoint (primitive: Primitive): string {
    var ret = 'POINT ';

    if (primitive.coordinates === undefined || primitive.coordinates.length === 0) {
      ret += 'EMPTY';

      return ret;
    } else if (primitive.coordinates.length === 3) {
      // 3d or time? default to 3d
      if (primitive.properties && primitive.properties.m === true) {
        ret += 'M ';
      } else {
        ret += 'Z ';
      }
    } else if (primitive.coordinates.length === 4) {
      // 3d and time
      ret += 'ZM ';
    }

    // include coordinates
    ret += '(' + primitive.coordinates.join(' ') + ')';

    return ret;
  }

  function lineStringToWKTLineString (primitive: Primitive): string {
    var ret = 'LINESTRING ';

    if (primitive.coordinates === undefined || primitive.coordinates.length === 0 || primitive.coordinates[0].length === 0) {
      ret += 'EMPTY';

      return ret;
    } else if (primitive.coordinates[0].length === 3) {
      if (primitive.properties && primitive.properties.m === true) {
        ret += 'M ';
      } else {
        ret += 'Z ';
      }
    } else if (primitive.coordinates[0].length === 4) {
      ret += 'ZM ';
    }

    ret += arrayToRing(primitive.coordinates);

    return ret;
  }

  function polygonToWKTPolygon (primitive: Primitive): string {
    var ret = 'POLYGON ';

    if (primitive.coordinates === undefined || primitive.coordinates.length === 0 || primitive.coordinates[0].length === 0) {
      ret += 'EMPTY';

      return ret;
    } else if (primitive.coordinates[0][0].length === 3) {
      if (primitive.properties && primitive.properties.m === true) {
        ret += 'M ';
      } else {
        ret += 'Z ';
      }
    } else if (primitive.coordinates[0][0].length === 4) {
      ret += 'ZM ';
    }

    ret += '(';
    var parts = [ ];
    for (var i = 0; i < primitive.coordinates.length; i++) {
      parts.push(arrayToRing(primitive.coordinates[i]));
    }

    ret += parts.join(', ');
    ret += ')';

    return ret;
  }

  function multiPointToWKTMultiPoint (primitive: Primitive): string {
    var ret = 'MULTIPOINT ';

    if (primitive.coordinates === undefined || primitive.coordinates.length === 0 || primitive.coordinates[0].length === 0) {
      ret += 'EMPTY';

      return ret;
    } else if (primitive.coordinates[0].length === 3) {
      if (primitive.properties && primitive.properties.m === true) {
        ret += 'M ';
      } else {
        ret += 'Z ';
      }
    } else if (primitive.coordinates[0].length === 4) {
      ret += 'ZM ';
    }

    ret += arrayToRing(primitive.coordinates);

    return ret;
  }

  function multiLineStringToWKTMultiLineString (primitive: Primitive): string {
    var ret = 'MULTILINESTRING ';

    if (primitive.coordinates === undefined || primitive.coordinates.length === 0 || primitive.coordinates[0].length === 0) {
      ret += 'EMPTY';

      return ret;
    } else if (primitive.coordinates[0][0].length === 3) {
      if (primitive.properties && primitive.properties.m === true) {
        ret += 'M ';
      } else {
        ret += 'Z ';
      }
    } else if (primitive.coordinates[0][0].length === 4) {
      ret += 'ZM ';
    }

    ret += '(';
    var parts = [ ];
    for (var i = 0; i < primitive.coordinates.length; i++) {
      parts.push(arrayToRing(primitive.coordinates[i]));
    }

    ret += parts.join(', ');
    ret += ')';

    return ret;
  }

  function multiPolygonToWKTMultiPolygon (primitive: Primitive): string {
    var ret = 'MULTIPOLYGON ';

    if (primitive.coordinates === undefined || primitive.coordinates.length === 0 || primitive.coordinates[0].length === 0 || primitive.coordinates[0][0].length === 0) {
      ret += 'EMPTY';

      return ret;
    } else if (primitive.coordinates[0][0][0].length === 3) {
      if (primitive.properties && primitive.properties.m === true) {
        ret += 'M ';
      } else {
        ret += 'Z ';
      }
    } else if (primitive.coordinates[0][0][0].length === 4) {
      ret += 'ZM ';
    }

    ret += '(';
    var inner = [ ];
    for (var c = 0; c < primitive.coordinates.length; c++) {
      var it = '(';
      var parts = [ ];
      for (var i = 0; i < primitive.coordinates[c].length; i++) {
        parts.push(arrayToRing(primitive.coordinates[c][i]));
      }

      it += parts.join(', ');
      it += ')';

      inner.push(it);
    }

    ret += inner.join(', ');
    ret += ')';

    return ret;
  }

  function convert (primitive: Primitive): string {
    switch (primitive.type) {
      case 'Point':
        return pointToWKTPoint(primitive);
      case 'LineString':
        return lineStringToWKTLineString(primitive);
      case 'Polygon':
        return polygonToWKTPolygon(primitive);
      case 'MultiPoint':
        return multiPointToWKTMultiPoint(primitive);
      case 'MultiLineString':
        return multiLineStringToWKTMultiLineString(primitive);
      case 'MultiPolygon':
        return multiPolygonToWKTMultiPolygon(primitive);
      case 'GeometryCollection':
        var ret = 'GEOMETRYCOLLECTION';
        var parts = [ ];
        for (i = 0; i < primitive.geometries.length; i++){
          parts.push(convert(primitive.geometries[i]));
        }
        return ret + '(' + parts.join(', ') + ')';
      default:
        throw Error ("Unknown Type: " + primitive.type);
    }
  }

  exports.parser  = parser;
  exports.Parser  = parser.Parser;
  exports.parse   = parse;
  exports.convert = convert;

  return exports;
}));