import { RequestQueryBuilder } from "../src";

const qb = RequestQueryBuilder.create();
qb
 .select(["a", "a1", "a2"])
 .setFilter({
  field: "a",
  operator: "$eq",
  value: "a",
 })
 .setJoin([
  {
   field: "x",
   select: ["x1", "x2", "x3"],
  },
  {
   field: "x2",
   select: ["x1", "x2", "x3"],
  },
  {
   field: "x3",
   select: ["x1", "x2", "x3"],
  },
  {
   field: "x4",
   select: ["x1", "x2", "x3"],
  },
  {
   field: "x5",
   select: ["x1", "x2", "x3"],
  },
 ])
 .setFilter({
  field: "a2",
  operator: "$eq",
  value: '"a111"',
 });

console.log(qb.query());
