var E = Object.defineProperty;
var w = (e, t, s) => t in e ? E(e, t, { enumerable: !0, configurable: !0, writable: !0, value: s }) : e[t] = s;
var h = (e, t, s) => (w(e, typeof t != "symbol" ? t + "" : t, s), s);
import g from "axios";
class c extends Error {
  constructor(t) {
    super(t);
  }
}
const q = "||", p = ",", L = (e) => Object.keys(e), V = (e) => Object.getOwnPropertyNames(e), b = (e) => typeof e > "u", P = (e) => e === null, u = (e) => b(e) || P(e), T = (e) => typeof e == "string", j = (e) => e.length > 0, d = (e) => T(e) && j(e), m = (e) => Array.isArray(e) && j(e), F = (e) => m(e) && e.every((t) => d(t)), l = (e) => typeof e == "object" && !P(e), X = (e) => l(e) && j(L(e)), U = (e) => typeof e == "number" && !Number.isNaN(e) && Number.isFinite(e), O = (e, t) => e === t, Z = (e) => e === !1, z = (e) => e === !0, Y = (e, t = []) => t.some((s) => O(e, s)), B = (e) => typeof e == "boolean", tt = (e) => /^[+-]?([0-9]*[.])?[0-9]+$/.test(e), et = (e) => d(e) && /^\d{4}-[01]\d-[0-3]\d(?:T[0-2]\d:[0-5]\d:[0-5]\d(?:\.\d+)?(?:Z|[-+][0-2]\d(?::?[0-5]\d)?)?)?$/g.test(
  e
), G = (e) => e instanceof Date, $ = (e) => d(e) || U(e) || B(e) || G(e), I = (e) => m(e) ? e.every((t) => $(t)) : $(e), st = (e) => typeof e == "function";
var _ = /* @__PURE__ */ ((e) => (e.Intersects = "intersects", e.Within = "within", e.Touches = "touches", e))(_ || {}), N = /* @__PURE__ */ ((e) => (e.EQUALS = "$eq", e.NOT_EQUALS = "$ne", e.GREATER_THAN = "$gt", e.LOWER_THAN = "$lt", e.GREATER_THAN_EQUALS = "$gte", e.LOWER_THAN_EQUALS = "$lte", e.STARTS = "$starts", e.ENDS = "$ends", e.CONTAINS = "$cont", e.EXCLUDES = "$excl", e.IN = "$in", e.NOT_IN = "$notin", e.IS_NULL = "$isnull", e.NOT_NULL = "$notnull", e.BETWEEN = "$between", e.EQUALS_LOW = "$eqL", e.NOT_EQUALS_LOW = "$neL", e.STARTS_LOW = "$startsL", e.ENDS_LOW = "$endsL", e.CONTAINS_LOW = "$contL", e.EXCLUDES_LOW = "$exclL", e.IN_LOW = "$inL", e.NOT_IN_LOW = "$notinL", e))(N || {});
const x = [
  "eq",
  "ne",
  "gt",
  "lt",
  "gte",
  "lte",
  "starts",
  "ends",
  "cont",
  "excl",
  "in",
  "notin",
  "isnull",
  "notnull",
  "between"
], A = Object.assign(
  x,
  //@ts-ignore
  L(N).map((e) => N[e])
), S = ["ASC", "DESC"], Q = A.join(), J = S.join();
function R(e) {
  if (!F(e))
    throw new c("Invalid fields. Array of strings expected");
}
function W(e, t) {
  if (!l(e) || !d(e.field))
    throw new c(
      `Invalid field type in ${t} condition. String expected`
    );
  D(e.operator);
}
function D(e) {
  if (!A.includes(e))
    throw new c(
      `Invalid comparison operator. ${Q} expected`
    );
}
function v(e) {
  if (!l(e) || !d(e.field))
    throw new c("Invalid join field. String expected");
  if (!b(e.select) && !F(e.select))
    throw new c(
      "Invalid join select. Array of strings expected"
    );
}
function M(e) {
  if (!l(e) || !d(e.field))
    throw new c("Invalid sort field. String expected");
  if (!O(e.order, S[0]) && !O(e.order, S[1]))
    throw new c(
      `Invalid sort order. ${J} expected`
    );
}
function k(e, t) {
  if (!U(e))
    throw new c(`Invalid ${t}. Number expected`);
}
function it(e, t) {
  if (!l(e))
    throw new c(
      `Invalid param ${t}. Invalid crud options`
    );
  const s = e[t];
  if (!(s && s.disabled) && (!l(s) || u(s.field) || u(s.type)))
    throw new c("Invalid param option in Crud");
}
function rt(e, t) {
  const s = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(e) && !s.test(e))
    throw new c(
      `Invalid param ${t}. UUID string expected`
    );
}
const o = class o {
  constructor() {
    h(this, "paramNames", {});
    h(this, "queryObject", {});
    h(this, "filterGeo");
    h(this, "_fields");
    this.setParamNames();
  }
  get fields() {
    return this._fields;
  }
  static setOptions(t) {
    o._options = {
      ...o._options,
      ...t,
      paramNamesMap: {
        ...o._options.paramNamesMap,
        ...t.paramNamesMap ? t.paramNamesMap : {}
      }
    };
  }
  static getOptions() {
    return o._options;
  }
  static create(t) {
    const s = new o();
    return l(t) ? s.createFromParams(t) : s;
  }
  get options() {
    return o._options;
  }
  setParamNames() {
    Object.keys(o._options.paramNamesMap).forEach((t) => {
      const s = o._options.paramNamesMap[t];
      this.paramNames[t] = T(s) ? s : s[0];
    });
  }
  query() {
    var s;
    if (this.queryObject[this.paramNames.search] && (this.queryObject[this.paramNames.filter] = void 0, this.queryObject[this.paramNames.or] = void 0), !this.queryObject.fields || ((s = this.queryObject.fields) == null ? void 0 : s.length) === 0)
      throw new Error("required fields");
    let t = "";
    for (const i in this.queryObject)
      this.queryObject.hasOwnProperty(i) && (t !== "" && (t += "&"), m(this.queryObject[i]) ? t += this.queryObject[i].map((r) => `${i}=${r}`).join("&") : t += `${i}=${this.queryObject[i]}`);
    return t;
  }
  select(t) {
    return m(t) && (R(t), this._fields = t, this.queryObject[this.paramNames.fields] = t.join(p)), this;
  }
  search(t) {
    return !u(t) && l(t) && (this.queryObject[this.paramNames.search] = JSON.stringify(t)), this;
  }
  setFilter(t) {
    return this.setCondition(t, "filter"), this;
  }
  setOr(t) {
    return this.setCondition(t, "or"), this;
  }
  setJoin(t) {
    if (!u(t)) {
      const s = this.checkQueryObjectParam("join", []), i = [];
      Array.isArray(t) ? t.forEach((r) => i.push(...this.addJoin(r))) : i.push(...this.addJoin(t)), this.queryObject[s] = [...this.queryObject[s], ...i];
    }
    return this;
  }
  sortBy(t) {
    if (!u(t)) {
      const s = this.checkQueryObjectParam("sort", []);
      this.queryObject[s] = [
        ...this.queryObject[s],
        ...Array.isArray(t) ? t.map((i) => this.addSortBy(i)) : [this.addSortBy(t)]
      ];
    }
    return this;
  }
  setLimit(t) {
    return this.setNumeric(t, "limit"), this;
  }
  setOutSR(t) {
    return t && (this.queryObject.outSR = JSON.stringify(t)), this;
  }
  setInSR(t) {
    return t && (this.queryObject.inSR = JSON.stringify(t)), this;
  }
  setBBox(t) {
    return t && (this.queryObject.bbox = JSON.stringify(t)), this;
  }
  setFilterGeo(t) {
    return this.filterGeo = t, this;
  }
  setFormatGeo(t) {
    return t && (this.queryObject.fGeo = t), this;
  }
  setOffset(t) {
    return this.setNumeric(t, "offset"), this;
  }
  setPage(t) {
    return this.setNumeric(t, "page"), this;
  }
  resetCache() {
    return this.setNumeric(0, "cache"), this;
  }
  cond(t, s = "search") {
    W(t, s);
    const i = q;
    let r = "", n = t.value;
    return I(n) && (typeof n == "number" ? r = n.toString() : typeof n == "string" ? n.startsWith('"') && n.endsWith('"') ? r = n : r = `"${n}"` : Array.isArray(n) && (r = n.map(
      (y) => typeof y == "string" ? n.startsWith('"') && n.endsWith('"') ? y : `"${y}"` : y
    ).join(","))), `${t.field}${i}${t.operator}${i}${r}`;
  }
  addJoin(t, s) {
    const i = [];
    v(t);
    const r = q, n = p, a = s ? t.field + "." + s : t.field + "";
    return i.push(
      a + (m(t.select) ? r + t.select.join(n) : "")
    ), i;
  }
  addSortBy(t) {
    M(t);
    const s = p;
    return t.field + s + t.order;
  }
  createFromParams(t) {
    return this.select(t.fields), this.search(t.search), this.setFilter(t.filter), this.setOr(t.or), this.setJoin(t.join), this.setLimit(t.limit), this.setOffset(t.offset), this.setPage(t.page), this.sortBy(t.sort), this.setFormatGeo(t.fGeo), this.setFilterGeo(t.filterGeo), this.setBBox(t.bbox), this.setOutSR(t.outSR), this.setInSR(t.inSR), t.resetCache && this.resetCache(), this;
  }
  checkQueryObjectParam(t, s) {
    const i = this.paramNames[t];
    return u(this.queryObject[i]) && !b(s) && (this.queryObject[i] = s), i;
  }
  setCondition(t, s) {
    if (!u(t)) {
      const i = this.checkQueryObjectParam(s, []);
      this.queryObject[i] = [
        ...this.queryObject[i],
        ...Array.isArray(t) ? t.map((r) => this.cond(r, s)) : [this.cond(t, s)]
      ];
    }
  }
  setNumeric(t, s) {
    u(t) || (k(t, s), this.queryObject[this.paramNames[s]] = t);
  }
};
h(o, "_options", {
  paramNamesMap: {
    fields: ["fields", "select"],
    search: "s",
    filter: "filter",
    or: "or",
    join: "join",
    sort: "sort",
    limit: ["limit", "per_page"],
    offset: "offset",
    page: "page",
    cache: "cache"
  }
});
let f = o;
class nt {
  constructor(t) {
    h(this, "entity");
    h(this, "apiUrl");
    h(this, "primaryKey");
    this.entity = t.entity, this.apiUrl = t.apiUrl, this.primaryKey = t.primaryKey;
  }
  request(t) {
    return g.request(t).then((s) => s.data);
  }
  //  static createByUrl(url: string) {
  //   const lastIdx = url.lastIndexOf("/");
  //   const apiUrl = url.substring(0, lastIdx);
  //   const entity = url.substr(lastIdx + 1);
  //   //@ts-ignore
  //   return new (class extends CrudBaseService {})({ apiUrl, entity });
  //  }
  getPagination(t, s, i) {
    i = i || {};
    let { builder: r, signal: n } = i;
    r ? r instanceof f || (r = f.create(r)) : r = f.create(), r.setLimit(t), r.setPage(s);
    const a = this.getBodyFilterGeo(r);
    return a ? this.request({
      signal: n,
      url: this.getBaseUrl() + "/query",
      method: "POST",
      data: JSON.stringify(a),
      params: this.getParamsFromQuery(r),
      headers: {
        "Content-Type": "application/json"
      }
    }) : this.request({
      url: this.getBaseUrl(),
      method: "GET",
      params: this.getParamsFromQuery(r)
    });
  }
  getMany(t) {
    t = t || {};
    let { builder: s, signal: i } = t;
    const r = this.getBodyFilterGeo(s);
    return r ? this.request({
      url: this.getBaseUrl() + "/query",
      data: JSON.stringify(r),
      method: "POST",
      signal: i,
      params: this.getParamsFromQuery(s),
      headers: {
        "Content-Type": "application/json"
      }
    }) : this.request({
      url: this.getBaseUrl(),
      method: "GET",
      params: this.getParamsFromQuery(s)
    });
  }
  getCount(t) {
    return this.request({
      url: this.getBaseUrl() + "/count",
      params: this.getParamsFromQuery(t)
    });
  }
  getOne(t, s) {
    s = s || {};
    let { builder: i, signal: r } = s;
    const n = this.getOneUrl(t), a = this.getBodyFilterGeo(i);
    return a ? this.request({
      url: this.getBaseUrl() + `/query/${t}`,
      data: JSON.stringify(a),
      method: "POST",
      signal: r,
      params: this.getParamsFromQuery(i),
      headers: {
        "Content-Type": "application/json"
      }
    }) : this.request({
      url: n,
      params: this.getParamsFromQuery(i)
    });
  }
  getBodyFilterGeo(t) {
    let s;
    return typeof t == "object" && (t.filterGeo, s = t.filterGeo), s ? { filterGeo: s } : null;
  }
  create(t, s) {
    s = s || {};
    let { builder: i, signal: r } = s;
    return this.getBodyFilterGeo(i), this.request({
      url: this.getBaseUrl(),
      data: JSON.stringify({ ...t, ...this.getBodyFilterGeo(i) }),
      method: "POST",
      signal: r,
      params: this.getParamsFromQuery(i),
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
  createMany(t, s) {
    s = s || {};
    let { builder: i, signal: r } = s;
    return this.request({
      url: this.getBaseUrl() + "/bulk",
      data: JSON.stringify({ bulk: t, ...this.getBodyFilterGeo(i) }),
      params: this.getParamsFromQuery(i),
      method: "POST",
      signal: r,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
  put(t, s, i) {
    i = i || {};
    let { builder: r, signal: n } = i;
    const a = this.getOneUrl(t);
    return g.put(
      a,
      JSON.stringify({ ...s, ...this.getBodyFilterGeo(r) }),
      {
        params: this.getParamsFromQuery(r),
        signal: n,
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        }
      }
    ).then((y) => y.data);
  }
  patch(t, s, i) {
    i = i || {};
    let { builder: r, signal: n } = i;
    const a = this.getOneUrl(t);
    return this.request({
      url: a,
      data: JSON.stringify({ ...s, ...this.getBodyFilterGeo(r) }),
      method: "PATCH",
      params: this.getParamsFromQuery(r),
      signal: n,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
  executeSql(t) {
    return g.post(
      this.getBaseUrl() + "/execute",
      JSON.stringify(t),
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }
  delete(t) {
    return this.request({
      method: "DELETE",
      url: this.getBaseUrl() + "/" + t
    });
  }
  getParamsFromQuery(t) {
    return t instanceof f || (t = f.create(t)), this.getQuery(t);
  }
  /**
   * Get request link
   */
  getBaseUrl() {
    return `${this.apiUrl}/${this.entity}`;
  }
  getOneUrl(t) {
    return `${this.getBaseUrl()}/${t}`;
  }
  getQuery(t) {
    return t ? t.queryObject : {};
  }
}
var C = /* @__PURE__ */ ((e) => (e.Polygon = "Polygon", e.Polyline = "Polyline", e.Point = "Point", e))(C || {});
export {
  N as CondOperator,
  nt as CrudBaseService,
  p as DELIMSTR_CHAR,
  q as DELIM_CHAR,
  C as GeometryType,
  f as RequestQueryBuilder,
  c as RequestQueryException,
  _ as SpatialMethodEnum,
  A as comparisonOperatorsList,
  x as deprecatedComparisonOperatorsList,
  V as getOwnPropNames,
  j as hasLength,
  I as hasValue,
  m as isArrayFull,
  F as isArrayStrings,
  B as isBoolean,
  G as isDate,
  et as isDateString,
  O as isEqual,
  Z as isFalse,
  st as isFunction,
  Y as isIn,
  u as isNil,
  P as isNull,
  U as isNumber,
  tt as isNumeric,
  l as isObject,
  X as isObjectFull,
  T as isString,
  d as isStringFull,
  z as isTrue,
  b as isUndefined,
  $ as isValue,
  L as objKeys,
  S as sortOrdersList,
  D as validateComparisonOperator,
  W as validateCondition,
  R as validateFields,
  v as validateJoin,
  k as validateNumeric,
  it as validateParamOption,
  M as validateSort,
  rt as validateUUID
};
